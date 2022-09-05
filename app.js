const express = require('express')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')

const Record = require('./models/record')
const Category = require('./models/category')

const app = express()

const port = 3000

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


// 瀏覽
app.get('/', (req, res) => {
  console.log(req.user)
  const userId = req.user._id
  Record.find({ userId })
    .lean()
    .sort({ name: 'asc' })
    .then(recordData => {
      let totalAmount = 0
      for (let i = 0; i < recordData.length; i++) {
        totalAmount += recordData[i].amount
      }
      res.render('index', { recordData, totalAmount })
    })
})

// 新增
app.get('/records/new', (req, res) => {
  return res.render('new')
})

app.post('/records', (req, res) => {
  return Expense.create(req.body)
    .then(() => res.redirect('/'))
    .catch(err => console.log(err))
})

// 修改
app.get('/records/:id/edit', (req, res) => {
  const id = req.params.id
  return Expense.findById(id)
    .lean()
    .then(expenses => res.render('edit', { expenses }))
    .catch(err => console.log(err))
})

app.post('/records/:id/edit', (req, res) => {
  const id = req.params.id
  const data = req.body
  return Expense.findById(id)
    .then(expenses => {
      const columns = ['name', 'date', 'category', 'amount']
      for (let i = 0; i < columns.length; i++) {
        expenses[columns[i]] = data[columns[i]]
      }
      return expenses.save()
    })
    .then(() => res.redirect('/'))
    .catch(err => console.log(err))
})

// 刪除
app.post('/records/:id/delete', (req, res) => {
  const id = req.params.id
  return Expense.findById(id)
    .then(expense => expense.remove())
    .then(() => res.redirect('/'))
    .catch(err => console.log(err))
})


app.listen(port, () => {
  console.log(`Express is running on http://localhost:${port}`)
})