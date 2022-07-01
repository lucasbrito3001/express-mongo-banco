const express = require('express')
const cors = require('cors')
const AccountsRoutes = require("./routes/Account")
const TransactionsRoutes = require("./routes/Transaction")
class App {
    constructor() {
        this.express = express()

        this.middlewares()
        this.routes()
    }

    middlewares() {
        this.express.use(express.json())
        this.express.use(cors())
    }

    routes() {
        this.express.use(
            '/api/v1',
            [AccountsRoutes, TransactionsRoutes]
        )
    }
}

module.exports = new App().express