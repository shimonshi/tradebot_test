var appRoot = require('app-root-path');
const winston = require('winston');
require('winston-daily-rotate-file');

var transport = new (winston.transports.DailyRotateFile)({
    filename: 'app-%DATE%.log',
    datePattern: 'YYYY-MM-DD-HH',
    zippedArchive: true,
    maxSize: '50m',
    maxFiles: '180d',
    dirname: `${appRoot}/logs`,
    handleExceptions: true,
    json: true,
    colorize: false
});

// transport.on('rotate', function (oldFilename, newFilename) {
//     // do something fun
// });

var console_options = {
    level: 'debug',
    handleExceptions: true,
    json: false,
    colorize: true,
};

var logger = winston.createLogger({
    transports: [
        transport,
        new winston.transports.Console(console_options)
    ],
    exitOnError: false, // do not exit on handled exceptions
});

logger.stream = {
    write: function (message, encoding) {
        logger.info(message);
    },
};

module.exports = logger;