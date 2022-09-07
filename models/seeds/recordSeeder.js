const bcrypt = require('bcryptjs')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const Record = require('../record')
const User = require('./../user')

const db = require('../../config/mongoose')


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


db.once('open', () => {
  bcrypt
    .genSalt(10)
    .then(salt => bcrypt.hash(SEED_USER.password, salt))
    .then(hash => User.create({
      name: SEED_USER.name,
      email: SEED_USER.email,
      password: hash
    }))
    .then(user => {
      const userId = user._id
      return Promise.all(SEED_RECORD.map(record => {
        console.log(`${record.name} has been created.`)
        return Record.create({ ...record, userId })
      }))
    })
    .then(() => {
      console.log('recordSeeder is done.')
      process.exit()
    })
})