const express = require('express')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')

const Expense = require('./models/expense')

const app = express()

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection

db.on('error', () => {
  console.log('mongodb error!')
})

db.once('open', () => {
  console.log('mongodb connected!')
})

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: 'hbs' }))
app.set('view engine', 'hbs')
app.use(bodyParser.urlencoded({ extended: true }))


app.get('/', (req, res) => {
  Expense.find()
    .lean()
    .then(expenses => res.render('index', { expenses }))
    .catch(err => console.error(err))
})

app.get('/expenses/new', (req, res) => {
  return res.render('new')
})

app.post('/expenses/new', (req, res) => {
  const name = req.body.name
  return Expense.create({ name })
    .then(() => res.redirect('/'))
    .catch(err => console.log(err))
})

app.listen(3000, () => {
  console.log('App is running on http://localhost:3000')
})