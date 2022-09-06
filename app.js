const express = require('express')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')

const Record = require('./models/record')

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

app.engine('hbs', exphbs({
  defaultLayout: 'main',
  extname: 'hbs',
  helpers: {
    dateFormat(date) {
      return `${date.getFullYear()}-` + `${`0${date.getMonth() + 1}`.slice(-2)}-` + `${`0${date.getDate()}`.slice(-2)}`
    },
    categoryIcon(categoryId) {
      switch (categoryId) {
        case 1:
          return 'fa-house'
        case 2:
          return 'fa-van-shuttle'
        case 3:
          return 'fa-face-grin-beam'
        case 4:
          return 'fa-utensils'
        case 5:
          return 'fa-pen'
      }
    }
  }
}))

app.set('view engine', 'hbs')
app.use(bodyParser.urlencoded({ extended: true }))


// 瀏覽
app.get('/', (req, res) => {
  Record.find()
    .lean()
    .sort({ date: 'desc' })
    .then(recordData => {
      let totalAmount = 0
      for (let i = 0; i < recordData.length; i++) {
        totalAmount += recordData[i].amount
      }
      res.render('index', { recordData, totalAmount })
    })
    .catch(err => console.error(err))
})

// 新增
app.get('/records/new', (req, res) => {
  return res.render('new')
})

app.post('/records', (req, res) => {
  console.log(req.body)
  return Record.create(req.body)
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