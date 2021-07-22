const { app, BrowserWindow } = require('electron')
const dotenv = require('dotenv')
const path = require('path')

dotenv.config({ path: path.join(__dirname, '.env') })

const port = process.env.PORT
const hostname = process.env.HOSTNAME

const server = require('./app.js')

// This object represents the main window
const mainWindow = {
  // This function initializes the browser window and opens the local server
  initWindow: function () {
    this.window = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        nodeIntegration: true
      }
    })

    this.window.setMinimumSize(800, 600)

    this.window.loadURL('http://' + hostname + ':' + port)
  },
  // the window object
  window: null
}

// When the app is ready, initialize the window
app.on('ready', mainWindow.initWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  if (mainWindow.window === null) {
    mainWindow.initWindow()
  }
})
