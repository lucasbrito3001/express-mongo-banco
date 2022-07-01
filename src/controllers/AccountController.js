const { AccountsStructure } = require('../services/modelsStructures')

class AccountController {
    agency = '1234'
    model = undefined
    responser = undefined
    utils = undefined
    logger = undefined

    constructor({ model, responser, utils, logger }) {
        this.model = model
        this.responser = responser
        this.utils = utils
        this.logger = logger
    }

    readAll = async (req, res) => {
        let response = {}
        try {
            const accounts = await this.model.find()
            this.logger('\n> [SUCCESS] Found')

            response = this.responser(200, 'ok', true, 'read', accounts)
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
            
            const account = await this.model.find({ number: accountNumber })

            if(!!account) {
                this.logger('\n> [SUCCESS] Found')
                response = this.responser(200, 'ok', true, 'read', account)
            } else {
                this.logger('\n> [ERROR] Not found')
                response = this.responser(200, 'Account not found', false, 'read')
            }

        } catch (error) {
            this.logger('\n> [ERROR] Internal server error')
            response = this.responser(500, 'Internal server error, please contact the administrator', false, 'write')
        }

        res.status(response.code).json(response)
    }

    create = async (req, res) => {
        let response = {}
        try {
            const isBodyFull = this.utils.checkBodyRequest(AccountsStructure, req.body)
            
            if(isBodyFull) {
                const { email, password, transaction_pass, name, surname, birth_date, phone } = req.body
    
                const { duplicity } = await this.utils.checkEmailDuplication(email, this.model)
    
                if(duplicity) {
                    this.logger('\n> [ERROR] email duplication')
    
                    response = this.responser(200, "Email already in use, please check and try again", false, 'write')
                    return res.status(response.code).json(response)
                }
    
                const account_number = await this.utils.generateAccountNumber(this.model)

                const account_infos = {
                    number: account_number,
                    agency: this.agency,
                    email,
                    password_hash: await this.utils.hashPassword(password),
                    transaction_pass_hash: await this.utils.hashPassword(transaction_pass),
                    owner: { name, surname, birth_date, phone }
                }

                const created = await this.model.create(account_infos)
                
                if(created) {
                    this.logger('\n> [SUCCESS] created successfully')
                    response = this.responser(201, 'Account created successfully', true, 'write'); 
                } else {
                    this.logger('\n> [ERROR] error to create')
                    response = this.responser(500, 'Problem to create, contact an administrator', false, 'write'); 
                }
    
            } else {
                this.logger('\n> [ERROR] missing required datas')
                response = this.responser(200, 'Missing required data, please check and try again', false, 'write')
            } 

        } catch (error) {
            this.logger('\n> [ERROR] internal server error')
            response = this.responser(500, 'Internal server error, please contact the administrator', false, 'write')
        }

        res.status(response.code).json(response)
    }

    login = async (req, res) => {
        let response = {}
        try {
            const isBodyFull = this.utils.checkBodyRequest(AccountsStructure, req.body)

            if(isBodyFull) {
                const { email, password } = req.body

                const { password_hash } = await this.model.findOne({ email: email })

                if(password_hash) {
                    const isAuthenticated = await this.utils.compareHashPassword(password, password_hash)

                    if(isAuthenticated) {
                        this.logger('\n> [SUCCESS] Logged')
                        response = this.responser(200, 'Authenticated', true, 'write')
                    } else {
                        this.logger('\n> [Error] Bad pass')
                        response = this.responser(401, 'Unauthorized', false, 'write')
                    } 

                } else {
                    response = this.responser(401, 'Unauthorized', false, 'write')
                    this.logger('\n> [ERROR] Not found')
                } 
            } else {
                this.logger('\n> [ERROR] missing required datas')
                response = this.responser(200, 'Missing required data, please check and try again', false, 'write')
            }
        } catch (error) {
            this.logger('\n> [ERROR] internal server error')
            response = this.responser(500, 'Internal server error, please contact the administrator', false, 'write')
        }

        res.status(response.code).json(response)
    }
}

module.exports = AccountController