const express = require('express')
const router = express.Router()

const Record = require('../../models/record')


// 新增
router.get('/new', (req, res) => {
  return res.render('new')
})

router.post('/', (req, res) => {
  console.log(req.body)
  return Record.create(req.body)
    .then(() => res.redirect('/'))
    .catch(err => console.log(err))
})

// 修改
router.get('/:id/edit', (req, res) => {
  const id = req.params.id
  return Record.findById(id)
    .lean()
    .then(recordData => res.render('edit', { recordData }))
    .catch(err => console.log(err))
})

router.put('/:id', (req, res) => {
  const id = req.params.id
  const { name, date, amount, categoryId } = req.body
  return Record.findById(id)
    .then(recordData => {
      recordData.name = name
      recordData.date = date
      recordData.amount = amount
      recordData.categoryId = categoryId
      return recordData.save()
    })
    .then(() => res.redirect('/'))
    .catch(err => console.log(err))
})

// 刪除
router.delete('/:id', (req, res) => {
  const id = req.params.id
  return Record.findById(id)
    .then(recordData => recordData.remove())
    .then(() => res.redirect('/'))
    .catch(err => console.log(err))
})


module.exports = router