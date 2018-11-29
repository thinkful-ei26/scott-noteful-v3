"use strict";
const mongoose = require('mongoose');

const express = require("express");
const Note = require("../models/note");
const router = express.Router();

/* ========== GET/READ ALL ITEMS ========== */
router.get("/", (req, res, next) => {
  const {searchTerm, folderId} = req.query;
  let filter = {};
  const regex = new RegExp(searchTerm, 'i');

  if (searchTerm) {
    filter.title = regex;
  }

  if (folderId) {
    filter.folderId = folderId;
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
  const { title, content, folderId } = req.body;
  const newNote = {title, content, folderId};

  if (!mongoose.Types.ObjectId.isValid(folderId)) {
    let error = new Error('not found');
    error.status = 404;
    return next(error);
  }

  if (!title) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }

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
  const {title, content, folderId} = req.body;
  const updateObj = {title, content, folderId};

  if (!mongoose.Types.ObjectId.isValid(folderId)) {
    let error = new Error('not found');
    error.status = 404;
    return next(error);
  }

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
