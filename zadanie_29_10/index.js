const express = require('express')
const fs = require('fs')
const path = require('path')

const app = express()
app.use('/static', express.static(path.join(__dirname, 'static')))
app.use(express.urlencoded({ extended: true }))

function renderPage(fileName) {
  const menu = fs.readFileSync(path.join(__dirname, 'static', 'menu.txt'), 'utf8')
  let html = fs.readFileSync(path.join(__dirname, 'static', fileName), 'utf8')
  const footer = fs.readFileSync(path.join(__dirname, 'static', 'footer.txt'), 'utf8')
  html = html.replace('{{menu}}', menu)
  html = html.replace('{{footer}}', footer)
  return html
}

app.get('/', (req, res) => res.send(renderPage('main.html')))
app.get('/o-nas', (req, res) => res.send(renderPage('o-nas.html')))
app.get('/kontakt', (req, res) => res.send(renderPage('kontakt.html')))
app.get('/oferta', (req, res) => res.send(renderPage('oferta.html')))

app.post('/kontakt', (req, res) => {
  console.log(req.body)
  res.redirect('/')
})

app.listen(3000, () => console.log('App is running on http://localhost:3000'))
