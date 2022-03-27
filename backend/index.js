require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const router = require('./routes/index');

//const sequelize = require('./db');

const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors({
  //credentials: true,
  //origin: process.env.CLIENT_URL
}));
app.use(express.json());
// need cookieParser middleware before we can do anything with cookies
//app.use(cookieParser());
/*
app.use(session({
  name: 'session-id',
  secret: '12345-67890-09876-54321',
  saveUninitialized: false,
  resave: false,
  store: new FileStore()
}));
*/
app.use(express.static(path.resolve(__dirname, 'static')));

app.use('/api', router);

// middleware для обработки ошибок должен идти последним!!!
//app.use(errorHandler); // middleware for error handling

app.get('/', function(req, res) {
  res.status(200).json({
    message: "Fine!"
  })
  // res.send('qwerty') sets the content type to text/Html
});

const start = async () => {
  try {
    //await sequelize.authenticate();
    //await sequelize.sync(); // создает таблицы при отсутствии
    app.listen(PORT, () => console.log('App launched!'));
  } catch(err) {
    console.log(err);
  }
}

start();
