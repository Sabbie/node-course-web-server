const express = require('express');
const hbs = require('hbs'); // handlebars templating HTML engine
const fs = require('fs');

var app = express();

const port = process.env.PORT || 3000;  // process.env is an object that stores all your environment variables of your OS
                                        // PORT is a env var that will be created by heroku

// Register partials
hbs.registerPartials(__dirname + '/views/partials')

// Register helper functions, so they don't have to be passed in every .render() page
hbs.registerHelper('getCurrentYear', () => {
    return new Date().getFullYear();
})

app.set('view engine', 'hbs');
// set up middleware => tweak express to your needs


// register some middleware 
app.use((req, res, next) => {
    var now = new Date().toString();
    var log = `${now}: ${req.method} ${req.url}`;
    console.log(log);
    fs.appendFile('server.log', log + '\n', (err) => {
        if (err) {
            console.log('unable to write to log file');
        }
    });
    next();
});

// app.use((req, res, next) => {
//     res.render('maintenance.hbs');
//     // as long as you don't call next(), the middleware stops executing when you make a request
// });

// setup static directory
app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.render('home.hbs', {
        welcomeMessage : 'Welcome to my site!',
        pageTitle : 'Home Page'
    })
});


// static page
app.get('/help', (req, res) => {
    res.send('help.html');
});

// dynamic page
// inject data into the page with the second render argument
app.get('/about', (req, res) => {
    res.render('about.hbs', {
        pageTitle : 'About Page'
    });
});

app.listen(port, () => {
    console.log(`server is listening on port ${port}`);
});