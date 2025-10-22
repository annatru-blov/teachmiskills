const http = require('http');
const {
    URL
} = require('url');

const PORT = process.env.PORT || 3000;

// const send = (res, status, body, headers = {}) => {
//     const payload = typeof body === 'string' ? body : JSON.stringify(body);
//     const isJSON = typeof body === 'object';

//     res.writeHead(status, {
//         'Content-Type': isJSON ? 'application/json' : 'text/html',
//         ...headers
//     })

//     res.end(payload)
// }

function createSend(req, res, start) {
    return (status, body, headers = {}) => {
        const payload = typeof body === 'string' ? body : JSON.stringify(body);
        const isJSON = typeof body === 'object';

        res.writeHead(status, {
            'Content-Type': isJSON ? 'application/json' : 'text/html',
            ...headers
        })

        res.end(payload)

        const duration = Date.now() - start;
        console.log(`${req.method} ${req.url} ${res.statusCode} ${duration}ms`);
    }
}

const readBody = (req) => {
    new Promise((resolve, reject) => {
        let data = '';
        req.on('data', (chunk) => {
            data += chunk;
        })
        if (data.length > 1e6) {
            req.connection.destroy();
            reject(new Error('Body is too large'));
        }
        req.on('end', () => resolve(data));
        req.on('error', reject);
    })
}

const server = http.createServer(async (req, res) => {

    const start = Date.now();
    const send = createSend(req, res, start);

    // console.log(`${req.method} ${req.url}`);

    try {
        const url = new URL(req.url, `http://${req.headers.host}`);

        const {
            pathname,
            searchParams
        } = url;

        if (req.method === 'GET' && pathname === '/') {
            return send(200, `<html><head><title>Node js</title></head><body><h1>Node js</h1></body></html>`);
        }
        if (req.method === 'GET' && pathname === '/about') {
            return send(200, `<html><head><title>About</head><body><h1>About</h1></body></html>`);
        }
        if (req.method === 'GET' && pathname === '/time') {
            return send(200, {
                now: new Date().toISOString(),
                tz: Intl.DateTimeFormat().resolvedOptions().timeZone
            });
        }
        if (req.method === 'POST' && pathname === '/echo') {
            const row = await readBody(req);
            let json = null;
            try {
                json = row ? JSON.parse(row) : null;
            } catch {
                return send(400, {
                    error: 'Invalis JSON'
                })
            }
            return send(201, {
                received: json,
                headers: req.headers,
                method: req.method,
                url: req.url
            })
        }

        send(404, {
            error: 'Not found'
        })

    } catch (err) {
        console.log(err);
        send(500, {
            error: err.message
        })

    }

});

server.listen(PORT, () => {
    console.log(`Server running port http://localhost:${PORT}`);
})

const shutdown = () => {
    console.log('Server is shutting down');
    server.close(() => {
        console.log('Server stopped');

        process.exit(0)
    });
    setTimeout(() =>
        process.exit(1), 5000).unref();

}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);