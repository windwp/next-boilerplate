
const path = require('path');

const env = process.env.NODE_ENV || 'development';
const rootPath = path.normalize(path.join(__dirname, '../../'));
const config = {
    development: {
        root: rootPath,
        db: process.env.MONGO_DB || 'mongodb://localhost/test',
    },
    production: {
        root: rootPath,
        db: process.env.MONGO_DB || 'mongodb://localhost/test',
    }
}
module.exports = config[env];