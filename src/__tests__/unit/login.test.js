const AccountController = require('../../controllers/AccountController')

const mockReq = {
    body: {}
}
const mockModel = require('../mocks/model')
const mockRes = require('../mocks/expressRes')
const logger = jest.fn()
const responser = jest.fn().mockImplementation((code, message, status, action, data) => ({ code: code, status: status, message: message, data: data }))

describe('> Account controller [login]', () => {
    it('should login successfully', async () => {
        // Arrange
        const dependencies = {
            model: mockModel,
            logger: logger,
            responser: responser,
            utils: {
                compareHashPassword: jest.fn().mockReturnValue(true),
                checkBodyRequest: jest.fn().mockReturnValue(true)
            }
        }

        const Controller = new AccountController(dependencies)
        mockModel.findOne.mockReturnValue({ password_hash: 'hashed_123' })

        // Act
        const res = mockRes()
        await Controller.login(mockReq, res)

        // Assert
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({ code: 200, message: 'Authenticated', status: true })
    })

    it('should fail login by not found account', async () => {
        // Arrange
        const dependencies = {
            model: mockModel,
            logger: logger,
            responser: responser,
            utils: {
                checkBodyRequest: jest.fn().mockReturnValue(true)
            }
        }

        const Controller = new AccountController(dependencies)
        mockModel.findOne.mockReturnValue({})

        // Act
        const res = mockRes()
        await Controller.login(mockReq, res)

        // Assert
        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.json).toHaveBeenCalledWith({ code: 401, message: 'Unauthorized', status: false })
    })

    it('should fail login by bad pass', async () => {
        // Arrange
        const dependencies = {
            model: mockModel,
            logger: logger,
            responser: responser,
            utils: {
                compareHashPassword: jest.fn().mockReturnValue(false),
                checkBodyRequest: jest.fn().mockReturnValue(true)
            }
        }

        const Controller = new AccountController(dependencies)
        mockModel.findOne.mockReturnValue({ password_hash: 'hashed_123' })

        // Act
        const res = mockRes()
        await Controller.login(mockReq, res)

        // Assert
        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.json).toHaveBeenCalledWith({ code: 401, message: 'Unauthorized', status: false })
    })

    it('should return internal server error, missing dependencies', async () => {
        // Arrange
        const dependencies = {
            logger: logger,
            responser: responser,
        }

        const Controller = new AccountController(dependencies)

        // Act
        const res = mockRes()
        await Controller.login(mockReq, res)

        // Assert
        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.json).toHaveBeenCalledWith({ code: 500, message: 'Internal server error, please contact the administrator', status: false })
    })
})