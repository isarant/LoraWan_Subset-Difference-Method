const express = require('express')
var bodyParser = require('body-parser');

const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 1337 });
var multer = require('multer'); // v1.0.5
var upload = multer(); // for parsing multipart/form-data


function broadcast(data) {
    wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
        }
    });
}

wss.on('connection', function connection(ws) {
    console.log('Connected');
    ws.on('message', function incoming(data) {
        console.log('Recieve');
        console.log(data);
    });
});


const app = express()
const port = 3001
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/uplink', upload.array(), (req, res, next) => {
    console.log('uplink');
    console.log(req.body);
    console.log(req);
    res.send('OK');
    if (req.body !== undefined)
        broadcast(req.body);

})

app.post('/join', (req, res) => {
    console.log(req.body);
    console.log('join');
    res.send('OK');
    if (req.body !== undefined)
        broadcast(req.body);
})

app.post('/status', (req, res) => {
    console.log(req.body);
    console.log('status');
    res.send('OK');
    if (req.body !== undefined)
        broadcast(req.body);
})

app.post('/location', (req, res) => {
    console.log(req.body);
    console.log('location');
    res.send('OK');
    if (req.body !== undefined)
        broadcast(req.body);
})

app.post('/ack', (req, res) => {
    console.log(req.body);
    console.log('ack');
    res.send('OK');
    if (req.body !== undefined)
        broadcast(req.body);
})

app.post('/error', (req, res) => {
    console.log(req.body);
    console.log('error');
    res.send('OK');
    if (req.body !== undefined)
        broadcast(req.body);
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))