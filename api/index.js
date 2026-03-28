const express = require('express');
const morgan = require('morgan')
const path = require('path')
const cors = require('cors')
const app = express()
require('dotenv').config();

const Person = require('../models/person');
const { Query } = require('mongoose');

app.use(express.json());
app.use(cors())


morgan.token('body', (req, res) => {
    if (req.method === 'POST') {
        return JSON.stringify(req.body);
    }
    return ''
})


app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


app.use(express.static(path.join(__dirname, '..', 'dist')))

app.get('/api/persons', (request, response, next) => {
    Person.find({}).then(persons => {
        response.json(persons)
    }).catch(error => next(error))
});


app.post('/api/persons', (request, response, next) => {

    if (!request.body.name || !request.body.number) {
        return response.status(400).send({
            error: "name or number Missing !"
        });
    }
    const person = new Person({
        name: request.body.name,
        number: request.body.number
    });
    person.save().then(savedPerson => {
        response.status(201).json(savedPerson)
    }).catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
    .then(result => {
        response.status(204).end();
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
    const person = {
        name: request.body.name,
        number: request.body.number
    }

    Person.findByIdAndUpdate(request.params.id, person, {new: true, runValidators: true, context: 'query'})
    .then(UpdatedPerson => {
        if (UpdatedPerson){
            response.json(UpdatedPerson)
        }else {
            response.status(404).end()
        }
    })
    .catch(error => next(error))
})

const ErrorHandler = (error, request, response, next) => {
    console.log(error.message)

    if (error.name === 'CastError'){
        return response.status(400).send({error: 'malformed id'})
    }
    if (error.name === 'ValidationError')
        return response.status(400).send({error: error.message})

    next(error);
}

app.use(ErrorHandler)

if (process.env.NODE_ENV !== 'test') {
    const PORT = process.env.PORT || 3001
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`)
    })
}


module.exports = app;