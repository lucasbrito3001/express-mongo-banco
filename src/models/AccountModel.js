const mongoose = require('mongoose')

const { Schema } = mongoose

const AccountSchema = new Schema({
    number: { type: Number, required: true },
    digit: { type: Number, required: true},
    agency: { type: Number, required: true },
    email: { type: String, required: true },
    password_hash: { type: String, required: true },
    transaction_pass: { type: Number, required: true },
    owner: { type: {
        name: { type: String, required: true },
        surname: { type: String, required: true },
        birth_date: { type: Date, required: true },
        cpf: { type: String, required: true },
        address: { type: String, required: true },
        phone: { type: String, required: true }
    }, required: true }
})

module.exports = mongoose.model('Account', AccountSchema)