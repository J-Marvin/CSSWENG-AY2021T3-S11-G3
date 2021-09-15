# Disciples Christian Church DB

## Instructions for running the application
1. run `npm i` to install dependencies
2. run `./node_modules/.bin/electron-rebuild` to install native modules
   - if you run up to any issues with this command, run `.\node_modules\.bin\electron-rebuild.cmd` instead
   - NOTE: if you do not plan use electron **DO NOT RUN THIS COMMAND** as this will set rebuild the dependencies to run on electron's nodejs version and will result into another error. This can be fixed by reinstalling node_modules
3. run `npm start` to open app in BrowserWindow or `npm run dev` to open local server
   1. Note: once the BrowserWindow is closed, the server closes
   2. Note: either of the two commands will open the server
4. the server can be accessed through any web browser at `http://localhost:3000`

## Instructions for building executable
1. Follow steps 1-2 in **Instructions for running the application**
2. run `npm run postinstall` to install necessary dependencies
3. run `npm run dist`
4. wait for the build to finish
5. access the executable at release/Disciples Christian Church.exe

### Resetting the db
1. delete `church.db`
2. Run app

#### dependencies
- [async](https://www.npmjs.com/package/async)
- [bcrypt](https://www.npmjs.com/package/bcrypt)
- [better-sqlite3](https://www.npmjs.com/package/better-sqlite3)
- [body-parser](https://www.npmjs.com/package/body-parser)
- [dotenv](https://www.npmjs.com/package/dotenv)
- [express](https://www.npmjs.com/package/express)
- [express-handlebars](https://www.npmjs.com/package/express-handlebars)
- [express-validator](https://www.npmjs.com/package/express-validator)
- [fs-extra](https://www.npmjs.com/package/fs-extra)
- [moment](https://www.npmjs.com/package/moment)
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
- [Selectize.js](https://selectize.dev/)
- [DataTables](https://datatables.net)