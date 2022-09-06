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
    },
    // 條件 (三元) 運算子
    // 條件 ? 值1 : 值2
    // 如果 條件 為 true，運算子回傳 值 1，否則回傳 值 2。 
    ifEqual(a, b, options) {
      return a === b ? options.fn(this) : options.inverse(this)
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
  return Record.findById(id)
    .lean()
    .then(recordData => res.render('edit', { recordData }))
    .catch(err => console.log(err))
})

app.post('/records/:id/edit', (req, res) => {
  const id = req.params.id
  const { name, date, amount, categoryId } = req.body
  return Record.findById(id)
    .then(recordData => {
      recordData.name = name
      recordData.date = date
      recordData.amount = amount
      recordData.categoryId = categoryId
      return recordData.save()
    })
    .then(() => res.redirect('/'))
    .catch(err => console.log(err))
})

// 刪除
app.post('/records/:id/delete', (req, res) => {
  const id = req.params.id
  return Record.findById(id)
    .then(recordData => recordData.remove())
    .then(() => res.redirect('/'))
    .catch(err => console.log(err))
})

// Category 選單
app.post('/category', (req, res) => {
  const categoryId = req.body.category
  Record.find({ categoryId })
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

app.listen(port, () => {
  console.log(`Express is running on http://localhost:${port}`)
})