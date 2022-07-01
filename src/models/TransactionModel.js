const mongoose = require('mongoose')

const { Schema } = mongoose

const TransactionSchema = new Schema({
    source_account: { type: String, required: true, default: "" },
    destination_account: { type: String, required: true, default: "" },
    value: { type: Number, required: true },
    type_transaction: { type: Number, required: true }
})

module.exports = mongoose.model('Transaction', TransactionSchema)