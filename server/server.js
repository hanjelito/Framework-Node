require('dotenv').config();
require('./config/config');
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();



//middleware
app.use(express.urlencoded({ extended: true }))

app.use(express.json());

app.use(express.static(path.resolve(__dirname, '../public')));

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