const routes = require('express').Router()

const TransactionController = require('../controllers/TransactionController')

routes.get('/transactions', TransactionController.readTransaction)

module.exports = routes