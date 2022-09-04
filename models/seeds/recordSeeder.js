const mongoose = require('mongoose')

const Record = require('../record')
const Category = require('../category')

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection

db.on('error', () => {
  console.log('mongodb error!')
})

db.once('open', () => {
  console.log('mongodb connected!')
  return Category.find()
    .lean()
    .then(categories => {
      return Promise.all(Array.from({ length: categories.length }, (_, i) => {
        return Record.create({
          name: categories[i].name,
          date: Date.now(),
          amount: (i + 1) * 100,
          categoryId: categories[i]._id
        })
      }
      ))
    })
  console.log('done.')
  process.exit()
})