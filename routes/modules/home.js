const express = require('express')
const router = express.Router()

const Record = require('../../models/record')

// 瀏覽
router.get('/', (req, res) => {
  const userId = req.user._id
  Record.find({ userId })
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

// Category 選單
router.post('/category', (req, res) => {
  const categoryId = req.body.category
  const userId = req.user._id
  Record.find({ categoryId, userId })
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


module.exports = router