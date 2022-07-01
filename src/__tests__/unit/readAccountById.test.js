const AccountController = require('../../controllers/AccountController')

const mockModel = require('../mocks/model')
const mockRes = require('../mocks/expressRes')
const logger = jest.fn()
const responser = jest.fn().mockImplementation((code, message, status, action, data) => ({ code: code, status: status, message: message, data: data }))

describe('> Account controller [read by id]', () => {
    it('should return an account filtered by id', async () => {
        // Arrange
        const mockReq = {
            params: {
                accountNumber: '000001'
            }
        }

        const dependencies = {
            model: mockModel,
            logger: logger,
            responser: responser
        }

        const Controller = new AccountController(dependencies)
        
        const foundUser = [{ _id: 1, number: '000001' }]
        mockModel.find.mockReturnValue(foundUser)

        // Act
        const res = mockRes()
        await Controller.readById(mockReq, res)

        // Assert
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({ code: 200, status: true, data: foundUser, message: 'ok' })
        expect(logger).toHaveBeenCalledWith('\n> [SUCCESS] Found')
    })

    it("should return an empty search", async () => {
        // Arrange
        const mockReq = {
            params: {
                accountNumber: '000002'
            }
        }

        const dependencies = {
            model: mockModel,
            logger: logger,
            responser: responser
        }

        const Controller = new AccountController(dependencies)
        mockModel.find.mockReturnValue(false)

        // Act
        const res = mockRes()
        await Controller.readById(mockReq, res)

        // Assert
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({ code: 200, status: false, message: 'Account not found' })
        expect(logger).toHaveBeenCalledWith('\n> [ERROR] Not found')
    })

    it("should return an error warning the account number must be 6 characters", async () => {
        // Arrange
        const mockReq = {
            params: {
                accountNumber: '2'
            }
        }

        const dependencies = {
            logger: logger,
            responser: responser
        }

        const Controller = new AccountController(dependencies)

        // Act
        const res = mockRes()
        await Controller.readById(mockReq, res)

        // Assert
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({ code: 200, status: false, message: 'Account number must be 6 characters' })
        expect(logger).toHaveBeenCalledWith('\n> [ERROR] Bad length')
    })

    it("should return an internal server error", async () => {
        // Arrange
        const mockReq = {}

        const dependencies = {
            logger: logger,
            responser: responser
        }

        const Controller = new AccountController(dependencies)

        // Act
        const res = mockRes()
        await Controller.readById(mockReq, res)

        // Assert
        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.json).toHaveBeenCalledWith({ code: 500, status: false, message: 'Internal server error, please contact the administrator' })
        expect(logger).toHaveBeenCalledWith('\n> [ERROR] Internal server error')
    })
})