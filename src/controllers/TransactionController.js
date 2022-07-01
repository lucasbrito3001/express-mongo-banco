const { TransferStructure, DepositStructure, WithdrawStructure } = require('../services/modelsStructures')

class TransactionController {
    logger = undefined
    model = undefined
    responser = undefined
    utils = undefined

    constructor({ model, logger, responser, utils }) {
        this.model = model
        this.logger = logger
        this.responser = responser
        this.utils = utils
    }

    readAll = async (req, res) => {
        let response = {}
        try {
            const transactions = await this.model.find()
            this.logger('\n> [SUCCESS] Found')

            response = this.responser(200, 'ok', true, 'read', transactions)
        } catch (error) {
            this.logger('\n> [ERROR] Internal server error')
            response = this.responser(500, 'Internal server error, please contact the administrator', false, 'write')
        }   
        
        res.status(response.code).json(response)
    }

    readById = async (req, res) => {
        let response = {}
        try {
            const { accountNumber } = req.params

            if(accountNumber.length < 6) {
                this.logger('\n> [ERROR] Bad length')
                response = this.responser(200, 'Account number must be 6 characters', false, 'write')
                return res.status(response.code).json(response)
            }
            
            const transactions = await this.model.find({ $or: [{ source_account: accountNumber }, { destination_account: accountNumber }] })

            if(transactions.length > 0) {
                this.logger('\n> [SUCCESS] Found')
                response = this.responser(200, 'ok', true, 'read', transactions)
            } else {
                this.logger('\n> [ERROR] Not found')
                response = this.responser(200, 'No transactions found with this ID', false, 'write')
            }
        } catch (error) {
            this.logger('\n> [ERROR] Internal server error')
            response = this.responser(500, 'Internal server error, please contact the administrator', false, 'write')
        }

        res.status(response.code).json(response)
    }

    transfer = async (req, res) => {
        let response = {}

        try {
            const isBodyFull = this.utils.checkBodyRequest(TransferStructure, req.body)
            
            if(isBodyFull) {
                const { source_account, destination_account, value } = req.body
                const haveEnoughMoney = await this.utils.checkEnoughMoney(this.model, source_account, value)

                if(haveEnoughMoney) {
                    await this.model.create({ 
                        source_account, 
                        destination_account, 
                        value, 
                        type_transaction: 3
                    })
                    
                    this.logger('\n> [SUCCESS] Created')
                    response = this.responser(201, 'Transfer created successfully', true, 'write')
                } 
                else {
                    this.logger('\n> [ERROR] Not enough money')
                    response = this.responser(200, 'Not enough money to complete this transfer', false, 'write')
                }

            } else {
                this.logger('\n> [ERROR] Missing data')
                response = this.responser(200, 'Missing required data', false, 'write')
            }
        } catch (error) {
            this.logger('\n> [ERROR] Internal server error')
            response = this.responser(500, 'Internal server error, please contact the administrator', false, 'write')
        }

        res.status(response.code).json(response)
    }

    deposit = async (req, res) => {
        let response = {}

        try {
            const isBodyFull = this.utils.checkBodyRequest(DepositStructure, req.body)
            
            if(isBodyFull) {
                const { destination_account, value } = req.body

                await this.model.create({
                    source_account: "null",
                    destination_account,
                    value, 
                    type_transaction: 1
                })
                
                this.logger('\n> [SUCCESS] Created')
                response = this.responser(201, 'Deposit created successfully', true, 'write')
            } else {
                this.logger('\n> [ERROR] Missing data')
                response = this.responser(200, 'Missing required data', false, 'write')
            }
        } catch (error) {
            this.logger('\n> [ERROR] Internal server error')
            response = this.responser(500, 'Internal server error, please contact the administrator', false, 'write')
        }

        res.status(response.code).json(response)
    }

    withdraw = async (req, res) => {
        let response = {}

        try {
            const isBodyFull = this.utils.checkBodyRequest(WithdrawStructure, req.body)
            
            if(isBodyFull) {
                const { source_account, value } = req.body
                const haveEnoughMoney = await this.utils.checkEnoughMoney(this.model, source_account, value)

                if(haveEnoughMoney) {
                    await this.model.create({ 
                        source_account,
                        destination_account: "null",
                        value,
                        type_transaction: 2
                    })
                    
                    this.logger('\n> [SUCCESS] Created')
                    response = this.responser(201, 'Withdraw created successfully', true, 'write')
                } 
                else {
                    this.logger('\n> [ERROR] Not enough money')
                    response = this.responser(200, 'Not enough money to complete this withdraw', false, 'write')
                }

            } else {
                this.logger('\n> [ERROR] Missing data')
                response = this.responser(200, 'Missing required data', false, 'write')
            }
        } catch (error) {
            this.logger('\n> [ERROR] Internal server error')
            response = this.responser(500, 'Internal server error, please contact the administrator', false, 'write')
        }

        res.status(response.code).json(response)
    }
}

module.exports = TransactionController