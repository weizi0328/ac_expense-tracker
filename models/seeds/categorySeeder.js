const Category = require('../category')
const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection

const categoryData = [
  {
    id: 1,
    name: '家居物業'
  },
  {
    id: 2,
    name: '交通出行'
  },
  {
    id: 3,
    name: '休閒娛樂'
  },
  {
    id: 4,
    name: '餐飲食品'
  },
  {
    id: 5,
    name: '其他'
  }
]

db.on('error', () => {
  console.log('mongodb error!')
})

db.once('open', () => {
  console.log('categorySeeder is running!')
  Promise.all(categoryData.map(category => {
    return Category.create(category)
      .then(category => {
        console.log(`category ${category.name} created.`)
      })
  })).then(() => {
    console.log('categorySeed is done.')
    process.exit()
  })
})