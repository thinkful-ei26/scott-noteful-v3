"use strict";
const mongoose = require('mongoose');
const express = require("express");
const Folder = require("../models/folder");
const Note = require("../models/note");

const router = express.Router();

router.get("/", (req, res, next) => {
  Folder
    .find()
    .sort("name")
    .then(results => res.json(results))
    .catch(e => next(e));
});

router.get("/:id", (req, res, next) => {
  const {id} = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    let error = new Error('not found');
    error.status = 404;
    return next(error);
  }

  Folder.findById(id)
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
  const newFolder = {name};

  if (!name) {
    const err = new Error('Missing `name` in request body');
    err.status = 400;
    return next(err);
  }

  Folder.create(newFolder)
    .then(results => {
      res.location(`${req.originalUrl}/${results.id}`).status(201).json(results);
    })
    .catch(err => {
      if (err.code === 11000) {
        err = new Error('The folder name already exists');
        err.status = 400;
      }
      next(err);
    });
});

router.put("/:id", (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;
  const updateFolder = {name};

  if (!mongoose.Types.ObjectId.isValid(id)) {
    let error = new Error('not found');
    error.status = 404;
    return next(error);
  }

  if (!name) {
    const err = new Error('Missing `name` in request body');
    err.status = 400;
    return next(err);
  }



  Folder.findByIdAndUpdate(id, updateFolder, { new: true })
    .then(result => {
      if (result) {
        res.json(result);
      } else {
        next();
      }
    })
    .catch(err => {
      if (err.code === 11000) {
        err = new Error('The folder name already exists');
        err.status = 400;
      }
      next(err);
    });
});

router.delete('/:id', (req, res, next) => {
  const {id} = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    let error = new Error('not found');
    error.status = 404;
    return next(error);
  }

  Note.deleteMany({ folderId: id })
    .then(() =>{
      return Folder.findByIdAndRemove(id);
    })
    .then(() => {
      res.status(204).end();
    })
    .catch(err => {
      next(err);
    });




});


module.exports = router;
