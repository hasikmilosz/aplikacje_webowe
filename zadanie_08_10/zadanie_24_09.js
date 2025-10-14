const http = require('http')
const {URL} = require('url')
const { readFile, writeFile, access} = require('fs/promises')
const mime = require('mime-types')

const server = http.createServer(async (req, res) => {
    const adr = new URL(req.url,`http://${req.headers.host}`)
    const path = adr.pathname
    switch (path) {
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
        case '/get_params':
            const urlQuery = adr.searchParams
            const urlParams = Array.from(urlQuery)
            console.log(urlQuery)
            let timestamp = Date.now()
            let filename = `params_${timestamp}.json`
            await writeFile(filename,JSON.stringify(urlParams,null,2),'utf8')
            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' })
            res.end(JSON.stringify({'ok':'ok'}))
            break
        default:
            try{
                await access(`assets/${path}`)
                const mimeType = mime.lookup(`assets/${path}`)
                res.writeHead(200, { 'Content-Type':`${mimeType}; charset=utf-8` })
                const file = await readFile(`assets/${path}`,'utf8')
                res.end(file)
            }
            catch(err){
                res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' })
                res.end(JSON.stringify({'error':'not found'}))
            }
            break
    }
})

server.listen(8080)
