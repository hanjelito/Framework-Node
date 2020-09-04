const express = require('express');
const bcrypt = require('bcrypt');
//modelos
const Usuario = require('../models/usuarios');
const usuarios = require('../models/usuarios');
//
const app = express();

app.post('/login', (req, res) => {

    let body = req.body;

    Usuario.findOne({ email: body.email }, (err, usaurioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!usaurioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: '-Usuario o contraseña incorrectos'
                }
            });
        }
        if (!bcrypt.compareSync(body.password, usaurioDB.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o -contraseña incorrectos'
                }
            })
        }

        res.json({
            ok: true,
            usuario: usaurioDB,
            token: '123'
        })
    });
});



module.exports = app;