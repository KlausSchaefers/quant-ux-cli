import * as Util from './ExportUtil'

/**
 * This class transforms an absolute quant-ux model into an
 * kind of HTML model, where the elements have a real parent
 * child relation child
 */
export default class ModelTransformer {

    constructor (app, grid = false) {
        this.model = app
        this.rowContainerID = 0
        this.columnContainerID = 0
        this.removeSingleLabels = true
        this.isGrid = grid

        this.textProperties = [
			'color', 'textDecoration', 'textAlign', 'fontFamily',
			'fontSize', 'fontStyle', 'fontWeight', 'letterSpacing', 'lineHeight'
		]
    }

    transform (relative = true, ) {
        let result = {
            id: this.model.id,
            name: this.model.name,
            templates: this.model.templates ? Object.values(this.model.templates): [],
            warnings: [],
            screens: []
        }

        /**
         * Before we start, we create an inherited model!
         */
        this.model = Util.createInheritedModel(this.model)

        /**
         * Embedd links
         */
        this.model = this.addActions(this.model)

        /**
         * FIXME: We should fix doubles names. With mastre screens
         * we could have overwites! We could rename them, but this
         * would have to be consistant in all screens!
         */
        for (let screenID in this.model.screens){
            let screen = this.model.screens[screenID]
            let children = screen.children
            let names = children.map(c => this.model.widgets[c].name)
            let count = {}
            names.forEach(n => {
                if (count[n]) {
                    result.warnings.push(`Dubplicate name of element '${n}' in screen '${screen.name}'`)
                }
                count[n] = true
            })
        }


        for (let screenID in this.model.screens){
            let screen = this.model.screens[screenID]
            /**
             * First we build a hirachical parent child relation.
             */
            screen = this.transformScreenToTree(screen)

            /**
             * If we do not do a responsive layout we have to add rows
             * and columns to make 'old school' layout.
             */
            if (!this.isGrid) {
                /**
                 * now check for every node in the tree if
                 * we have a single row and add containers
                 */
                screen = this.addRows(screen)
                screen = this.addRowContainer(screen)

                /**
                 * now check in every containering box (parent != null)
                 * if we have columns. If so, add also a container
                 */
                screen = this.addColumns(screen)
                screen = this.addColumnsContainer(screen)

                /**
                 * cleanup single containers. It can happen
                 * that a row gets one column...
                 */
                screen = this.cleanUpContainer(screen)

                /**
                 * Order elements and set relative positions
                 */
                screen = this.setOrderAndRelativePositons(screen, relative)

            } else {
                /**
                 * FIXME: add also rows. We still need to sort it somehow
                 */
                screen = this.addRows(screen)
                screen = this.addRowContainer(screen)

                screen = this.addGrid(screen)
            }
            
            /**
             * set screen pos to 0,0
             */
            screen.children.forEach(c => {
                c.parent = screen
            })
            screen.x = 0
            screen.y = 0

            result.screens.push(screen)
        }

        if (this.removeSingleLabels) {
            this.attachSingleLabels(result)
        }

        /**
         * If we have warnings, lets print them
         */
        result.warnings.forEach(w => {
            console.warn(w)
        })

        return result
    }

    addGrid (screen) {
        this.addGridToElements(screen)
        return screen
    }

    addGridToElements (parent) {
        let grid = this.computeGrid(parent)
        if (grid) {
            parent.grid = grid
            if (parent.children && parent.children.length > 0) {
                parent.children.forEach(e => {
                    e.gridColumnStart = 0
                    e.gridColumnEnd = grid.columns.length
                    e.gridRowStart = 0
                    e.gridRowEnd = grid.rows.length
                    grid.columns.forEach((c, i) => {
                        if (c.v === e.x) {
                            e.gridColumnStart =  i
                        }
                        if (c.v === e.x + e.w) {
                            e.gridColumnEnd =  i
                        }
                    })
                    grid.rows.forEach((r, i) => {
                        if (r.v === e.y) {
                            e.gridRowStart =  i
                        }
                        if (r.v === e.y + e.h) {
                            e.gridRowEnd =  i
                        }
                    })
                })
            }
        }
        
        if (parent.children && parent.children.length > 0) {
            parent.children.forEach(c => {
                this.addGridToElements(c)
            })
        }
        return parent
    }

