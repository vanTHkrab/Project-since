const express = require('express');
const app =express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const open = require('open');
const chokidar = require('chokidar');
const fs = require('fs');
const { JSDOM } = jsdom;

const watcher = chokidar.watch('./carousel', {
    ignoreInitial: ture
})

io.on('connection', socket =>{
    watcher.on('all', ()=>{
        socket.emit('message', 'reload')
    })
})
app.get('/*', (req,res) => {
    if (req.url == '/'){
        fs.readFile('./carousel/index.html', 'utf-8', (err, data) => {
            const dom = new JSDOM(data)

            const scriptSocketLink = dom.window.document.createElement('script');
            scriptSocketLink.src = 'https://cdn.socket.io/socket.io-3.0.0.min.js';
            dom.window.document.head.appendChild(scriptSocketLink)

            const scriptSocketCode = dom.window.document.createElement('script');
            scriptSocketCode.text = `
                const socket = io()
                sockent.on('message', (data) =>{
                    if (data == 'reload) {
                        location.reload();
                    }
                })
            `
            dom.window.document.head.appendChild(scriptSocketCode)

            res.send(dom.serialize())
        })
    } else {
        res.sendFile(__dirname + '/carousel'+ releaseEvents.url)
    }
})

http.listen(5000);

open('http://localhost:5000/')