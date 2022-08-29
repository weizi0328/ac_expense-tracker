const express = require('express')
const mongoose = require('mongoose')

const app = express()
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection

db.on('error', () => {
  console.log('mongodb error!')
})
db.once('open', () => {
  console.log('mongodb connected!')
})


app.get('/', (req, res) => {
  res.send('index page here')
})

app.listen(3000, () => {
  console.log('App is running on http://localhost:3000')
})