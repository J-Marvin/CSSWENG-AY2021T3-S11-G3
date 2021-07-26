const dotenv = require('dotenv')
const express = require('express')
const bodyParser = require('body-parser')
const exphbs = require('express-handlebars')
const path = require('path')
const db = require('./models/db.js')

const app = express()
const routes = require('./routes/routes.js')

const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: '.hbs',
  layoutsDir: path.join(__dirname, 'views/layouts'),
  partialsDir: path.join(__dirname, 'views/partials')
})

dotenv.config({ path: path.join(__dirname, '.env') })

const port = process.env.PORT
const hostname = process.env.HOSTNAME
const file = path.join('database', 'church.db')

db.initDB(file)

app.engine('hbs', hbs.engine)
app.set('view engine', '.hbs')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, '/public')))

app.use('/', routes)

app.listen(port, hostname, function () {
  console.log('Server running at:')
  console.log('http://' + hostname + ':' + port)
})

module.export = app