class AccountController {
    async createAccount(req, res) {
        res.status(201).json({ code: 201, message: 'Created successfully' });
    }

    async login(req, res) {
        res.status(200).json({ code: 200, message: 'Authenticated successfully' });
    }
}

module.exports = new AccountController