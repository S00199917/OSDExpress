const express = require('express');
const router = express.Router();

const {Game, validate} = require('../models/games');

router.get('/', async (req, res) => {
    const { name, developers, publishers, pagenumber, pagesize  } = req.query;

    let filter = {};
    
    if (name) {
        filter.name = { $regex: name, $options: 'i' };
    }
    if (developers) {
        filter.developers = { $regex: developers, $options: 'i' };
    }
    if (publishers) {
        filter.publishers = { $regex: publishers, $options: 'i' };
    }

    let pageSizeNumber = parseInt(pagesize);
    
    if (isNaN(pageSizeNumber)) {
        pageSizeNumber = 0
    }
    
    let pageNumberNumber = parseInt(pagenumber);
    if (isNaN(pageNumberNumber)) {
        pageNumberNumber = 1
    }
    
    console.table(filter);

    try {
        const game = await Game.find(filter).limit(pageSizeNumber).sort({ name: 1 }).skip(pageSizeNumber * (pageNumberNumber - 1));
        res.json(game);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});

router.get('/:id', async (req, res) => {
    try {
        const game = await Game.findById(req.params.id);
        if (game)
            res.json(game)
        else
            res.status(404).json({ message: "Game not found" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/', async (req, res) => {
    let result = validate(req.body)

    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }

    let game = new Game(req.body);

    const result2 = await Game.find(game.name);

    if (result2 != null) {
        res.status(400).send("Game already exists");
        return;
    }

    try {
        game = await game.save();
        res.location(`/${book.id}`).status(201).json(book);
    } catch (error) {
        res.status(400).send(error);
        return;
    }
});

router.put('/:id', async (req, res) => {
    const result = validate(req.body)

    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }

    try {
        const game = await Game.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (game) 
            res.json(game);
        else
            res.status(404).json({ error: 'Game not found' });
    } catch (error) {
        res.status(404).json({ error: 'ID not found' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const game = await Game.findByIdAndDelete(req.params.id);
        res.send(`${game.name} has been removed`);
    } catch (error) {
        res.status(404).json(`Game with id of ${req.params.id} not found`);
    }
});

function filterQuery(req) {
    


    return filter;
}

module.exports = router;