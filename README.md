# Disciples Christian Church DB

## Instructions
1. run `npm i` to install dependencies
2. run `./node_modules/.bin/electron-rebuild` to install native modules
   - if you run up to any issues with this command, run `.\node_modules\.bin\electron-rebuild.cmd` instead
   - NOTE: if you plan to not use electron **DO NOT RUN THIS COMMAND** as this will set rebuild the dependencies to run on electron's nodejs version and will result into another error. This can be fixed by reinstalling node_modules
3. run `npm start` to open app in BrowserWindow or `npm dev` to open local server
   1. Note: once the BrowserWindow is closed, the server closes
   2. Note: either of the two commands will open the server
4. the server can be accessed through any web browser at `http://localhost:3000`

## Instructions for building executable
1. run `npm run dist`
2. wait for the build to finish
3. run `npm run postinstall` to install necessary dependencies
4. access the executable at dist/win-unpacked

#### dependencies
- body-parser
- dotenv
- express
- express-handlebars


#### devDependencies
- electron
- electron-builder
- electron-rebuild
- nodemon
- standard
