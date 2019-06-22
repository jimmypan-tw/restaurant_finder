// Include express from node_modules
const express = require('express')
const app = express()
// Define server related variables
const port = 3001

// require express-handlebars here
const exphbs = require('express-handlebars')

// setting template engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.use(express.static('static'))

// 引用body-parser
const bodyParser = require('body-parser')

// 設定body-parser
app.use(bodyParser.urlencoded({ extended: true }))


const mongoose = require('mongoose')
mongoose.connect('mongodb://127.0.0.1/restaurant', { useNewUrlParser: true })
const db = mongoose.connection
db.on('error', () => {
    console.log('mongodb error!')
})

db.once('open', () => {
    console.log('mongodb connected.')
})

const Restaurant = require('./models/restaurant.js')


// routes settings
app.get('/', (req, res) => {
    Restaurant.find((err, restaurants) => {
        // 把Restaurant model所有的資料都抓回來
        if (err) return console.error(err)
        return res.render('index', { restaurants: restaurants })
    })
})

// 新增一筆 restaurant 的資料頁面
app.get('/restaurants/new', (req, res) => {
    return res.render('new')
})

// 新增一筆 restaurant
app.post('/restaurants', (req, res) => {
    const restaurant = new Restaurant({
        name: req.body.name,
        name_en: req.body.name_en,
        category: req.body.category,
        phone: req.body.phone,
        location: req.body.location,
        google_map: req.body.google_map,
        rating: req.body.rating,
        image: req.body.image,
        description: req.body.description
    })

    restaurant.save(err => {
        if (err) return console.error(err)
        return res.redirect('/')
    })
})


// 檢視一筆 restaurant 詳細資料
app.get('/restaurants/:id', (req, res) => {
    Restaurant.findById(req.params.id, (err, restaurant) => {
        if (err) return console.error(err)
        return res.render('show', { restaurant: restaurant })
    })
})

// 修改一筆 restaurant 的資料
app.get('/restaurants/:id/edit', (req, res) => {
    Restaurant.findById(req.params.id, (err, restaurant) => {
        if (err) return console.error(err)
        return res.render('edit', { restaurant: restaurant })
    })
})

// 刪除一筆 restaurant
app.post('/restaurants/:id/delete', (req, res) => {
    Restaurant.findById(req.params.id, (err, restaurant) => {
        if (err) return console.error(err)
        restaurant.remove(err => {
            if (err) return console.error(err)
            return res.redirect('/')
        })
    })
})

app.get('/search', (req, res) => {
    const keyword = req.query.keyword
    Restaurant.find((err, all_restaurants) => {
        // 把Restaurant model所有的資料都抓回來
        if (err) return console.error(err)
        const restaurants = all_restaurants.filter(restaurant => {
            return restaurant.name.toLowerCase().includes(keyword.toLowerCase())
        })
        return res.render('index', { restaurants: restaurants, keyword: keyword })
    })
})

app.listen(port, () => {
    console.log(`Express is listening on http://localhost:${port}`)
})