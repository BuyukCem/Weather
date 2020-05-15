const path = require('path');
const express = require('express');
const port = process.env.PORT || process.env.SERVER_PORT;
require('dotenv').config();

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/app/public/views'));
app.use(express.static(path.join(__dirname, 'src/app/public')));

const routes = require('./src/app/routes/weather');
app.use('/', routes);

app.use((req, res, next) => {
    res.status(404).render("erreur");
})
.use((err, req, res, next) => {
     console.error(err.stack);
     res.status(500).send('Something broke!');
})
.listen(port, () => {
     console.log('App running at: ' + port);
});