    computeGrid (parent) {  
        if (parent.children && parent.children.length > 0) {
            let rows = {}
            let columns = {}

            /**
             * Collect all the relevant lines. First the parent
             * then all the children
             */
            this.addGridColumns(columns, 0, parent, true)
            this.addGridColumns(columns, parent.w, parent, false)
            this.addGridRow(rows, 0, parent, true)
            this.addGridRow(rows, parent.h, parent, false)

            parent.children.forEach(c => {
                this.addGridColumns(columns, c.x, c, true)
                this.addGridColumns(columns, c.x + c.w, c, false)
                this.addGridRow(rows, c.y, c, true)
                this.addGridRow(rows, c.y + c.h, c, false)
            })
          
            /**
             * Set the width and convert objects to arrays
             */
            columns = this.setGridColumnWidth(columns, parent)
            rows = this.setGridRowHeight(rows, parent)

            /**
             * determine fixed columns and rows
             */
            this.setFixed(parent, columns, rows)

            return {
                rows: rows,
                columns: columns
            }
        }
        return null
    }

    setFixed (parent, columns, rows) {
         /**
          * Set fixed. For ech child check if the 
          * 1) We have fixed Vertical or Horizontal
          * 2) If pinned. e.g. if pinned right, all
          *    columns < e.v must be fixed
          */
        parent.children.forEach(e => {
            if (Util.isFixedHorizontal(e)) {
                columns.forEach(column => {
                    if (column.v >= e.x && column.v < e.x + e.w) {
                        column.fixed = true
                    }
                })
            }
            if (Util.isPinnedLeft(e)) {
                columns.forEach(column => {
                    if (column.v < e.x) {
                        column.fixed = true
                    }
                })
            }
            if (Util.isPinnedRight(e)) {
                columns.forEach(column => {
                    if (column.v >= e.x + e.w) {
                        column.fixed = true
                    }
                })
            }

            if (Util.isFixedVertical(e)) {
                rows.forEach(row => {
                    if (row.v >= e.y && row.v < e.y + e.h) {
                        row.fixed = true
                    }
                })
            }

            if (Util.isPinnedUp(e)) {
                rows.forEach(row => {
                    if (row.v < e.y) {
                        row.fixed = true
                    }
                })
            }
            if (Util.isPinnedDown(e)) {
                rows.forEach(row => {
                    if (row.v >= e.y + e.h) {
                        row.fixed = true
                    }
                })
            }
        })
    }

    setGridColumnWidth (columns, parent) {
        columns = Object.values(columns).sort((a,b) => a.v - b.v)
        columns.forEach((column, i) => {
            if (columns[i + 1]) {
                column.l = columns[i + 1].v - column.v
            } else {
                column.l = parent.w - column.v
            }
        })
        return columns.filter(c => c.l > 0)
    }

    setGridRowHeight (rows, parent) {
        rows = Object.values(rows).sort((a,b) => a.v - b.v)
        rows.forEach((row, i) => {
            if (rows[i + 1]) {
                row.l = rows[i + 1].v - row.v
            } else {
                row.l = parent.h - row.v
            }
        })
        return rows.filter(r => r.l > 0)
    }

    addGridColumns (columns, x, e, start) {
        if (!columns[x]) {
            columns[x] = {
                v: x,
                start: [],
                end: [],
                fixed: false
            }
        }
        if (start) {
            columns[x].start.push(e)
        } else {
            columns[x].end.push(e)
        }
    }

