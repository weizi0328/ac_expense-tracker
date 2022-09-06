const Record = require('../record')
const User = require('./../user')
const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection

const SEED_USER = {
  name: 'user',
  email: 'user@example.com',
  password: '12345678'
}

const SEED_RECORD = [
  {
    name: '午餐',
    date: '2022-4-23',
    amount: 60,
    categoryId: 4
  },
  {
    name: '晚餐',
    date: '2022-4-23',
    amount: 60,
    categoryId: 4
  },
  {
    name: '捷運',
    date: '2022-4-24',
    amount: 120,
    categoryId: 2
  },
  {
    name: '租金',
    date: '2022-4-1',
    amount: 25000,
    categoryId: 1
  },
  {
    name: '電影:驚奇隊長',
    date: '2022-4-23',
    amount: 60,
    categoryId: 3
  }]

db.on('error', () => {
  console.log('mongodb error!')
})

db.once('open', () => {
  console.log('recordSeeder is running')
  User.create(SEED_USER)
    .then(user => {
      Promise.all(SEED_RECORD.map(record => {
        console.log(`${record.name} has been created.`)
        return Record.create({ ...record, userId: user._id })
      }))
        .then(() => {
          console.log('recordSeeder is done.')
          process.exit()
        })
    })
})