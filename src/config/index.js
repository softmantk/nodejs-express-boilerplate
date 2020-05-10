require('dotenv-flow')
    .config();

module.exports = {
    server: {
        PORT: process.env.PORT,
    },
    database: {
        dbURI: process.env.dbURI,
        poolSize: process.env.poolSize,
        useNewUrlParser: process.env.useNewUrlParser,
        useCreateIndex: process.env.useCreateIndex,
        useUnifiedTopology: true,
        useFindAndModify: process.env.useFindAndModify,
        autoReconnect: process.env.autoReconnect,
        socketTimeoutMS: process.env.socketTimeoutMS,
        connectTimeoutMS: process.env.connectTimeoutMS,
    },
    auth0: {
        client_id: process.env.CLIENT_ID,
        domain: process.env.DOMAIN,
        client_secret: process.env.CLIENT_SECRET,
        callback_url: process.env.CALLBACK_URL,
    },
    redis: {
        // redisUrl: process.env.REDIS_URL,
        port: process.env.REDIS_PORT,
        host: process.env.REDIS_HOST,
    },
    converter: {
        outputDirectory: process.env.VIDEO_DIRECTORY,
    },
    projectRootDirectory: getRootDirectory(),
};

function getRootDirectory() {
    if (!process.env.PWD) {
        throw new Error('PWD environment variable not available');
    }
    return process.env.PWD;
}