    addGridRow (rows, y, e, start) {
        if (!rows[y]) {
            rows[y] = {
                v: y,
                start: [],
                end: [],
                fixed: false
            }
        }
        if (start) {
            rows[y].start.push(e)
        } else {
            rows[y].end.push(e)
        }
    }

    setOrderAndRelativePositons (parent, relative) {
        let nodes = parent.children
        if (parent.type === 'row'){
            nodes.sort((a,b) => {
                return a.x - b.x
            })
            if (relative) {
                let last = 0
                nodes.forEach((n,i) => {
                    let x = n.x - last
                    last = n.x + n.w
                    n.x = x
                    n.c = i
                })
            }
        } else {
            nodes.sort((a,b) => {
                return a.y - b.y
            })
            if (relative) {
                let last = 0
                nodes.forEach((n,i) => {
                    let y = n.y - last
                    last = n.y + n.h
                    n.y = y
                    n.r = i
                })
            }
        }

        nodes.forEach(n => {
            if (n.children && n.children.length > 0 ){
                this.setOrderAndRelativePositons(n, relative)
            }
        })

        return parent
    }

    addActions (model) {
        Object.values(model.widgets).forEach(w => {
            let lines = Util.getLines(w, model, true)
            if (lines.length > 0) {
                w.lines = lines
                lines.forEach(l => {
                    let screen = model.screens[l.to]
                    if (screen) {
                        l.screen = screen
                    }
                })
            }
        })
        return model
    }


	attachSingleLabels (model) {
		model.screens.forEach(screen => {
			screen.children.forEach(child => {
				this.attachSingleLabelsInNodes(child)
			})
		})
		return model
	}

	attachSingleLabelsInNodes (node) {
		/**
		 * If we have a box that has NO label props and contains
		 * only one child of type label, we merge this in.
		 */
		if (!node.props.label && node.children.length === 1) {
			let child = node.children[0]
			if (child.type === 'Label') {
				node.props.label = child.props.label
				node.children = []
				this.textProperties.forEach(key => {
					if (child.style[key]) {
						node.style[key] = child.style[key]
					}
				})
				node.style.paddingTop = child.y
				node.style.paddingLeft = child.x
				node.style = Util.fixAutos(node.style, child)
			}
		} else {
			node.children.forEach(child => {
				this.attachSingleLabelsInNodes(child)
			})
		}
	}



    cleanUpContainer (parent) {
        let nodes = parent.children

        nodes.forEach(node => {
            if (node.children.length === 1) {
                let child = node.children[0]
                if (this.isEqualBox(node, child)) {
                    node.children = child.children
                    node.children.forEach(c => {
                        c.parent = node
                    })
                }
            }
        })

        /**
         * Go down recursive
         */
        nodes.forEach(a => {
            if (a.children && a.children.length > 0 ){
                this.cleanUpContainer(a)
            }
        })
        return parent
    }

    addColumnsContainer (parent) {
        let nodes = parent.children

        let newChildren = []
        let columns = {}
        nodes.forEach(a => {
            if (a.column) {
                if (!columns[a.column]) {
                    columns[a.column] = []
                }
                columns[a.column].push(a)
            } else {
                newChildren.push(a)
            }
        })

        /**
         * For each row create a container and reposition the children
         */
        for (let column in columns) {
            let children =  columns[column]
            let hasParent = children.reduce((a,b) => b.parent != null & a, true)
            if (hasParent) {
                let boundingBox = Util.getBoundingBoxByBoxes(children)
                let container = {
                    id: 'c' + this.columnContainerID++,
                    name: `Column ${this.columnContainerID}`,
                    children: children,
                    x: boundingBox.x,
                    y: boundingBox.y,
                    h: boundingBox.h,
                    w: boundingBox.w,
                    type: 'column',
                    parent: parent,
                    style: {},
                    props: {
                        resize: {
                            right: false,
                            up: false,
                            left: false,
                            down: false,
                            fixedHorizontal: false,
                            fixedVertical: false
                        }
                    }
                }
                children.forEach(c => {
                    c.x = c.x - container.x,
                    c.y = c.y - container.y,
                    c.parent = container
                    this.mergeInResponsive(container, c)
                })
                newChildren.push(container)
            } else {
                newChildren = children.concat(newChildren)
            }
        }
        parent.children = newChildren

        /**
         * Go down recursive
         */
        nodes.forEach(a => {
            if (a.children && a.children.length > 0 ){
                this.addColumnsContainer(a)
            }
        })
        return parent
    }

