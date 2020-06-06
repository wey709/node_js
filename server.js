const express = require('express');
const mustacheExpress = require("mustache-express");
const bodyParser = require('body-parser');

const { Client } = require('pg');

require('dotenv').config();



const app = express();

const mustache = mustacheExpress();
mustache.cache = null;
app.engine('mustache', mustache);
app.set('view engine', 'mustache');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:false}));


app.get('/list', (req, res)=>{
    res.render('list');
})


app.get('/twt', (req, res) => {
  const client = new Client({
    user: 'young',
   password: 930709,
   host: process.env.PG_HOST,
   port: process.env.PG_PORT,
   database: process.env.PG_DATABASE
  });

    client.connect()
      .then(() => {
        console.log('connected')
        return client.query('SELECT * FROM trump_may;');
      })
      .then((results) => {
        //console.log(results)
        res.render('list', results);
      })
      .catch((err) => {
        console.log('error', err);
        res.send('Something bad happened');
      });
  
  });



  app.get('/twt/rt/:id', (req, res)=>{

    const client = new Client({
      user: 'young',
      password: 930709,
      host: process.env.PG_HOST,
      port: process.env.PG_PORT,
      database: process.env.PG_DATABASE
    });

    client.connect()
    .then(() => {
      const sql = "select * from trump_may_rt where permalink=(select permalink from trump_may where id = ($1));";
      const param_ = [req.params.id];
      return client.query(sql, param_);

    })
    .then((results) => {
      //console.log('result?', result);
      res.render('list_rt', results);
    })
    .catch((err) => {
      console.log('err', err);
      res.send("error")
    });

    


})






app.get('/twt/add', (req, res)=>{
    res.render('twt-form');
})


app.post('/twt/add', (req, res)=>{

    client.connect()
    .then(() => console.log('connected successfully'))


    const sql = "INSERT INTO my_twt(contents, created_on) VALUES($1, $2)";
    const values = [req.body['contents'], req.body['created_on']]

    client.query(sql, values)
    .then(res.redirect('/'))
    

})

app.listen(3000)
