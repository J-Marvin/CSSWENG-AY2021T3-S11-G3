// Testing

const { app, BrowserWindow, globalShortcut } = require('electron')
const dotenv = require('dotenv')
const path = require('path')
const fse = require('fs-extra')

dotenv.config({ path: path.join(__dirname, '.env') })

const port = process.env.PORT
const hostname = process.env.HOSTNAME
require('./app.js')

let mainWindow

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600
  })

  mainWindow.setMinimumSize(800, 600)

  mainWindow.loadURL('http://' + hostname + ':' + port)

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  globalShortcut.register('f5', function () {
    console.log('f5 is pressed')
    mainWindow.reload()
  })

  globalShortcut.register('CommandOrControl+R', function () {
    console.log('CommandOrControl+R is pressed')
    mainWindow.reload()
  })
  console.log(hostname + ' ' + port)
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

app.on('uncaughtException', function(error) {
  const log = require('electron-log')
  log.error(error)
})
