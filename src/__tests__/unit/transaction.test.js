const { stub } = require('sinon')
const TransactionModel = require('../../models/TransactionModel')
const { readTransaction } = require('../../controllers/TransactionController')

describe('> Transaction controller', () => {
    it('should return a response object with success status, including the list of user stubbed', async () => {
        // Arrange
        const input = [
            {
                _id: 12341231,
                source_account: 123123,
                destination_account: 123321,
                value: 1000,
                type_transaction: 3,
                status_transaction: 2,
                createdAt: Date.now(),
                updatedAt: Date.now()
            }
        ]

        const req = {
            body: {
                source_account: input[0].source_account
            }
        }

        const expectation = {
            code: 200,
            data: [
                {
                    source_account: 123123,
                    destination_account: 123321,
                    value: 1000,
                    type_transaction: 3,
                    status_transaction: 2,
                }
            ], 
            message: `${input.length} transactions were found`, 
            status: true 
        }

        stub(TransactionModel, 'find').returns(Promise.resolve(input))
        
        // Act
        const result = await readTransaction(req)

        // Assert
        expect(result).toStrictEqual(expectation)
    })
})