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


function getAllChildren(node, result){
    if (node.children) {
       node.children.forEach(child => {
            result.push(child)
            getAllChildren(child, result)
        });
    }
}