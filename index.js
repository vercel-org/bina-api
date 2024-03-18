const express = require('express')
const app = express()
require('dotenv').config()


const component = require('./routes/form-component')
const country = require('./routes/country')
const role = require('./routes/role')
const agent = require('./routes/agent')
const user = require('./routes/user')
const job_order = require('./routes/job-order')
const news_event = require('./routes/news-event')
const register = require('./routes/form-registration')




const db = require('./db/connect')
const errorHandler = require('./middleware/error-handler')
const notFound = require('./middleware/not-found')

app.use(express.json())

//route
app.use('/api/v1',[component,country,role,agent,user,job_order,news_event,register])
app.use(errorHandler)
app.use(notFound)

const start = async()=>{
    try {
        await db(process.env.MONGO_URI)
        const port = process.env.PORT
        return app.listen(port,console.log(`success connect to port ${port}`));
    } catch (error) {
        return console.log(error);
    }
}

start()