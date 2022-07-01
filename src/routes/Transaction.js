const routes = require('express').Router()

const TransactionController = require('../controllers/TransactionController')
const TransactionModel = require('../models/TransactionModel')
const { returnResponseObject } = require('../services/responser')
const Utils = require('../services/utils')

const Controller = new TransactionController({ 
    model: TransactionModel, 
    responser: returnResponseObject, 
    utils: new Utils(),
    logger: console.log
})

routes.get('/transactions/:accountNumber', Controller.readById)
routes.post('/transactions/transfer', Controller.transfer)
routes.post('/transactions/withdraw', Controller.withdraw)
routes.post('/transactions/deposit', Controller.deposit)

module.exports = routes

