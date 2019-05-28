
export function removeCommonPath (a, b) {
    let path = []
    let aParts = a.split('/')
    let bParts = b.split('/')
    let different = false
    aParts.forEach((p, i) => {
        if (p !== bParts[i] || different) {
            path.push(p)
            different = true
        }
    })
    return path.join('/')
}



/**
 * Generates the css for a given screen. Includes the styles for the screen and all
 * its children. Certain elements, like common, might be excluded.
 *
 * @param {*} screen The screen to genearte for
 * @param {*} code The code object with the styles
 * @param {*} exclude An array of types to be exluded, e.g ['template']
 */
export function getScreenCSS (screen, code, exclude) {
    let css = ''
    let normalize = code.styles['$NORMALIZE']
    if (normalize) {
        css += normalize.map(s => s.code).join('\n')
    }
    css += screen.styles.map(s => s.code).join('\n')
    let elements = getAllChildrenForScreen(screen)
    let written = []
    elements.forEach(element => {
        let styles = code.styles[element.id]
        if (exclude) {
            styles = styles.filter(s => exclude.indexOf(s.type) < 0)
        }
        styles.forEach(s => {
            if (!written[s.css]) {
                css += s.code + '\n'
                written[s.css] = true
            }
        })
        // css += styles.map(s => s.code).join('\n')
    })
    return css
}

export function getAllChildrenForScreen(screen) {
    const result = []
    if (screen.model.children) {
        screen.model.children.forEach(child => {
            result.push(child)
            getAllChildren(child, result)
        });
    }
    return result
}

export function fixAutos (style, widget) {
    if (style.fontSize === 'Auto') {
        style.fontSize = widget.h
    }
    return style
}

/**
 * FIX for old models without z-value
 */
function fixMissingZValue (box) {
    if (box.z === null || box.z === undefined) {
        box.z = 0;
    }
}

/**
 * Get children
 */
export function getOrderedWidgets (widgets) {
    var result = [];
    for (var id in widgets) {
        var widget = widgets[id];
        if (widget) {
            fixMissingZValue(widget);
            result.push(widget);
        }
    }
    sortWidgetList(result);
    return result;
}

/**
 * Sort Screen children to render them in the correct order!
 *
 * Pass the children as parameter
 */
export function sortChildren (children) {
    var result = [];
    for (var i = 0; i < children.length; i++) {
        var widgetID = children[i];
        var widget = this.model.widgets[widgetID];
        if (widget) {
            fixMissingZValue(widget);
            result.push(widget);
        }
    }

    sortWidgetList(result);

    //console.debug("sortChildren > ", result);
    return result;
}

/**
 * This method is super important for the correct rendering!
 *
 * We sort by:
 *
 *  1) style.fixed: fixed elements will be renderd last, therefore they come
 *  as the last elements in the list
 *
 * 	2) inherited : inherited values come first. They shall be rendered below the
 *  widget of the new screen
 *
 *  3) z : High z values come later
 *
 *  4) id: if the z value is the same, sort by id, which means the order the widgets have been
 *  added to the screen.
 */
export function sortWidgetList (result) {
    /**
     * Inline function to determine if a widget is fixed.
     * we have to check if style exists, because the Toolbar.onToolWidgetLayer()
     * call the method without styles.
     */
    var isFixed = function(w) {
        if (w.style && w.style.fixed) {
        return true;
        }
        return false;
    };

    result.sort(function(a, b) {
        var aFix = isFixed(a);
        var bFix = isFixed(b);

        /**
         * 1) Sort by fixed. If both are fixed or not fixed,
         * continue sorting by inherited.
         */
        if (aFix == bFix) {
        /**
         * If both a inherited or not inherited,
         * continue sorting by z & id
         */
        if ((a.inherited && b.inherited) || (!a.inherited && !b.inherited)) {
            /**
             * 4) if the have the same z, sot by id
             */
            if (a.z == b.z && (a.id && b.id)) {
            return a.id.localeCompare(b.id);
            }

            /**
             * 3) Sort by z. Attention, Chrome
             * needs -1, 0, 1 or one. > does not work
             */
            return a.z - b.z;
        }
        if (a.inherited) {
            return -1;
        }

        return 1;
        }
        if (aFix) {
        return 1;
        }
        return -1;
    });
}



function getAllChildren(node, result){
    if (node.children) {
       node.children.forEach(child => {
            result.push(child)
            getAllChildren(child, result)
        });
    }
}

