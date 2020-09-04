//=========================
// Verificar Token
//=========================
const jwt = require('jsonwebtoken');

const { JsonWebTokenError } = require("jsonwebtoken");

let verificaToken = (req, res, next) => {

        let token = req.get('token');

        jwt.verify(token, process.env.SEED_KEY, (err, decoded) => {
            if (err) {
                return res.status(401).json({
                    ok: false,
                    err: {
                        mesage: 'Token no valido'
                    }
                });
            }
            req.usuario = decoded.usuario;
            next();
        });
    }
    //====================
    // verifica AdminRole
    //====================

let verificaAdmin_Role = (req, res, next) => {
    let usuario = req.usuario;
    if (usuario.role === 'ADMIN_ROLE') {
        next();
    } else {
        res.json({
            ok: false,
            err: {
                message: 'El usuario no es administrador'
            }
        });
    }


}


module.exports = {
    verificaToken,
    verificaAdmin_Role
}