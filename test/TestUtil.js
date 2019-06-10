export function print(screen) {
    let res = []
    printElement(res, screen)
    return res.join('\n')
}

function printElement(res, e, space='') {
    let actions = e.lines ? ' -> ' + e.lines.map(l => l.event + ':' + l.screen.name) : '' 
    res.push(`${space}${e.name} - (${e.type})   ${e.row} ||  ${actions} `)
    if (e.children) {
        e.children.forEach(c => {
            printElement(res, c, space + '  ')
        });
    }
}