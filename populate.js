require('dotenv').config()

const db = require('./db/connect')
const role = require('./models/role')

const jsonRole = require('./role.json')

const start = async()=>{
    try {
        await db(process.env.MONGO_URI)
        await role.deleteMany()
        await role.create(jsonRole)
        console.log('success');
        process.exit(0)
    } catch (error) {
        console.log(error);
        process.exit(1)
    }
}

start()