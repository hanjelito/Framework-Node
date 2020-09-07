const express = require('express');
const { verificaToken, verificaAdmin_Role } = require('../middlewares/authentication');

const app = express();

const Categoria = require('../models/categoria');

app.get('/categoria', (req, res) => {
    Categoria.find({})
        .sort('descripcion')
        //filtra los datos del usuario
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
            res.json({
                ok: true,
                categorias
            })
        });
});

app.get('/categoria/:id', (req, res) => {
    let id = req.params.id;

    // Categoria.findById(id, (err, categoriaDB) => {
    Categoria.findById(id)
        .populate('usuario', 'nombre email')
        .exec(function(err, categoriaDB) {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            if (!categoriaDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: "El Id no es correcto"
                    }
                })
            }

            res.json({
                ok: true,
                categoria: categoriaDB
            })
        });
});

app.put('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;

    let descCategoria = {
        descripcion: body.descripcion
    };
    Categoria.findByIdAndUpdate(id, descCategoria, { new: true, runValidators: true }, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        })
    });

});


app.post('/categoria', verificaToken, (req, res) => {

    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });
    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});


app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id no existe'
                }
            });
        }
        res.json({
            ok: true,
            message: 'Categoria Borrada'
        })
    });
});

module.exports = app;