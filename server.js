const path = require('path');
const express = require('express');

require('dotenv').config();

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'app/public/views'));
app.use(express.static(path.join(__dirname, 'app/public')));

const routes = require('./src/app/routes/weather');
app.use('/', routes);

app.use((req, res, next) => {
    res.status(404).render("erreur");
})
.use((err, req, res, next) => {
     console.error(err.stack);
     res.status(500).send('Something broke!');
})
.listen( process.env.SERVER_PORT, () => {
     console.log('App running at: ' + process.env.SERVER_HOST+":"+ process.env.SERVER_PORT);
});