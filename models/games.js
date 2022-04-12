const mongoose = require('mongoose');
const joi = require('joi');

const gameSchema = new mongoose.Schema({
    name: String,
    developers: String,
    publishers: String,
    description: String,
    img: String
});

const Game = mongoose.model('Game', gameSchema);

function validation(game) {
    const schema = joi.object({
        name: joi.string().max(50).required(),
        developers: joi.array().items(joi.string()).min(1).max(50).required(),
        publishers: joi.array().items(joi.string()).min(1).max(50).required(),
        description: joi.string().max(500).required(),
        img: joi.string().required()
    });

    return schema.validate(game);
}

exports.Game = Game;
exports.validate = validation;