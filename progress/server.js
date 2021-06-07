const http = require('http')
const fs = require('fs')

const server = http.createServer((req, res) => {

    if (req.url === '/') {
        res.writeHead(200, { 'Content-Type': 'text/html;charset=UTF-8' })

        const html = fs.readFileSync('./index.html', 'utf-8')

        res.end(html)
    } else if (req.url === '/api') {
        let data = ''
        let readerStream = fs.createReadStream('./mv1.mp4');

        readerStream.on('data', function (chunk) {
            data += chunk;
        })

        readerStream.on('end', function () {
            res.writeHead(200, { 'Content-Type': 'video/mp4' })
            res.end(JSON.stringify(data))
        });

    }
})



server.listen(8080, () => console.log('启动中....'))