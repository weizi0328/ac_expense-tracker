const Expense = require('../expense')
const mongoose = require('mongoose')

const expenseList = require('../../expenses.json').results

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection

db.once('open', () => {
  console.log('running expenseSeeder...')

  Expense.create(expenseList)
    .then(() => {
      console.log('expenseSeeder done!')
      db.close()
    })
    .catch(err => console.log(err))
})