const express = require('express');
const { verificaTokenImg } = require('../middlewares/authentication');
const fs = require('fs');
const { get } = require('http');
const app = express();
const path = require('path');

app.get('/imagen/:tipo/:img', verificaTokenImg, (req, res) => {
    let tipo = req.params.tipo;
    let img = req.params.img;

    let ImagePath = path.resolve(__dirname, `../../uploads/${tipo}/${img}`);
    if (fs.existsSync(ImagePath)) {
        res.sendFile(ImagePath);
    } else {
        let noImagePath = path.resolve(__dirname, '../assets/no-imagen.jpg');
        res.sendFile(noImagePath);
    }
})

module.exports = app;