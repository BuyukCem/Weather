const express = require('express');
const request = require('request');
const API = require('../../config/confOpenweathermap.js.dist');
const bodyParser = require('body-parser'); // Charge le middleware de gestion des paramètres

const router =  express.Router();
const urlencodedParser = bodyParser.urlencoded({ extended: false });

router.get('/',function(req,res) {
    res.render('index',{degres: null, error: null});
});
router.post('/getweather', urlencodedParser,function (req,res){

    let city=req.body.city;
    if ( city=== ' ' || city === null || city==='undefined'){
        res.render('index',{degres: null, error: 'Error, please try again'});
        console.log("error");
    }else{
        let url="https://api.openweathermap.org/data/2.5/weather?q="+city+"&appid="+API.conf.key;
        console.log(url);
        request(url, function(err, response, body){
            try {
                let weather = JSON.parse(body);
                res.render('index',{degres:kelvinToCelsius(weather.main.temp),icone:DetermineIcon(weather.weather[0].id),date:GetMonth(),city:city,desc:weather.description});
            }catch (err) {
                console.error(err);
                res.render('index',{degres: null, error: 'Error, please try again'});
            }
        });
    }
});
/**
 * @return {string}
 * @param id int
 */
function DetermineIcon(id){
        if (id=='800' || id=='801'){
            return "wi-day-cloudy";
        }else if(id=='802'){
            return "wi-day-cloudy-high";
        }else if(id=='803'){
            return "wi-day-cloudy";
        }else if(id=='300'){
            return "wi-rain";
        }else if(id=='500'){
            return "wi-day-rain-mix";
        }else if(id=='211'){
            return "wi-storm-showers";
        }else if(id=='601'){
            return "wi-snow";
        }else if(id=='701'){
            return "wi-fog";
        }else{
            return "erreur";
        }
}
/**
 * @return {string}
 */
function GetMonth(){
    const d = new Date();
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "Sept", "Oct", "Nov", "Dec"];
    console.log(d.getDay()+monthNames[d.getMonth()]);
    return d.getDay()+". "+ monthNames[d.getMonth()];
}

/**
 * @return {string}
 * @param kelvin float or int
 */
function kelvinToCelsius(kelvin){
    if (kelvin < (0)) {
        return 'Erreur';
    } else {
       let valeur=kelvin-273.15;
       return valeur.toFixed(2);

    }
}

module.exports = router;