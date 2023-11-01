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
    console.log(name, surname, patronymic, birthdate, passport)

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

    console.log(age)

    if (surname === '') {
        res.status(200).json({success: false, error: 'Нет фамилии'});
        return;
    }

    if (age < 18) {
        res.status(200).json({success: false, error: 'Кандидат несовершеннолетний' });
        return;
    }
    
    res.status(200).json({success: true, data: {...data} });
          
    // res.status(500).json({success: false, msg: e});   

  })

  app.listen(3000, () => console.log(`Listening on: 3000`));
//   module.exports.handler = serverless(app);
