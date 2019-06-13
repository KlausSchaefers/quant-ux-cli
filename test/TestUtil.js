export function print(screen, grid = false) {
    let res = []
    printElement(res, screen, '', grid)
    return res.join('\n')
}

function printElement(res, e, space='', grid) {
    let actions = e.lines ? ' -> ' + e.lines.map(l => l.event + ':' + l.screen.name) : '' 
    let row = e.row ? e.row : ''
    let pos = grid ? e.x + 'x' + e.y : ''
    res.push(`${space}${e.name} - (${e.type})  ${pos}  ${row}  ${actions} `)
    if (e.children) {
        e.children.forEach(c => {
            printElement(res, c, space + '  ', grid)
        });
    }
}