    mergeInResponsive (container, c) {
        container.props.resize.right = container.props.resize.right || Util.isPinnedRight(c)
        container.props.resize.left = container.props.resize.left || Util.isPinnedLeft(c)
        container.props.fixedHorizontal = container.props.fixedHorizontal || Util.isFixedHorizontal(c)
    }

    addColumns (parent) {
        let nodes = parent.children
        // let rows = []
        let columnIDs = 0
        nodes.forEach(a => {
            // console.debug(' addColumns()', a.name, ' @', parent.name)
            nodes.forEach(b => {
                if (a.id !== b.id) {
                    if (this.isOverLappingX(a,b) && a.parent) {
                        // console.debug('  same row', a.name, b.name)
                        /**
                         * If we have now row, create a new id for a
                         */
                        if (!a.column) {
                            a.column = columnIDs++
                        }
                        /**
                         * If b has no row, we put it in the same row as
                         * a
                         */
                        if (!b.column) {
                            b.column  = a.column
                        } else {
                            let oldId = b.column
                            let newId = a.column
                            /**
                             * if b has already a row, we merge row a & b
                             */
                            nodes.forEach(c => {
                                if (c.column === oldId) {
                                    c.column = newId
                                }
                            })
                        }
                    }
                }

                /**
                 * no step down recursive
                 */
                if (a.children && a.children.length > 0 ){
                   this.addColumns(a)
                }
            })
        })
        return parent
    }

    addRowContainer (parent) {
        let nodes = parent.children

        let newChildren = []
        let rows = {}
        nodes.forEach(a => {
            if (a.row) {
                if (!rows[a.row]) {
                    rows[a.row] = []
                }
                rows[a.row].push(a)
            } else {
                newChildren.push(a)
            }
        })

        /**
         * For each row create a container and reposition the children
         */
        for (let row in rows) {
            let children = rows[row]
            let boundingBox = Util.getBoundingBoxByBoxes(children)
            let container = {
                id: 'r' + this.rowContainerID++,
                name: `Row ${this.rowContainerID}`,
                children: children,
                x: boundingBox.x,
                y: boundingBox.y,
                h: boundingBox.h,
                w: boundingBox.w,
                type: 'row',
                parent: parent,
                style: {},
                props: {
                    resize: {
                        right: false,
                        up: false,
                        left: false,
                        down: false,
                        fixedHorizontal: false,
                        fixedVertical: false
                    }
                }
            }
            children.forEach(c => {
                c.x = c.x - container.x,
                c.y = c.y - container.y,
                c.parent = container
                this.mergeInResponsive(container, c)
            })
            newChildren.push(container)
        }
        parent.children = newChildren

        /**
         * Go down recursive
         */
        nodes.forEach(a => {
            if (a.children && a.children.length > 0 ){
                this.addRowContainer(a)
            }
        })
        return parent
    }

