# Disciples Christian Church DB

## Instructions
1. run `npm i` to install dependencies
2. run `./node_modules/.bin/electron-rebuild` to install native modules
   - if you run up to any issues with this command, run `.\node_modules\.bin\electron-rebuild.cmd` instead
   - NOTE: if you do not plan use electron **DO NOT RUN THIS COMMAND** as this will set rebuild the dependencies to run on electron's nodejs version and will result into another error. This can be fixed by reinstalling node_modules
3. run `npm start` to open app in BrowserWindow or `npm run dev` to open local server
   1. Note: once the BrowserWindow is closed, the server closes
   2. Note: either of the two commands will open the server
4. the server can be accessed through any web browser at `http://localhost:3000`

## Instructions for building executable
1. run `npm run dist`
2. wait for the build to finish
3. run `npm run postinstall` to install necessary dependencies
4. access the executable at dist/win-unpacked

#### dependencies
- [body-parser](https://www.npmjs.com/package/body-parser)
- [dotenv](https://www.npmjs.com/package/dotenv)
- [express](https://www.npmjs.com/package/express)
- [express-handlebars](https://www.npmjs.com/package/express-handlebars)
- [fs](https://www.npmjs.com/package/fs)
- [bcrypt](https://www.npmjs.com/package/bcrypt)
- [async](https://www.npmjs.com/package/async)
- [better-sqlite3](https://www.npmjs.com/package/better-sqlite3)
- [sqlite3](https://www.npmjs.com/package/sqlite3)
- [knex](https://www.npmjs.com/package/knex)
- [validator](https://www.npmjs.com/package/validator)


#### devDependencies
- [electron](https://www.npmjs.com/package/electron)
- [electron-builder](https://www.npmjs.com/package/electron-builder)
- [electron-rebuild](https://www.npmjs.com/package/electron-rebuild)
- [nodemon](https://www.npmjs.com/package/nodemon)
- [standard](https://www.npmjs.com/package/standard)


### Libraries
- [Bootstrap](https://getbootstrap.com)
- [FontAwesome](https://fontawesome.com)
- [JQuery](https://jquery.com)