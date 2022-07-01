const AccountController = require('../../controllers/AccountController')


const mockReq = {
    body: {},
    params: {}
}

const mockModel = require('../mocks/model')
const mockRes = require('../mocks/expressRes')
const logger = jest.fn()
const responser = jest.fn().mockImplementation((code, message, status) => ({ code: code, status: status, message: message }))

describe('> Account controller [create]', () => {
    it('should create an account successfully', async () => {
        // Arrange
        mockModel.create.mockReturnValue(true)

        const dependencies = {
            model: mockModel,
            responser: responser,
            logger: logger,
            utils: {
                checkEmailDuplication: jest.fn().mockReturnValue({ duplicity: false }),
                hashPassword: jest.fn().mockReturnValue('hashed_pass'),
                generateAccountNumber: jest.fn().mockReturnValue('012345'),
                checkBodyRequest: jest.fn().mockReturnValue(true)
            }
        }

        const Controller = new AccountController(dependencies)

        // Act
        const res = mockRes()
        await Controller.create(mockReq, res, null)

        // Assert
        expect(logger).toHaveBeenCalledWith('\n> [SUCCESS] created successfully')
        expect(res.status).toHaveBeenCalledWith(201)
        expect(res.json).toHaveBeenCalledWith({ code: 201, status: true, message: 'Account created successfully' })
    })

    it('should reject the creation of a new account, and return the duplicate data alert', async () => {
        // Arrange
        const dependencies = {
            responser: responser,
            utils: {
                checkEmailDuplication: jest.fn().mockReturnValue({ duplicity: true }),
                checkBodyRequest: jest.fn().mockReturnValue(true)
            },
            model: mockModel,
            logger: logger
        }

        const Controller = new AccountController(dependencies)

        // Act
        const res = mockRes()
        await Controller.create(mockReq, res, null)

        // Assert
        expect(logger).toHaveBeenCalledWith('\n> [ERROR] email duplication')
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({ code: 200, status: false, message: "Email already in use, please check and try again" })
    })

    it('should return an error to create an account, saying that required data is missing', async () => {
        // Arrange
        const dependencies = {
            responser: responser,
            utils: {
                checkEmailDuplication: jest.fn().mockReturnValue({ duplicity: false }),
                checkBodyRequest: jest.fn().mockReturnValue(false)
            },
            model: mockModel,
            logger: logger
        }

        const Controller = new AccountController(dependencies)

        // Act
        const res = mockRes()
        await Controller.create(mockReq, res, null)

        // Assert
        expect(logger).toHaveBeenCalledWith('\n> [ERROR] missing required datas')
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({ code: 200, status: false, message: 'Missing required data, please check and try again' })
    })

    it('should return an internal server error', async () => {
        // Arrange
        const dependencies = {
            responser: responser,
            logger: logger
        }
        const Controller = new AccountController(dependencies)

        // Act
        const res = mockRes()
        await Controller.create(mockReq, res, null)

        // Assert
        expect(logger).toHaveBeenCalledWith('\n> [ERROR] internal server error')
        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.json).toHaveBeenCalledWith({ code: 500, status: false, message: 'Internal server error, please contact the administrator' })
    })

    it('should return an error to create account', async () => {
        // Arrange
        mockModel.create.mockReturnValue(false)

        const dependencies = {
            responser: responser,
            utils: {
                checkEmailDuplication: jest.fn().mockReturnValue({ duplicity: false }),
                hashPassword: jest.fn().mockReturnValue('hashed_pass'),
                generateAccountNumber: jest.fn().mockReturnValue('012345'),
                checkBodyRequest: jest.fn().mockReturnValue(true)
            },
            model: mockModel,
            logger: logger
        }

        const Controller = new AccountController(dependencies)

        // Act
        const res = mockRes()
        await Controller.create(mockReq, res, null)

        // Assert
        expect(logger).toHaveBeenCalledWith('\n> [ERROR] error to create')
        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.json).toHaveBeenCalledWith({ code: 500, status: false, message: 'Problem to create, contact an administrator' })
    })
})