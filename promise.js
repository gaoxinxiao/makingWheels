// new Promise((resolve, reject) => {
// setTimeout(() => {
//     resolve(1)
// }, 1000)
//     resolve(1)
// }).then(v => {
//     console.log('res1', v)
// })

function IPromise(fn) {
    let state = 'padding'
    let value = null
    let callbcaks = []
    this.then = function (onFuilled) {
        return new IPromise((resolve) => {
            handel({
                resolve,
                onFuilled
            })
        })
    }
    function handel(callback) {
        if (state === 'padding') {
            callbcaks.push(callback)
            return
        }
        if (state === 'fulfilled'){
            if (!callback.onFuilled){
                //then没有回调函数的时候继续向下抛数据
                callback.resolve(value)
                return
            }
            let ret = callback.onFuilled(value) //获取到结果继续向下抛
            callback.resolve(ret)
        }
    }
    function handleCb() {
        while (callbcaks.length) {
            const fulfilledFn = callbcaks.shift()
            handel(fulfilledFn)
        }
    }
    function resolve(newVal) {
        const fn = () => {
            if (state !== 'padding') return
            state = 'fulfilled'
            value = newVal
            handleCb()
        }
        setTimeout(fn, 0)
    }
    fn(resolve)

}
new IPromise((resolve, reject) => {
    // setTimeout(() => {
    //     resolve(1)
    // }, 1000)
    resolve('令狐冲')
}).then(v => {
    console.log('res1', v)
    return '风清扬'
}).then(v => {
    console.log('res1', v)
})
