// Include express from node_modules
const express = require('express')
const app = express()

// include json file
//restaurant_list = require('./models/seeds/restaurant.json')

// Define server related variables
const port = 3001

// require express-handlebars here
const exphbs = require('express-handlebars')

// setting template engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.use(express.static('static'))

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
    res.render('index', { restaurants: restaurant_list.results })
})

app.get('/restaurants/:restaurant_id', (req, res) => {
    const restaurant = restaurant_list.results.find(restaurant => {
        return restaurant.id.toString() === req.params.restaurant_id
    })
    console.log('restaurant: ', restaurant)
    res.render('show', { restaurant: restaurant })
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