export function isContainedInBox (obj, parent) {
    if (parent) {
        if (
            obj.x >= parent.x &&
            obj.x + obj.w <= parent.w + parent.x &&
            (obj.y >= parent.y && obj.y + obj.h <= parent.y + parent.h)
            ) {
            return true;
        }
    }
    return false;
}


export function getBoundingBoxByBoxes (boxes) {
    var result = { x: 100000000, y: 100000000, w: 0, h: 0 };

    for (var i = 0; i < boxes.length; i++) {
        var box = boxes[i];
        result.x = Math.min(result.x, box.x);
        result.y = Math.min(result.y, box.y);
        result.w = Math.max(result.w, box.x + box.w);
        result.h = Math.max(result.h, box.y + box.h);
    }

    result.h -= result.y;
    result.w -= result.x;

    return result;
}



function getZoomed(v, zoom) {
    return Math.round(v * zoom);
}

function getUnZoomed(v, zoom) {
    return Math.round(v / zoom);
}

function getZoomedBox(box, zoomX, zoomY) {
    if (box.x) {
        box.x = this.getZoomed(box.x, zoomX);
    }

    if (box.y) {
        box.y = this.getZoomed(box.y, zoomY);
    }

    if (box.w) {
        box.w = this.getZoomed(box.w, zoomX);
    }

    if (box.h) {
        box.h = this.getZoomed(box.h, zoomY);
    }

    if (box.min) {
        box.min.h = this.getZoomed(box.min.h, zoomY);
        box.min.w = this.getZoomed(box.min.w, zoomX);
    }

    box.isZoomed = true;

    return box;
}


  export function createInheritedModel(model) {
    /**
     * Build lookup map for overwrites
     */
    var overwritenWidgets = {};
    for (let screenID in model.screens) {
        let screen = model.screens[screenID];
        overwritenWidgets[screenID] = {};
        for (let i = 0; i < screen.children.length; i++) {
            let widgetID = screen.children[i];
            let widget = model.widgets[widgetID];
            if (widget && widget.parentWidget) {
                overwritenWidgets[screenID][widget.parentWidget] = widgetID;
            }
        }
    }


    var inModel = clone(model);
    inModel.inherited = true;

    /**
     * add container widgets
     */
    createContaineredModel(inModel)

    /**
     * add widgets from parent (master) screens
     */
    for (let screenID in inModel.screens) {
        /**
         * *ATTENTION* We read from the org model, otherwise we have
         * issues in the loop as we change the screen.
         */
        let screen = model.screens[screenID];
        if (screen.parents && screen.parents.length > 0) {
            /**
             * add widgets from parent screens
             */
            for (let i = 0; i < screen.parents.length; i++) {
                let parentID = screen.parents[i];
                if (parentID != screenID) {
                    if (model.screens[parentID]) {
                        /**
                         * *ATTENTION* We read from the org model, otherwise we have
                         * issues in the loop as we change the screen!
                         */
                        let parentScreen = model.screens[parentID];

                        let difX = parentScreen.x - screen.x;
                        let difY = parentScreen.y - screen.y;

                        let parentChildren = parentScreen.children;
                        for (var j = 0; j < parentChildren.length; j++) {
                            let parentWidgetID = parentChildren[j];

                            /**
                             * *ATTENTION* We read from the org model, otherwise we have
                             * issues in the loop as we change the screen!
                             */
                            let parentWidget = model.widgets[parentWidgetID];
                            if (parentWidget) {
                                let overwritenWidgetID = overwritenWidgets[screenID][parentWidgetID];
                                if (!overwritenWidgetID) {
                                    let copy = clone(parentWidget);

                                    /**
                                     * Super important the ID mapping!!
                                     */
                                    copy.id = parentWidget.id + "@" + screenID;
                                    copy.inherited = parentWidget.id;
                                    copy.inheritedScreen = screenID;
                                    copy.inheritedOrder = i + 1;

                                    /**
                                     * Now lets also put it at the right position!
                                     */
                                    copy.x -= difX;
                                    copy.y -= difY;

                                    /**
                                     * We write the new widget to the inherited model!
                                     *
                                     */
                                    inModel.widgets[copy.id] = copy;
                                    inModel.screens[screenID].children.push(copy.id);

                                    /**
                                     * Also add a to the inherited copies
                                     * so we can to live updates in canvas
                                     */
                                    let parentCopy = inModel.widgets[parentWidget.id];
                                    if (!parentCopy.copies) {
                                        parentCopy.copies = [];
                                    }
                                    parentCopy.copies.push(copy.id);
                                } else {
                                    let overwritenWidget = inModel.widgets[overwritenWidgetID];

                                    if (overwritenWidget) {
                                        overwritenWidget.props = mixin(clone(parentWidget.props),overwritenWidget.props,true);
                                        overwritenWidget.style = mixin(clone(parentWidget.style),overwritenWidget.style,true);
                                        if (overwritenWidget.hover) {
                                            overwritenWidget.hover = mixin(clone(parentWidget.hover),overwritenWidget.hover,true);
                                        }
                                        if (overwritenWidget.error) {
                                            overwritenWidget.error = mixin(clone(parentWidget.error), overwritenWidget.error, true);
                                        }

                                        /**
                                         * Also add a reference to the *INHERITED* copies
                                         * so we can to live updates in canvas
                                         */
                                        let parentCopy = inModel.widgets[parentWidget.id];
                                        if (!parentCopy.inheritedCopies) {
                                            parentCopy.inheritedCopies = [];
                                        }
                                        parentCopy.inheritedCopies.push(overwritenWidget.id);

                                        /**
                                         * Also inherited positions
                                         */
                                        if (overwritenWidget.parentWidgetPos) {
                                            overwritenWidget.x = parentWidget.x - difX;
                                            overwritenWidget.y = parentWidget.y - difY;
                                            overwritenWidget.w = parentWidget.w;
                                            overwritenWidget.h = parentWidget.h;
                                        }
                                        overwritenWidget._inheried = true;
                                    } else {
                                        console.error("createInheritedModel() > No overwriten widget in model");
                                    }
                                }
                            } else {
                                console.warn("createInheritedModel() > no parent screen child with id > " + parentID + ">" + parentWidget);
                            }
                        }
                    } else {
                        console.warn("createInheritedModel() > Deteced Self inheritance...", screen);
                    }
                } else {
                    console.warn("createInheritedModel() > no parent screen with id > " + parentID);
                }
            }
        }
    }
    return inModel;
}

