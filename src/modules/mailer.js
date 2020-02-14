const path = require('path')
const handlebars = require('nodemailer-express-handlebars')
const nodemailer = require('nodemailer')
const mailerConfig = require('../config/mailer.json')

const transport = nodemailer.createTransport(mailerConfig);

transport.use('compile', handlebars({
    viewEngine: 'handlebars',
    viewPath: path.resolve('./src/resources/mail/'),
    extName: '.html'
}))