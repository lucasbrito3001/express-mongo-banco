const routes = require('express').Router()

const AccountController = require('../controllers/AccountController')
const AccountModel = require('../models/AccountModel')
const { returnResponseObject } = require('../services/responser')
const Utils = require('../services/utils')

const Controller = new AccountController({ 
    model: AccountModel, 
    responser: returnResponseObject, 
    utils: new Utils(),
    logger: console.log
})

routes.get('/accounts', Controller.readAll)
routes.get('/accounts/:accountNumber', Controller.readById)
routes.post('/accounts', Controller.create)
// routes.get('/accounts/login', AccountController.login)

module.exports = routes