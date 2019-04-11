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
        } else {
            var e = new Error("getOrderedWidgets() > no widget with id " + id);
            if (this.logger) {
                this.logger.sendError(e);
            }
        }
    }
    this.sortWidgetList(result);
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

    this.sortWidgetList(result);

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
