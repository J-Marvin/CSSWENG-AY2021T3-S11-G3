// Testing

const { app, BrowserWindow, globalShortcut, dialog } = require('electron')
const dotenv = require('dotenv')
const path = require('path')
const fse = require('fs-extra')
const appPath = app.getAppPath()
let logPath = 'logs'

if (process.env.PORTABLE_EXECUTABLE_DIR !== undefined) {
  logPath = path.join(process.env.PORTABLE_EXECUTABLE_DIR, '/logs')
} else if (fse.existsSync(path.join(appPath, '../../logs'))) {
  logPath = path.join(appPath, '../../logs')
}

dotenv.config({ path: path.join(__dirname, '.env') })

const port = process.env.PORT
const hostname = process.env.HOSTNAME

if (!fse.existsSync(logPath)) {
  fse.mkdirSync(logPath)
}

process.on('uncaughtException', function (error) {
  const log = require('electron-log')
  const errorLogPath = path.join(logPath, 'main.log')
  log.transports.file.resolvePath = () => errorLogPath

  log.error(error)
  dialog.showErrorBox('Failed to start application', 'Something went wrong! A log of the error has been made and can be located at \n' + errorLogPath.replace(/\\/g, '\\\n'))
  app.quit()
})

require('./app.js')

let mainWindow

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    icon: __dirname + './public/images/logo.png'
  })

  mainWindow.setMinimumSize(800, 600)

  mainWindow.loadURL('http://' + hostname + ':' + port)

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  mainWindow.removeMenu()
  mainWindow.maximize()
}

app.on('ready', createWindow)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
})
