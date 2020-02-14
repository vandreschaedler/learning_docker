const express = require('express')
const bodyParser = require('body-parser')


const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// require('./app/controllers/authControllers')(app)
// require('./app/controllers/projectController')(app)

require('./app/controllers/index')(app)


app.listen(3000, (err) => {
    if (err) {
        return console.error(err);
    }
    console.log('Server started')
}
)