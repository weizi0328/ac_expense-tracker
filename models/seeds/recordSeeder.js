const Record = require('../record')
const mongoose = require('mongoose')

const recordList = require('../../recordList.json').results

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection

db.once('open', () => {
  console.log('running recordSeeder...')

  Record.create(recordList)
    .then(() => {
      console.log('recordSeeder done!')
      db.close()
    })
    .catch(err => console.log(err))
})