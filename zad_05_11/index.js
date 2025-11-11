const express = require('express')
const fs = require('fs')
const path = require('path')
let mysql = require('mysql')

let con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'messages',
})
con.connect(function (err) {
  if (err) throw err
})

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
app.get('/api/contact-messages', (req, res) => {
    let sql = "SELECT * FROM messages"
  con.query(sql, (err, result) => {
    if (err) {
      throw err;
    }
    res.json(result)
  })
})
app.get('/api/contact-messages/:id', (req, res) => {
  let id = parseInt(req.params.id)

    let sql = "SELECT * FROM messages WHERE Id = ?"
    con.query(sql, id, (err, result) => {
      if (err) {
        res.status(404).send('No message found.')
      }
      res.json(result)
    })
})

app.post('/kontakt', (req, res) => {
  console.log(req.body)

    const {name,surname,email,message} = req.body;
    let sql = "INSERT INTO messages (Name,Lastname,Email,Message) VALUES (?,?,?,?)"
    con.query(sql,[name,surname,email,message], (err, res) => {
      if (err) {
        throw err;
      }
  })
  res.redirect('/')
})

app.listen(3000, () => console.log('App is running on http://localhost:3000'))