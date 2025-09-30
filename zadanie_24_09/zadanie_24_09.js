const http = require('http');
const { readFile } = require('fs/promises');

const server = http.createServer(async (req, res) => {
    switch (req.url) {
        case '/':
            res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' })
            res.end('Strona główna')
            break

        case '/json':
            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' })
            const dane = {
                imie: 'Anna',
                wiek: 28,
                hobby: ['czytanie', 'programowanie', 'podróże']
            }
            res.end(JSON.stringify(dane))
            break

        case '/html':
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
            res.end(`
        <!DOCTYPE html>
        <html>
        <head><title>HTML z kodu</title></head>
        <body>
          <h1>To jest HTML wygenerowany w Node.js</h1>
          <p>Witamy na świecie</p>
        </body>
        </html>
      `)
            break

        case '/plik':
                const html = await readFile('index.html', 'utf8')
                res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
                res.end(html)
            break

        default:
            res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' })
            res.end('Nie znaleziono strony')
    }
});

server.listen(8080)
