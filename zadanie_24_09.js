const http = require('http')
const url  = require('url')
const {readFile} = require('fs/promises')
let server = http.createServer((req,res)=>{
    const parsedUrl = url.parse(req.url)
    res.writeHead(200, {'Content-Type': 'text/html'})
    if(parsedUrl.pathname.endsWith('/main/')){
        res.end('Strona główna')
    }
    if(parsedUrl.pathname.endsWith('/json/')){
        res.end(JSON.stringify({Age:41,sigma:67}))
    }
    if(parsedUrl.pathname.endsWith('/document/')) {
        res.end("<h2>Dokument</h2>" +
            "<p style='background-color: red'>Coś tam</p>")
    }
    if(parsedUrl.pathname.endsWith('/file/')){
        
    }
    }
})
server.listen(8080)