const http = require('http');
const fs = require('fs');
const {
    Transform,
    pipeline
} = require('stream');
const eventEmitter = require('events');

const PORT = 3000;

class UpperCaseStream extends Transform {
    _transform(chunk, enc, callback) {
        callback(null, chunk.toString().toUpperCase());
    }
}

class Logger extends eventEmitter {
    log(message) {
        console.log(`[info]:${message}`);
        this.emit('info', message);
    }
    error(message) {
        console.log(`[error]:${message}`);
        this.emit('error', message);
    }
    warn(message) {
        console.log(`[warn]:${message}`);
        this.emit('warn', message);
    }
}

const logger = new Logger();

const server = http.createServer((req, res) => {
    if (req.method === 'GET' && req.url === '/') {
        logger.log('Request received');
        res.writeHead(200, {
            'content-type': 'text/plain, charset = utf-8'
        });

        const filePath = 'data.txt';
        const src = fs.createReadStream(filePath);
        const upper = new UpperCaseStream();

        if (!fs.existsSync(filePath)) {
            logger.warn('File not found');
            res.writeHead(404, {
                'content-type': 'text/plain, charset = utf-8'
            });
            return res.end('Not found');
        }

        pipeline(
            src,
            upper,
            res,
            (err) => {
                if (err) {
                    console.error('error', err.message);
                    logger.error('error', err.message);

                    if (!res.headersSent) {
                        res.writeHead(500, {
                            'content-type': 'text/plain, charset = utf-8'
                        });
                        res.end(err.message);
                    }

                    if (!res.writableEnded) {
                        res.end('Error');
                    }
                }
            }
        )

    } else {
        res.writeHead(404, {
            'content-type': 'text/plain, charset = utf-8'
        });
        res.end('Not found');
    }
})

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})