const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')



const app = express()

// Defne paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../template/views')
const partialspath = path.join(__dirname, '../template/partials')

// Setup HandleBars Engine and views Location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialspath)

// Setup Static Directory
app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather',
        name: 'Andrew Mead'
    })
})


app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help',
        name: 'This is help'
    })
})

app.get('/weather', (req, res) => {
    
    if (!req.query.address) {
        return res.send({
            error: 'You must provide Address'
        })
    }
    geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
        if (error) {
            return res.send({error})
        }

        forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                return res.send({
                    error
                })
            }

            res.send({
                forecast: forecastData,
                location,
                address: req.query.address
            })
        })
    })

})

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: "Help 404",
        errorMessage: "Help Data Not Found"
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        title: "404",
        name: 'Andrew',
        errorMessage: 'Page not found'
    })
})

app.listen(3000, () => {
    console.log('Server is up')
})