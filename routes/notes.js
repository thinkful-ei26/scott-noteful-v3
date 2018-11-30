"use strict";
const mongoose = require("mongoose");

const express = require("express");
const Note = require("../models/note");
const router = express.Router();

/* ========== GET/READ ALL ITEMS ========== */
router.get("/", (req, res, next) => {
  const {searchTerm, folderId, tagId} = req.query; //why would tagId be in request query?
  let filter = {};
  const regex = new RegExp(searchTerm, "i");

  if (searchTerm) {
    filter.title = regex;
  }

  if (folderId) {
    filter.folderId = folderId;
  }

  if (tagId) {
    filter.tagId =tagId;
  }

  Note
    .find(filter)
    .populate("tags")
    .sort({ updatedAt: "desc" })
    .then(results => res.json(results))
    .catch(e => next(e));
});

/* ========== GET/READ A SINGLE ITEM ========== */
router.get("/:id", (req, res, next) => {

  const { id } = req.params;
  Note.findById(id)
    .populate("tags")
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
  const { title, content, folderId, tags = [] } = req.body;
  const newNote = {title, content, folderId, tags};


  if (folderId && !mongoose.Types.ObjectId.isValid(folderId)) {
    let error = new Error("not found");
    error.status = 404;
    return next(error);
  }

  tags.forEach((tag) => {
    if (!mongoose.Types.ObjectId.isValid(tag)) {
      const err = new Error("The `id` is not valid");
      err.status = 400;
      return next(err);
    }
  });

  if (!title) {
    const err = new Error("Missing `title` in request body");
    err.status = 400;
    return next(err);
  }
  if (folderId === "") {
    delete newNote.folderId;
  }

  Note.create(newNote)
    .then(results => {
      res.location(`${req.originalUrl}/${results.id}`).status(201).json(results);
    })
    .catch(e => next(e));


  // console.log('Create a Note');
  // res.location('path/to/new/document').status(201).json({ id: 2, title: 'Temp 2' });

});

/* ========== PUT/UPDATE A SINGLE ITEM ========== */
router.put("/:id", (req, res, next) => {
  const {id} = req.params;
  const {title, content, folderId, tags =[]} = req.body;
  const updateObj = {title, content, folderId};


  if (folderId && !mongoose.Types.ObjectId.isValid(folderId)) {
    let error = new Error('not found');
    error.status = 404;
    return next(error);
  }

  tags.forEach((tag) => {
    if (!mongoose.Types.ObjectId.isValid(tag)) {
      const err = new Error("The `id` is not valid");
      err.status = 400;
      return next(err);
    }
  });

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
});

module.exports = router;
