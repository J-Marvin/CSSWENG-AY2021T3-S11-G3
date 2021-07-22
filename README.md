# Disciples Christian Church DB

## Instructions
1. run `npm i` to install dependencies
2. run `npm start` to open app in BrowserWindow or `npm dev` to open local server
   1. Note: once the BrowserWindow is closed, the server closes
   2. Note: either of the two commands will open the server
3. the server can be accessed through any web browser at `http://localhost:3000`

## Instructions for building executable
1. run `npm run dist`
2. wait for the build to finish
3. access the executable at dist/win-unpacked

#### dependencies
- body-parser
- dotenv
- express
- express-handlebars


#### devDependencies
- electron
- electron-builder
- nodemon
- standard
