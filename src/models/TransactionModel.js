const mongoose = require('mongoose')

const { Schema } = mongoose

const TransactionSchema = new Schema({
    source_account: { type: Number, required: true, default: null },
    destination_account: { type: Number, required: true, default: null },
    value: { type: Number, required: true },
    type_transaction: { type: Number, required: true },
    status_transaction: { type: Number, required: true, default: 2 }
})

module.exports = mongoose.model('Transaction', TransactionSchema)