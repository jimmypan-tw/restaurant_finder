const express = require('express')
const router = express.Router()
const Restaurant = require('../models/restaurant')

// 新增一筆 restaurant 的資料頁面
router.get('/new', (req, res) => {
    return res.render('new')
})

// 新增一筆 restaurant
router.post('/', (req, res) => {
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
router.get('/:id', (req, res) => {
    Restaurant.findById(req.params.id, (err, restaurant) => {
        if (err) return console.error(err)
        return res.render('show', { restaurant: restaurant })
    })
})

// 修改一筆 restaurant 的資料
router.get('/:id/edit', (req, res) => {
    Restaurant.findById(req.params.id, (err, restaurant) => {
        if (err) return console.error(err)
        return res.render('edit', { restaurant: restaurant })
    })
})

// 刪除一筆 restaurant
router.post('/:id/delete', (req, res) => {
    Restaurant.findById(req.params.id, (err, restaurant) => {
        if (err) return console.error(err)
        restaurant.remove(err => {
            if (err) return console.error(err)
            return res.redirect('/')
        })
    })
})

module.exports = router