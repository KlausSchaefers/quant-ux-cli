class ImportUtil {

    get(current, from) {
        let back = []
        let forward = []
        let currentParts = current.split('/')
        let fromParts = from.split('/')     
        let notEqual = false
        for (let i=0; i< currentParts.length; i++) {
            let c = currentParts[i]
            let f = fromParts[i]
            if (c !== f) {
                notEqual = true
            }
            if (notEqual) {
                back.push('..')
                if (f) {
                    forward.push(f)
                }
            }
        }
        return back.join('/')  + '/' + forward.join('/')
    }

}
export default new ImportUtil()