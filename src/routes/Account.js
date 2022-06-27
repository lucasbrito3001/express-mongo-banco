const routes = require('express').Router()
const AccountController = require('../controllers/AccountController')

routes.get('/accounts', AccountController.createAccount)
routes.get('/accounts/login', AccountController.login)

module.exports = routes