const fs = require('fs');
const path = require('path');

const defaultPrefix = '/api';
const routes = [];
module.exports = {
    init(app, { prefix = defaultPrefix } = {}) {
        fs.readdirSync(__dirname)
            .filter((file) => file.indexOf('.') !== 0 && file !== 'index.js')
            .forEach((file) => {
                const route = file.split('.js')[0];
                const urlPath = `${prefix}/${route}`;
                routes.push(urlPath);
                // eslint-disable-next-line global-require
                return app.use(urlPath, require(path.join(__dirname, file)));
            });
        console.log('resource paths: ', JSON.stringify(routes, null, 2));
    },
};
