const TransactionController = require('../../controllers/TransactionController')

const mockModel = require('../mocks/model')
const mockRes = require('../mocks/expressRes')
const logger = jest.fn()
const responser = jest.fn().mockImplementation((code, message, status, action, data) => ({ code: code, status: status, message: message, data: data }))

describe('> Transaction controller [read all]', () => {
    it('should return the list of accounts', async () => {
        // Arrange
        const dependencies = {
            model: mockModel,
            logger: logger,
            responser: responser
        }

        const Controller = new TransactionController(dependencies)

        const accounts = [
            { _id: '1', value: 1000},
            { _id: '2', number: 1000},
            { _id: '3', number: 1000}
        ]
        mockModel.find.mockReturnValue(accounts)

        // Act
        const res = mockRes()
        await Controller.readAll({}, res) 

        // Assert
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({ code: 200, status: true, data: accounts, message: 'ok' })
        expect(logger).toHaveBeenCalledWith('\n> [SUCCESS] Found')
    })

    it("should return an internal server error", async () => {
        // Arrange
        const dependencies = {
            logger: logger,
            responser: responser
        }

        const Controller = new TransactionController(dependencies)

        // Act
        const res = mockRes()
        await Controller.readAll(null, res)

        // Assert
        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.json).toHaveBeenCalledWith({ code: 500, status: false, message: 'Internal server error, please contact the administrator' })
        expect(logger).toHaveBeenCalledWith('\n> [ERROR] Internal server error')
    })
})