export function createContaineredModel(inModel) {
    for (let screenID in inModel.screens) {
        let screen = inModel.screens[screenID];
        for (let i = 0; i < screen.children.length; i++) {
            let widgetID = screen.children[i];
            let widget = inModel.widgets[widgetID];
            if (widget) {
                if (widget.isContainer){
                    let children = getContainedChildWidgets(widget, inModel)
                    widget.children = children.map(w => w.id)
                }
            } else {
                /**
                 * FIXME: This can happen for screen copies...
                 */
                // console.warn('Core.createContaineredModel() > cannot find widgte', widgetID)
            }
        }
    }
}

function getContainedChildWidgets (container, model) {
    let result = []
    /*
     * Loop over sorted list
     */
    let sortedWidgets = getOrderedWidgets(model.widgets)
    let found = false
    for (let i = 0; i < sortedWidgets.length; i++){
        let widget = sortedWidgets[i]
         if (container.id != widget.id) {
            if (found && isContainedInBox(widget, container)){
                widget.container = container.id
                result.push(widget)
            }
        } else {
            found = true
        }
    }
    return result;
}

export function addContainerChildrenToModel (model) {
    /**
     * Add here some function to add the virtual children, so that stuff
     * works also in the analytic canvas. This would mean we would have to
     * copy all the code from the Repeater to here...
     */
    return model
}


export function mixin(a, b, keepTrack) {
    if (a && b) {
        b = lang.clone(b);
        if (keepTrack) {
            b._mixed = {};
        }

        for (var k in a) {
            if (b[k] === undefined || b[k] === null) {
                b[k] = a[k];
                if (keepTrack) {
                    b._mixed[k] = true;
                }
            }
        }
    }
    return b;
}

export function mixinNotOverwriten(a, b) {
    if (a && b) {
        var mixed = {};
        if (b._mixed) {
            mixed = b._mixed;
        }
        //console.debug("mixinNotOverwriten", overwriten)
        for (var k in a) {
            if (b[k] === undefined || b[k] === null || mixed[k]) {
                b[k] = a[k];
            }
        }
    }
    return b;
}

export function  clone (obj) {
    if (!obj) {
        return null
    }
    let _s = JSON.stringify(obj)
    return JSON.parse(_s)
}