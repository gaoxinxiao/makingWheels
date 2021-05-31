

const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'



class MyPromise {
    constructor(executor) {
        // executor 是一个执行器，进入会立即执行
        // 并传入resolve和reject方法
        try {
            executor(this.resolve, this.reject)
        } catch (e) {
            this.reject(e)
        }
    }

    static resolve(parameter) {
        if (parameter instanceof MyPromise) {
            return parameter
        }
        return new MyPromise(resolve => {
            return resolve(parameter)
        })
    }

    static reject(reason) {
        return new MyPromise((resolve,reject) => {
            reject(reason)
        })
    }

    //成功的回调函数
    onFulfilledCallback = []

    //失败的回调函数
    onRejectedCallback = []

    //存储变量初始值是pending
    status = PENDING

    //存储正常的值
    value = null

    //存储错误的原因
    reason = null

    resolve = (v) => {
        //成功回掉函数
        if (this.status === PENDING) {
            this.status = FULFILLED
            this.value = v
            while (this.onFulfilledCallback.length) {
                let cb = this.onFulfilledCallback.shift()
                cb(v)
            }
        }
    }

    reject = (v) => {
        //失败回调函数
        if (this.status === PENDING) {
            this.status = REJECTED
            this.reason = v
            while (this.onRejectedCallback.length) {
                let cb = this.onRejectedCallback.shift()
                cb(v)
            }
        }
    }

    then (onFulfilled, onRejected) {
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value
        onRejected = typeof onRejected === 'function' ? onRejected : reason => { throw reason }
        const promise2 = new MyPromise((resolve, reject) => {

            if (this.status === FULFILLED) {
                //  创建微任务等待 promise2完成初始化
                queueMicrotask(() => {
                    //  获取执行成功回调函数的结果
                    try {
                        const x = onFulfilled(this.value)
                        resolvePromise(promise2, x, resolve, reject)
                    } catch (e) {
                        reject(e)
                    }
                })
            } else if (this.status === REJECTED) {
                queueMicrotask(() => {
                    //  获取执行失败回调函数的结果
                    try {
                        const x = onRejected(this.reason)
                        resolvePromise(promise2, x, resolve, reject)
                    } catch (e) {
                        reject(e)
                    }
                })
            } else if (this.status === PENDING) {
                this.onFulfilledCallback.push(() => {
                    queueMicrotask(() => {
                        //  获取执行成功回调函数的结果
                        try {
                            const x = onFulfilled(this.value)
                            resolvePromise(promise2, x, resolve, reject)
                        } catch (e) {
                            reject(e)
                        }
                    })
                })
                this.onRejectedCallback.push(() => {
                    queueMicrotask(() => {
                        //  获取执行失败回调函数的结果
                        try {
                            const x = onRejected(this.reason)
                            resolvePromise(promise2, x, resolve, reject)
                        } catch (e) {
                            reject(e)
                        }
                    })
                })
            }
        })
        return promise2
    }
}

function resolvePromise(promise2, x, resolve, reject) {
    if (promise2 === x) {
        return reject(new TypeError('Chaining cycle datected for promise #<Promise>'))
    }
    if (typeof x === 'object' || typeof x === 'function') {
        //x 为null直接返回，否则走后面的逻辑回报错
        if (x === null) {
            return resolve(x)
        }

        let then
        try {
            then = x.then
        } catch (err) {
            return reject(err)
        }

        //  如果then是函数

        if (typeof then === 'function') {
            let called = false;
            try {
                then.call(
                    x,// this 指向x
                    //如果resolvePromise以值y为参数被调用，则运行 [[resolve]](promise,y)
                    y => {
                        //如果 resolvePromise 和 rejectPromise均被调用
                        //或者被同一参数调用了多次，则优先采用首次调用并忽略剩下的调用
                        //实现这条需要前面加一个变量 called
                        if (called) return
                        called = true
                        resolvePromise(promise2, y, resolve, reject)
                    },
                    //如果 rejectPromise以据因r为参数被调用，则以据因r拒绝promise
                    r => {
                        if (called) return
                        called = true
                        reject(r)
                    }
                )
            } catch (err) {
                //如果调用then方法抛出了异常error
                //如果resolvePromise或rejectPromise 已经被调用，直接返回
                if (called) return;
                //否则以err为据因拒绝 promise
                reject(err)
            }
        } else {
            //如果then不是函数，以x为参数执行promise
            resolve(x)
        }
    } else {
        //如果x不为对象或者函数，以x为参数执行 promise
        resolve(x)
    }
}

MyPromise.deferred = function () {
    var result = {};
    result.promise = new MyPromise(function (resolve, reject) {
        result.resolve = resolve
        result.reject = reject
    })
    return result
}

module.exports = MyPromise