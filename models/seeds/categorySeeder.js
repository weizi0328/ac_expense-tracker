const mongoose = require('mongoose')

const Category = require('../category')

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection

const categoryData = {
  家居: 'fa-solid fa-house',
  交通: 'fa-solid fa-van-shuttle',
  娛樂: 'fa-solid fa-face-grin-beam',
  飲食: 'fa-solid fa-utensils',
  其他: 'fa-solid fa-pen'
}

// The Object.entries() method returns an array of a given object's own enumerable string-keyed property [key, value] pairs.
// map() 會建立一個新的陣列，其內容為原陣列的每一個元素，經由回呼函式運算後，所回傳的結果之集合。

const category = Object.entries(categoryData).map(item =>
({
  name: item[0],
  icon: item[1]
}))

db.on('error', () => {
  console.log('mongodb error!')
})

db.once('open', () => {
  console.log('mongodb connected!')

  Category.create(category)
    .then(() => db.close())

  console.log('done')
})