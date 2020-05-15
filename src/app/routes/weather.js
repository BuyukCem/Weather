const express = require('express');
const request = require('request');
require('dotenv').config();
const bodyParser = require('body-parser'); // Charge le middleware de gestion des paramètres

const router = express.Router();
const urlencodedParser = bodyParser.urlencoded({extended: false});

router.get('/', function (req, res) {
    res.render('index', {
        degres: null,
        icone: null,
        days: GetMonth(),
        time: GetTime(),
        city: null,
        desc: null
    });
});
router.post('/getweather', urlencodedParser, function (req, res) {
    let city = req.body.city;
    if (city === ' ' || city === null || city === 'undefined') {
        res.render('index', {degres: null, error: 'Error, please try again'});
        console.log("error");
    } else {
        console.log(process.env.API_kEY)
        let url = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + process.env.API_kEY;
        console.log(url);
        request(url, function (err, response, body) {
            try {
                let weather = JSON.parse(body);
                console.log(weather);
                console.log("Voici les infos LOGO:"+weather.weather[0].id)
                const data = {
                    degres: kelvinToCelsius(weather.main.temp),
                    icone: DetermineIcon(weather.weather[0].id),
                    days: GetMonth(),
                    time: GetTime(),
                    city: weather.name,
                    desc: weather.description
                };
                console.log(data);
                res.render('index', data);
            } catch (err) {
                console.error(err);
                res.render('index', {degres: null, error: 'Error, please try again'});
            }
        });
    }
});

/**
 * @return {string}
 * @param id int
 */
function DetermineIcon(id) {
    if (id <= '800' || id <= '899' ) {
        return "wi-day-cloudy";
    }else if (id === '310') {
        return "wi-rain";
    } else if (id === '500') {
        return "wi-day-rain-mix";
    } else if (id === '211') {
        return "wi-storm-showers";
    } else if (id === '601') {
        return "wi-snow";
    } else if (id === '701') {
        return "wi-fog";
    } else {
        return "erreur";
    }
}

/**
 * @return {string}
 */
function GetMonth() {
    let date = new Date();
    const monthNames = [
        "January", "February", "March",
        "April", "May", "June", "July",
        "August", "September", "October",
        "November", "December"
    ];
    return date.getDate() + ' ' + monthNames[date.getMonth()] + ' ' + date.getFullYear();
}

/**
 *
 * @constructor
 * @return {string}
 */
function GetTime(){
    var date = new Date();
    let hours = date.getHours() + 1;
    let minutes = date.getMinutes();
    if (minutes < 10) {
        minutes = "0" + date.getMinutes();
    }
    return hours + ":" + minutes;
}

/**
 * @param kelvin float or int
 * @return {string}
 */
function kelvinToCelsius(kelvin) {
    if (kelvin < (0)) {
        return 'Error';
    } else {
        let valeur = kelvin - 273.15;
        return valeur.toFixed(1);
    }
}

module.exports = router;