
function formt(str) {
    let arr = str.split('-')
    let list = arr.slice(1, arr.length)
    let res = arr[0]
    while (list.length) {
        let item = list.shift()
        res += item.slice(0, 1).toUpperCase() + item.slice(1, item.length)
    }
    return res
}

formt('get-element-by-id')


function AA(fn, time, dealy) {

    return function fun(v) {

        setTimeout(() => {
            if (time > 0) {
                fn(v)
                fun(v)
            }
            time--
        }, dealy)
    }
}

let bb = AA(console.log, 4, 1000)

// bb('hello')

function handerStr(key) {
    let str = ''
    for (let i = 0; i < key.length; i++) {
        if (key[i].toUpperCase() === key[i]) {
            str += '_' + key[i].toLowerCase()
        } else {
            str += key[i]
        }
    }
    return str.startsWith('_') ? str.replace(/\_/, '') : str
}

function change(obj) {
    let res = {}
    for (let key in obj) {
        if (typeof obj[key] === 'object') {
            res[handerStr(key)] = change(obj[key])
        } else {
            res[handerStr(key)] = obj[key]
        }
    }
    return res
}

console.log(change({
    UserName: 'totot',
    Group: {
        groupName: 'douyin'
    }
}))

/**
 *
 * {
    user_name: 'totot',
    group: {
        group_name: 'douyin'
    }
}
*/
