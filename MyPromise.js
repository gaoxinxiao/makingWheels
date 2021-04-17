
const PENDING = 'pending'
const REJECT = 'reject'
const SUCCESS = 'success'

class MyPromise {
    constructor(callback) {
        callback(this.resolve, this.reject)
    }

    status = PENDING

    //存储成功的回调
    onResolveCallback = []

    //存储失败的回调
    onRejectCallback = []

    value = ''
    errval = ''

    resolve = (v) => {
        if (this.status === PENDING) {
            this.status = SUCCESS
            this.value = v

            queueMicrotask(()=>{
                while (this.onResolveCallback.length) {
                    const cb = this.onResolveCallback.shift()
                    cb(this.value)
                }
            })
        }
    }

    reject = (v) => {
        if (this.status === PENDING) {
            this.status = REJECT
            this.errval = v
            while (this.onRejectCallback.length) {
                const cb = this.onRejectCallback.shift()
                cb(this.value)
            }
        }
    }
    then = (onResolve, onReject) => {
        let p1 = new MyPromise((resolve, reject) => {
            if (this.status === SUCCESS) {
                let x = onResolve(this.value)
                if (x instanceof MyPromise){
                    x.then(resolve)
                } else {
                    resolve(x)
                }

            } else if (this.status === REJECT) {
                onReject(this.value)
            } else if (this.status === PENDING) {
                this.onResolveCallback.push(()=>{
                    let x = onResolve(this.value)
                    if (x instanceof MyPromise){
                        x.then(resolve)
                    } else {
                        resolve(x)
                    }
                })
                this.onRejectCallback.push(onReject)
            }
        })
        return p1
    }
}

module.exports = MyPromise