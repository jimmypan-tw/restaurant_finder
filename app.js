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

app.get('/restaurants/:id', (req, res) => {
    Restaurant.findById(req.params.id, (err, restaurant) => {
        if (err) return console.error(err)
        console.log("params: ", req.params)
        console.log("restaurant: ", restaurant)
        return res.render('show', { restaurant: restaurant })
    })
})

app.get('/search', (req, res) => {
    const keyword = req.query.keyword
    const restaurants = restaurant_list.results.filter(restaurant => {
        return restaurant.name.toLowerCase().includes(keyword.toLowerCase())
    })

    res.render('index', { restaurants: restaurants, keyword: keyword })
})

app.listen(port, () => {
    console.log(`Express is listening on http://localhost:${port}`)
})