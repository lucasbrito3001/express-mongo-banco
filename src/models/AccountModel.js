const mongoose = require('mongoose')

const { Schema } = mongoose

const AccountSchema = new Schema({
    number: { type: String, required: true, unique: true },
    agency: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password_hash: { type: String, required: true, select: false },
    transaction_pass_hash: { type: Number, required: true, select: false },
    owner: { type: {
        name: { type: String, required: true },
        surname: { type: String, required: true },
        birth_date: { type: Date, required: true },
        phone: { type: String, required: true }
    }, required: true },
    created_at: { type: Date, required: true, default: Date.now() }
})

module.exports = mongoose.model('Account', AccountSchema)