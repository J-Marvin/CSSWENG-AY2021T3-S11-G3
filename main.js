const { app, BrowserWindow, globalShortcut } = require('electron')
const dotenv = require('dotenv')
const path = require('path')

dotenv.config({ path: path.join(__dirname, '.env') })

const port = process.env.PORT
const hostname = process.env.HOSTNAME
require('./app.js')

let mainWindow

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
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
