const mongoose = require('mongoose')

const newsEventSchema = new mongoose.Schema({
    title : {
        type : String,
        required: [true, `Title is required`]
    }, 
    content : {
        type : String,
        required: [true, `Content is required`]
    },
    picture : {
        type : Array
    }
},{
    timestamps:true
})

module.exports = mongoose.model("news_event", newsEventSchema)
