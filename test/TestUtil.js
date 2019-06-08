export function print(screen) {
    let res = []
    printElement(res, screen)
    return res.join('\n')
}

function printElement(res, e, space='') {
    res.push(`${space}${e.name} - (${e.type})      @ ${e.row}`)
    if (e.children) {
        e.children.forEach(c => {
            printElement(res, c, space + '  ')
        });
    }
}