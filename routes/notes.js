"use strict";

const express = require("express");
const Note = require("../models/note");
const router = express.Router();

/* ========== GET/READ ALL ITEMS ========== */
router.get("/", (req, res, next) => {
  const {searchTerm} = req.query;
  let filter = {};
  const regex = new RegExp(searchTerm, 'i');

  if (searchTerm) {
    filter.title = regex;
  }
  Note.find(filter).sort({ updatedAt: 'desc' })
    .then(results => res.json(results))
    .catch(err => next(err));

  //console.log('Get All Notes');
  // res.json([
  //   { id: 1, title: 'Temp 1' },
  //   { id: 2, title: 'Temp 2' },
  //   { id: 3, title: 'Temp 3' }
  // ]);

});

/* ========== GET/READ A SINGLE ITEM ========== */
router.get("/:id", (req, res, next) => {

  const {id} = req.params;
  Note.findById(id)
    .then(result => {
      if (result) {
        res.json(result);
      }else{
        next();
      }
    })
    .catch(err => next(err));

  // console.log('Get a Note');
  // res.json({ id: 1, title: 'Temp 1' });

});

/* ========== POST/CREATE AN ITEM ========== */
router.post("/", (req, res, next) => {
  if (!req.body.title) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }
  const newNote = req.body;
  Note.create(newNote)
    .then(results => {
      res.location(`${req.originalUrl}/${results.id}`).status(201).json(results);
    })
    .catch(err => next(err));


  // console.log('Create a Note');
  // res.location('path/to/new/document').status(201).json({ id: 2, title: 'Temp 2' });

});

/* ========== PUT/UPDATE A SINGLE ITEM ========== */
router.put("/:id", (req, res, next) => {
  const {id} = req.params;
  const {title, content} = req.body;
  const updateObj = {title, content};
  Note.findByIdAndUpdate(id, updateObj, { new: true })
    .then(result => {
      if (result) {
        res.json(result);
      } else {
        next();
      }
    })
    .catch(err => {
      next(err);
    });
  // console.log('Update a Note');
  // res.json({ id: 1, title: 'Updated Temp 1' });

});

/* ========== DELETE/REMOVE A SINGLE ITEM ========== */
router.delete('/:id', (req, res, next) => {
  const {id} = req.params;
  Note.findByIdAndRemove(id)
    .then(() => {
      res.status(204).end();
    })
    .catch(err => {
      next(err);
    });
  // console.log('Delete a Note');
  // res.status(204).end();
});

module.exports = router;