    addRows (parent) {
        let nodes = parent.children
        nodes.sort((a, b) => {
            return a.y - b.y
        })
        // let rows = []
        let rowIDs = 1
        nodes.forEach(a => {
            // console.debug(' addRows()', a.name)
            nodes.forEach(b => {
                if (a.id !== b.id) {
                    if (this.isOverLappingY(a,b)) {
                        /**
                         * FIXME: We have here an issue of the elements in the row are overlapping
                         */
                        // console.debug('    addRows overlap', a.name, b.name, this.isTop(b, a), this.isBottom(b, a))
                        /**
                         * If we have now row, create a new id for a
                         */
                        if (!a.row) {
                            a.row = rowIDs++
                        }
                      
                        /**
                         * If b has no row, we put it in the same row as
                         * a
                         */
                        if (!b.row) {
                            b.row  = a.row
                        } else {
                            let oldId = b.row
                            let newId = a.row
                            /**
                             * if b has already a row, we merge row a & b
                             */
                            nodes.forEach(c => {
                                if (c.row === oldId) {
                                    c.row = newId
                                }
                            })
                        }
                        //console.debug('    addRows() > Same row', a.name, ' == ',b.name, ' >> ',  a.row, b.row)
                    }
                }

                /**
                 * no step down recursive
                 */
                if (a.children && a.children.length > 0 ){
                   this.addRows(a)
                }
            })
        })
        return parent
    }

    /**
     * Transforms and screen into a hiearchical presentation. return the root node.
     * @param {MATCScreen} screen
     */
    transformScreenToTree(screen) {
        let result = this.clone(screen)
        delete result.children;
        delete result.has;
        result.children = []

        /**
         * Get widget in render order. This is important to derive the
         * parent child relations.
         */
        let widgets = Util.getOrderedWidgets(this.getWidgets(screen));

        /**
         *  now build child parent relations
         */
        let parentWidgets = []
        let elementsById = {}
        widgets.forEach(widget => {
            let element = this.clone(widget);
            element.children = []
            delete element.has

            /**
             * Check if the widget has a parent (= is contained) widget.
             * If so, calculate the relative position to the parent,
             * otherwise but the element under the screen.
             */
            let parentWidget = this.getParentWidget(parentWidgets, element)
            if (parentWidget) {
                element.x = widget.x - parentWidget.x
                element.y = widget.y - parentWidget.y
                element.parent = parentWidget
                elementsById[parentWidget.id].children.push(element)
            } else {
                element.x = widget.x - screen.x
                element.y = widget.y - screen.y
                element.parent = null;
                result.children.push(element)
            }
            /**
             * Save the widget, so we can check in the next
             * iteation if this is a parent or not!
             */
            parentWidgets.unshift(widget)
            elementsById[element.id] = element
        })
        return result;
    }

    getParentWidget (potentialParents, element){
        for (let p=0;p< potentialParents.length; p++){
            let parent = potentialParents[p];
            if (Util.isContainedInBox(element, parent)){
                return parent
            }
        }
    }

    getWidgets (screen) {
        let widgets = [];
        for(let i=0; i < screen.children.length; i++){
            let id = screen.children[i];
            let widget = this.model.widgets[id];
            widgets.push(widget);
        }
        return widgets
    }

    clone (obj) {
        return JSON.parse(JSON.stringify(obj))
    }


	isOverLappingX(pos, box) {
		return !this.isLeft(pos, box) && !this.isRight(pos, box);
	}

	isOverLappingY(pos, box) {
		return !this.isTop(pos, box) && !this.isBottom(pos, box);
	}

    isTop(from, to) {
		return (from.y) > (to.y + to.h);
	}

	isStartingTop(from, to) {
		return (from.y) >= (to.y); // && (from.y + from.h) <= (to.y + to.h);
	}

	isBottom(from, to) {
      
		return (from.y + from.h) < (to.y);
	}

	isLeft(from, to) {
		return (from.x) > (to.x + to.w);
	}

	isStartingLeft(from, to) {
		return (from.x) >= (to.x);
	}

	isRight(from, to) {
		return (from.x + from.w) < (to.x);
    }

    isEqualBox (parent, child) {
        return child.x === 0 && child.y === 0 && parent.w === child.w && parent.h === child.h
    }

}
