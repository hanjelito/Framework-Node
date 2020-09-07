const express = require('express');
const { verificaToken } = require('../middlewares/authentication');
const fileUpload = require('express-fileupload');
const app = express();
//
const Usuario = require('../models/usuarios');
const Producto = require('../models/producto');
//File sistem
const fs = require('fs');
const path = require('path');
//

app.use(fileUpload({ useTempFiles: true }));

app.put('/upload/:tipo/:id', verificaToken, (req, res) => {
    let tipo = req.params.tipo;
    let id = req.params.id;
    if (!req.files) {
        return res.status(400)
            .json({
                ok: false,
                err: {
                    message: ('No se cargo ningun archivo')
                }
            });
    }
    //Validar tipo
    let tiposValidos = ['productos', 'usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las extensiones son permitidas ' + tiposValidos.join(', '),
            }
        });
    }

    //
    let archivoFile = req.files.archivo;
    let extencionesValidas = ['image/png', 'image/jpg', 'image/gif', 'image/jpeg'];
    //
    if (extencionesValidas.indexOf(archivoFile.mimetype) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las extensiones permitidas son jpg, gift, png',
                ext: (archivoFile.mimetype).split('/')[1]
            }
        });
    }

    //renombrar archivo
    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${(archivoFile.name).split('.')[1]}`;

    archivoFile.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {
        if (err) {
            return err.status(500).json({
                ok: false,
                err
            });
        }
        if (tipo === 'usuario')
            imagenUsuario(id, res, nombreArchivo);
        else
            imagenProducto(id, res, nombreArchivo);
    });

});

function imagenUsuario(id, res, nombreArchivo) {
    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {
            borrarArchivo(nombreArchivo, 'usuarios');
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if (!usuarioDB) {
            borrarArchivo(nombreArchivo, 'usuarios');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El usuario no existe'
                }
            })
        }

        // let pathImagen = path.resolve(__dirname, `../../uploads/usuarios/${usuarioDB.img}`);
        // if (fs.existsSync(pathImagen)) {
        //     fs.unlinkSync(pathImagen);
        // }
        borrarArchivo(usuarioDB.img, 'usuarios');
        usuarioDB.img = nombreArchivo;
        usuarioDB.save((err, usuarioGuardado) => {
            res.json({
                ok: true,
                usuarioGuardado,
                img: nombreArchivo
            })
        });
    });
}

function imagenProducto(id, res, nombreArchivo) {
    Producto.findById(id, (err, productoDB) => {
        if (err) {
            borrarArchivo(nombreArchivo, 'productos');
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if (!productoDB) {
            borrarArchivo(nombreArchivo, 'productos');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El producto no existe'
                }
            })
        }

        borrarArchivo(productoDB.img, 'productos');
        productoDB.img = nombreArchivo;
        productoDB.save((err, productoGuardado) => {
            res.json({
                ok: true,
                productoGuardado,
                img: nombreArchivo
            })
        });
    });
}

function borrarArchivo(nombreArchivo, tipo) {
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreArchivo}`);
    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }
}

module.exports = app;