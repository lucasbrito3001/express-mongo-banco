const AccountsStructure = [
    { key: 'email', required: true },
    { key: 'password', required: true },
    { key: 'transaction_pass', required: true },
    { key: 'name', required: true },
    { key: 'surname', required: true },
    { key: 'birth_date', required: true },
    { key: 'phone', required: true }
]

const TransferStructure = [
    { key: 'source_account', required: false },
    { key: 'destination_account', required: false },
    { key: 'value', required: true },
    { key: 'type_transaction', required: true }
]

const DepositStructure = [
    { key: 'destination_account', required: false },
    { key: 'value', required: true },
]

const WithdrawStructure = [
    { key: 'source_account', required: false },
    { key: 'value', required: true },
]

module.exports = { 
    AccountsStructure, 
    TransferStructure,
    DepositStructure,
    WithdrawStructure
}