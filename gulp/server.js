const log = require('fancy-log');
const fs = require('fs');
const express = require('express');
const app = express();
const path = require('path');
const port = 1338;
const ip = '';

app.set('views', path.join(__dirname, 'templates'));
/**
 * Request
 */
const static = express.static(path.join(__dirname, '../prod'));
log('running at: ', path.join(__dirname, 'prod'));


app.get('/icon', function (req, res) {
    res.status(200).sendFile(path.join(__dirname, 'favicon.png'));
});

var favicon = require('serve-favicon');
app.use(favicon(path.join(__dirname, 'favicon.png')));

app.get('/file/:file', (req, res) => {
    res.send(fs.readFileSync(req.params.file).toString());
});


app.use('/', static);
app.get('/', static);


const _colors = require('colors');

let server = app.listen(port, ip, () => log(`Running server at http://localhost:${port}`));

server.on('error', err => {
    log(_colors.red('Could not start server...', err));
});