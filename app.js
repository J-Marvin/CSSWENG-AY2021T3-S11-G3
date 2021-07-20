const dotenv = require('dotenv');
const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const path = require('path');

const app = express();
const routes = require('./routes/routes.js');

var hbs = exphbs.create({
    defaultLayout: 'main',
    extname: '.hbs',
    layoutsDir: path.join(__dirname, 'views/layouts'),
    partialsDir: path.join(__dirname, 'views/partials')
});

dotenv.config({ path: path.join(__dirname, '.env') });

var port = process.env.PORT;
var hostname = process.env.HOSTNAME;

app.engine('hbs', hbs.engine);
app.set('view engine', '.hbs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '/public')));

app.use('/', routes);

app.listen(port, hostname, function () {
    console.log(`Server running at:`);
    console.log('http://' + hostname + ':' + port);
});

module.export = app;