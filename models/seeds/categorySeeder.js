const Category = require('../category')
const mongoose = require('mongoose')

const categoryList = require('../../categoryList.json').results

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection

db.once('open', () => {
  console.log('running categorySeeder...')

  Category.create(categoryList)
    .then(() => {
      console.log('categorySeeder done!')
      db.close()
    })
    .catch(err => console.log(err))
})