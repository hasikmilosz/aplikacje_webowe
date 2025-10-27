const express = require('express')
const app = express()
const {readFile, writeFile,stat} = require('fs/promises')
const url = require('url')

const PORT = 8080

app.get('/', (req, res) => {
    res.send('Strona główna')
})
app.get('/json', (req, res) => {
    res.json({
        Age:67,
        Name: 'Anna'
    })
})
app.get('/html', (req, res) => {
    res.send('<!DOCTYPE html><head><meta charset="utf-8"></head><body><p style="background-color: blue">Coś jest</p></body></html>')
})
app.get('/index.html', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})
app.get('/get_params', async (req, res) => {
    let siteUrl = url.parse(req.url,true)

    let queries =siteUrl.query

    let fileName = "params_" + Date.now() + ".json";
    await writeFile(fileName,JSON.stringify(queries,null,2),'utf8')

    res.json({
        ok : "ok"
    })
})
    app.use(express.static(__dirname + '/assets'))
app.all('*', (req, res) => {
    res.status(404).json({error:'error'})
})
app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
