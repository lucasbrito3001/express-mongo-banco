require('dotenv').config()

module.exports = {
    uri: `mongodb+srv://lucasbrito3001:${process.env.DB_PASS}@cluster0.nu83g.mongodb.net/?retryWrites=true&w=majority`
};