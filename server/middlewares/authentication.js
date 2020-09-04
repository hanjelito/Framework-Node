//=========================
// Verificar Token
//=========================

let verificaToken = (req, res, next) => {

    let token = req.get('token');

    console.log(token);
    // res.json({
    //     token: token
    // });
    next();
}

module.exports = {
    verificaToken
}