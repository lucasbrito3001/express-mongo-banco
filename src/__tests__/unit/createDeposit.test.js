const TransactionController = require('../../controllers/TransactionController')

const mockReq = {
    body:  {}
}
const mockRes = require('../mocks/expressRes')
const mockModel = require('../mocks/model')
const logger = jest.fn()
const responser = jest.fn().mockImplementation((code, message, status) => ({ code: code, status: status, message: message }))

describe('> Transaction controller [deposit]', () => {
    it('should create a deposit successfully', async () => {
        // Arrange
        mockModel.create.mockReturnValue(true)

        const dependencies = {
            model: mockModel,
            responser: responser,
            logger: logger,
            utils: {
                checkBodyRequest: jest.fn().mockReturnValue(true)
            }
        }

        const Controller = new TransactionController(dependencies)

        // Act
        const res = mockRes()
        await Controller.deposit(mockReq, res)

        // Assert
        expect(logger).toHaveBeenCalledWith('\n> [SUCCESS] Created')
        expect(res.status).toHaveBeenCalledWith(201)
        expect(res.json).toHaveBeenCalledWith({ code: 201, status: true, message: 'Deposit created successfully' })
    })

    it('should return an error of missing datas', async () => {
        // Arrange
        const dependencies = {
            responser: responser,
            logger: logger,
            utils: {
                checkBodyRequest: jest.fn().mockReturnValue(false)
            }
        }

        const Controller = new TransactionController(dependencies)

        // Act
        const res = mockRes()
        await Controller.deposit(mockReq, res)

        // Assert
        expect(logger).toHaveBeenCalledWith('\n> [ERROR] Missing data')
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({ code: 200, status: false, message: 'Missing required data' })
    })

    it('should return an internal server error', async () => {
        // Arrange
        const dependencies = {
            responser: responser,
            logger: logger
        }

        const Controller = new TransactionController(dependencies)

        // Act
        const res = mockRes()
        await Controller.deposit({}, res)

        // Assert
        expect(logger).toHaveBeenCalledWith('\n> [ERROR] Internal server error')
        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.json).toHaveBeenCalledWith({ code: 500, status: false, message: 'Internal server error, please contact the administrator' })
    })
})