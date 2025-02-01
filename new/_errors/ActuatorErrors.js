import winston from 'winston';

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.colorize({ all: true }),
        winston.format.printf(({ timestamp, level, message }) => {
            return `${timestamp} | ${level.toUpperCase()} | ${message}`;
        })
    ),
    defaultMeta: { service: 'vulkan-actuator-service' },
    transports: [
        new winston.transports.File({
            filename: 'actuator.error.vlk',
            level: 'error',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json()
            ),
        }),
        new winston.transports.File({ filename: 'prog.logs.vlk' }),  // General logs
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            ),
        }),
    ],
});

export default logger;
