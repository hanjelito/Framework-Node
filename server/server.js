require('dotenv').config();
require('./config/config');
const express = require('express');
const mongoose = require('mongoose');
const app = express();

const bodyParser = require('body-parser');


//midlware
app.use(bodyParser.urlencoded({ extends: false }));

app.use(bodyParser.json());
//routes general
app.use(require('./routes/index'));


mongoose.connect('mongodb://' + process.env.URL_MONGO + '/cafe', {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false
    })
    .then((result) => console.log("Conectado a MongoDB"))
    .catch((err) => console.log(err));


app.listen(process.env.PORT, () => {
    console.log(`Escuchando en el puerto ${process.env.PORT}`);
})