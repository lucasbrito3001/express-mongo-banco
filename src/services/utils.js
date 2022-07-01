const bcrypt = require('bcrypt')

class Utils {
    async hashPassword(password, salt = 10) {
        return await bcrypt.hash(password, salt)
    }

    async compareHashPassword(password, hashedPassword) {
        return await bcrypt.compare(password, hashedPassword)
    }

    async generateAccountNumber(model) {
        const user = await model.findOne().sort({created_at: -1})

        const newNumber = user?.number ? parseInt(user.number) + 1 : 1

        return String(newNumber).padStart(6, 0)
    }

    async checkEmailDuplication(email, model) {
        const res = await model.findOne({ email: email })

        return { duplicity: res !== null }
    }

    checkBodyRequest(requiredStructure, body) {
        const isFull = requiredStructure.every(property => {
            if(!property.required) return true
            else if(body[property.key]) return true
            else return false
        })

        return isFull
    }
    
    async checkEnoughMoney(model, accountNumber, valueRequested) {
        const transfers = await model.find({ $or: [{ source_account: accountNumber }, { destination_account: accountNumber }] })
    
        const currentBalance = transfers.reduce((start, transaction) => {
            const actionByType = {
                1: () => start += transaction.value,
                2: () => start -= transaction.value,
                3: () => accountNumber === transaction.source_account ? start -= transaction.value : start += transaction.value
            }

            return actionByType[transaction.type_transaction]()
        }, 0)

        return currentBalance >= valueRequested
    }
}

module.exports = Utils