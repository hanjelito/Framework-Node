//===============
// Puerto
// ==============
process.env.PORT = process.env.PORT || 3000;

//===============
// vencimiento del token
// ==============
// 60 segundos
// 60 minuntos
// 24 horas
// 30 dias
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;