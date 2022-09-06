const express = require('express')
const session = require('express-session')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const usePassport = require('./config/passport')

const routes = require('./routes')
require('./config/mongoose')

const app = express()
const port = process.env.PORT || 3000

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
app.use(session({
  secret: 'ThisIsMySecret',
  resave: false,
  saveUninitialized: true
}))

app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

usePassport(app)

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.user = req.user
  next()
})

app.use(routes)


app.listen(3000, () => {
  console.log(`Express is running on http://localhost:${port}`)
})