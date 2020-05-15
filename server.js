const path = require('path');
const express = require('express');
const serv= require('./config/confServeur.js.dist');
const http=require('http');

const app = express();

var routes=require('./src/routes/index');

app.set('views', path.join(__dirname, 'src/views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname,'src/public')));
app.use('/', routes);

app.use((req, res, next) => {
    res.status(404).render("erreur");
})
.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
})
 // console.error(err.stack);
  //res.status(500).send('Something broke!');

.listen(serv.local.port, () => {
  console.log(`App running at http://localhost:`+serv.local.port);
});