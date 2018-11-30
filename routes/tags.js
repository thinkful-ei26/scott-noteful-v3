"use strict";

const mongoose = require("mongoose");
const express = require("express");
const Tag = require("../models/tag");
const Note = require("../models/note");
const router = express.Router();

router.get("/", (req, res, next) => {
  Tag
    .find()
    .sort("name")
    .then(results => res.json(results))
    .catch(e => next(e));
});

router.get("/:id", (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    let error = new Error("not found");
    error.status = 404;
    return next(error);
  }

  Tag.findById(id)
    .then(result => {
      if (result) {
        res.json(result);
      }else{
        next();
      }
    })
    .catch(e => next(e));
});

router.post("/", (req, res, next) => {
  const { name } = req.body;
  const newTag = {name};

  if (!name) {
    const err = new Error("Missing `name` in request body");
    err.status = 400;
    return next(err);
  }

  Tag.create(newTag)
    .then(results => {
      res.location(`${req.originalUrl}/${results.id}`).status(201).json(results);
    })
    .catch(err => {
      if (err.code === 11000) {
        err = new Error("That tag name already exists");
        err.status = 400;
      }
      next(err);
    });
});

router.put("/:id", (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;
  const updateTag = {name};

  if (!mongoose.Types.ObjectId.isValid(id)) {
    let error = new Error("not found");
    error.status = 404;
    return next(error);
  }

  if (!name) {
    const err = new Error("Missing `name` in request body");
    err.status = 400;
    return next(err);
  }



  Tag.findByIdAndUpdate(id, updateTag, { new: true })
    .then(result => {
      if (result) {
        res.json(result);
      } else {
        next();
      }
    })
    .catch(err => {
      if (err.code === 11000) {
        err = new Error("That tag name already exists");
        err.status = 400;
      }
      next(err);
    });
});

router.delete('/:id', (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    let error = new Error('not found');
    error.status = 404;
    return next(error);
  }

  const tagRemovePromise = Tag.findByIdAndRemove(id);
  const noteUpdatePromise = Note.updateMany(
    {tags: id},
    {$pull: {tags: id}}
  );

  Promise.all([tagRemovePromise, noteUpdatePromise])
    .then(() => res.sendStatus(204).end())
    .catch(e => next(e));

});

module.exports = router;
