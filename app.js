const express = require('express')
const exphbs = require('express-handlebars')

const Expense = require('./models/expense')
const app = express()

const mongoose = require('mongoose')

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


app.get('/', (req, res) => {
  Expense.find()
    .lean()
    .then(expenses => res.render('index', { expenses }))
    .catch(err => console.error(err))
})

app.get()

app.listen(3000, () => {
  console.log('App is running on http://localhost:3000')
})