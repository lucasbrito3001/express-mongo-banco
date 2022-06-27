const TransactionModel = require('../models/TransactionModel')
const { returnResponseObject } = require('../services/responser')

class TransactionController {
    async readTransaction(req, res) {
        const { source_account } = req.body

        let message = 'No transactions was found'
        let code = 200
        let status = false
        let transactions = []

        try {
            transactions = await TransactionModel.find({ source_account: source_account })
    
            if(transactions.length > 0) {
                transactions = transactions.map(transaction => {
                    return { 
                        source_account: transaction.source_account,
                        destination_account: transaction.destination_account,
                        value: transaction.value,
                        type_transaction: transaction.type_transaction,
                        status_transaction: transaction.status_transaction
                    }
                })

                message = `${transactions.length} transactions were found`
                status = true
            }
        } catch (error) {
            code = 500
            message = 'Error: ' + error
            status = false
        }

        const response = returnResponseObject('read', code, message, status, transactions)

        return res?.json(response) || response
    }

    createTransaction(req, res) {
        const message = 'No transactions was found'
        const { source_account, destination_account, value, type_transaction, status_transaction } = req.body

        let response = { code: 200, data: [], status: false }
        return res?.json(returnResponseObject()) || returnResponseObject()
    }
}

module.exports = new TransactionController()