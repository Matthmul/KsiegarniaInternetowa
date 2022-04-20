const { string } = require('joi')
const mongoose = require('mongoose')

//Book Schema

let bookSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    creator: {
        type: String,
        required: true
    },
    isBorrowed: {
        type: Boolean
    },
    borrowedBy: {
        type: String
    }
})

let Book = module.exports = mongoose.model('Book', bookSchema)