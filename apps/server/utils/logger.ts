import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const { combine, timestamp, json, printf, align, colorize, errors } = winston.format;

const rotateErrorTransport = new DailyRotateFile({
    filename: `logs/errors/error-%DATE%.log`,
    datePattern: "YYYY-MM-DD",
    maxFiles: '30d',
    level: 'error'
});

const rotateCombinedTransport = new DailyRotateFile({
    filename: 'logs/combined/combined-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    maxFiles: '30d',
    level: 'info'
});

const rotateExceptionTransport = new DailyRotateFile({
    filename: 'logs/exceptions/exceptions-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    maxFiles: '30d',
    level: 'info'
});

const RotateRejectionTransport = new DailyRotateFile({
    filename: 'logs/rejections/rejections-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    maxFiles: '30d',
    level: 'info'
});

const logger = winston.createLogger({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    format: combine(
        errors({ stack: true }),
        colorize({ all: true }),
        timestamp({
            format: 'YYYY-MM-DD hh:mm:ss.SSS A',
        }),
        align(),
        process.env.NODE_ENV === 'production'
            ? json()
            : printf(({ level, message, timestamp }) => {
                  return `[${timestamp}] [${level.toUpperCase()}]: ${message}`;
              }),
    ),
    transports:
        process.env.NODE_ENV === 'production'
            ? [
                  rotateErrorTransport,
                  rotateCombinedTransport,
              ]
            : [
                  new winston.transports.Console(),
                  rotateErrorTransport,
              ],
    exceptionHandlers: [rotateExceptionTransport],
    rejectionHandlers: [RotateRejectionTransport]
});

export default logger;
