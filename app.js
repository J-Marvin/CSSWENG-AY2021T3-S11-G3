const dotenv = require('dotenv')
const express = require('express')
const bodyParser = require('body-parser')
const exphbs = require('express-handlebars')
const path = require('path')
const db = require(path.join(__dirname, './models/db.js'))
const hbsHelpers = require('./helpers/hbsHelper')
const session = require('express-session')
const MemoryStore = require('memorystore')(session)
const nocache = require('nocache')
const fse = require('fs-extra')

const app = express()
const routes = require('./routes/routes.js')
const { dialog } = require('electron')

const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: '.hbs',
  layoutsDir: path.join(__dirname, 'views/layouts'),
  partialsDir: path.join(__dirname, 'views/partials'),
  helpers: hbsHelpers
})

dotenv.config({ path: path.join(__dirname, '.env') })

const port = process.env.PORT
const hostname = process.env.HOSTNAME
let dbPath = 'database'
let file = path.join('database', 'church.db')
let logPath = 'logs'

if (process.env.PORTABLE_EXECUTABLE_DIR !== undefined) {
  dbPath = path.join(process.env.PORTABLE_EXECUTABLE_DIR, dbPath)
  logPath = path.join(process.env.PORTABLE_EXECUTABLE_DIR, logPath)
  file = path.join(dbPath, 'church.db')
}

if (fse.existsSync(dbPath)) {
  db.initDB(file)
  db.pragmaFKKnex(true, null)
} else {
  fse.mkdirSync(dbPath)
  db.initDB(file)
  db.pragmaFKKnex(true, null)
}

if (!fse.existsSync(logPath)) {
  fse.mkdirSync(logPath)
}

app.engine('hbs', hbs.engine)
app.set('view engine', '.hbs')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, '/public')))
app.use(session({
  cookie: { maxAge: 86400000 }, // 1 day
  store: new MemoryStore({
    checkPeriod: 86400000
  }),
  saveUninitialized: true,
  resave: false,
  secret: 'christian-church'
}))
app.use(nocache())

app.use('/', routes)

// if route is not defined in the server, render an error message
app.use(function (req, res) {
  res.render('error', {
    css: ['global', 'error'],
    status: {
      code: '404',
      message: 'Not Found'
    },
    Level: parseInt(req.session.level)
  })
})

app.listen(port, hostname, function () {
  console.log('Server running at:')
  console.log('http://' + hostname + ':' + port)
})

module.export = app
