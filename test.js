

const MyPromise = require('./MyPromise')

const p1 = new MyPromise((resolve, reject) => {
    setTimeout(() => {
        resolve('success')
    }, 1000)
    // reject('fail')
})

p1.then(v => {
    console.log('1', v)
    return new MyPromise((resolve,reject) =>{
        resolve('122223')
    })
}, (err) => {
    console.log('2', err)
}).then(v => {
    console.log('next', v)
})

