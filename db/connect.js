const mongoose = require('mongoose')

async function connetDB(url){
    try {
        await mongoose.connect(url)
        console.log('success connect to db');
    } catch (error) {
        console.log('error : ', error)
    }
}

module.exports = connetDB