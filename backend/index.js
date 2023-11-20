const express = require('express');
const cors = require('cors');
const serverless = require('serverless-http');

const app = express();

app.use(cors({
    // origin: process.env.URL_FRONT,
    // credentials: true,
    // allowedHeaders: "Origin, Content-Type, Accept, Authorization",
 }));

app.use(express.json());

app.get('/',(req, res) => {
    res.status(200).json({msg: 'server is works'});
})

app.post('/', (req, res) => {
    const {name, surname, patronymic, birthdate, passport} = req.body;

    const data = {
        name: surname,
        surname: name,
        patronymic: patronymic,
        telephone: '+70001112233',
        birthdate: birthdate,
        passport: passport
    }

    const date = new Date(birthdate);
    const age = new Date().getFullYear() - date.getFullYear();

    if (surname === '') {
        return res.status(200).json({success: false, error: 'Нет фамилии'});
    }

    if (age < 18) {
        return res.status(200).json({success: false, error: 'Кандидат несовершеннолетний' });
    }

    if (name.toLowerCase() === 'редирект' || surname.toLowerCase() === 'редирект' || patronymic.toLowerCase() === 'редирект') {
        const redirectUrl = req.get('origin');
        return res.redirect(301, redirectUrl + '/testing-form');
    }

    if (name.toLowerCase() === 'потерян' || surname.toLowerCase() === 'потерян' || patronymic.toLowerCase() === 'потерян') {
        return res.status(404).send('Not found');
    }

    if (name.toLowerCase() === 'плохой' || surname.toLowerCase() === 'плохой' || patronymic.toLowerCase() === 'плохой') {
        return res.status(400).send('Bad request');
    }

    if (name.toLowerCase() === 'неавторизованный' || surname.toLowerCase() === 'неавторизованный' || patronymic.toLowerCase() === 'неавторизованный') {
        return res.status(401).send('Ошбка авторизации');
    }
    if (name.toLowerCase() === 'чайник' || surname.toLowerCase() === 'чайник' || patronymic.toLowerCase() === 'чайник') {
        return res.status(418).send("I'm A Teapot");
    }
    if (name.toLowerCase() === 'ошибка' || surname.toLowerCase() === 'ошибка' || patronymic.toLowerCase() === 'ошибка') {
        return res.status(500).send("Internal Server Error");
    } 
    
    res.status(200).json({success: true, data: {...data} });
  })

// app.listen(3000, () => console.log(`Listening on: 3000`));
  module.exports.handler = serverless(app);
