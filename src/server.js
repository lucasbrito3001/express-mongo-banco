require('dotenv').config()

const app = require('./app')
const mongoose = require('mongoose')
const dbConfig = require('./database/config')


async function startServerAndConnectDatabase() {
    const port = process.env.PORT || 4100
    
    console.log('> Starting the server...')
    await app.listen(port, () => console.log(`> The server is running on port: ${port}\n`))
    
    console.log('> Trying to connect to the database...')
    await mongoose.connect(dbConfig.uri).then(() => {
        console.log('> Successfully connected to the database')
    }).catch((err) => {
        console.log('> Have an error to connect to the database: \n' + err)
    })   
}

startServerAndConnectDatabase()