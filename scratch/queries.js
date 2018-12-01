"use strict";

const mongoose = require('mongoose');
const { MONGODB_URI } = require('../config');

const Note = require('../models/note');


mongoose.connect(MONGODB_URI, { useNewUrlParser: true })
  .then(() => {
    const searchTerm = 'ipsum';
    let filter = {};
    const regex = new RegExp(searchTerm, 'i');
    if (searchTerm) {
      filter = { $or: [
        {title: regex},
        {content: regex}
      ]};
    }
    return Note.find(filter).sort({ updatedAt: 'desc' });
  })
  .then(results => {
    console.log(results);
  })
  .then(() => {
    return mongoose.disconnect();
  })
  .catch(err => {
    console.error(`ERROR: ${err.message}`);
    console.error(err);
  });


// mongoose.connect(MONGODB_URI, { useNewUrlParser: true })
//   .then(() => {
//     const id = "000000000000000000000007";
//
//     return Note.findById(id);
//   })
//   .then(results => {
//     console.log(results);
//   })
//   .then(() => {
//     return mongoose.disconnect();
//   })
//   .catch(err => {
//     console.error(`ERROR: ${err.message}`);
//     console.error(err);
//   });

// mongoose.connect(MONGODB_URI, { useNewUrlParser: true })
//   .then(() => {
//     const newNote = {"title": "Wubba Lubba Dub Dub", "content": "It means I am in great pain"};
//     return Note.create(newNote);
//   })
//   .then(results => {
//     console.log(results);
//   })
//   .then(() => {
//     return mongoose.disconnect();
//   })
//   .catch(err => {
//     console.error(`ERROR: ${err.message}`);
//     console.error(err);
//   });

// mongoose.connect(MONGODB_URI, { useNewUrlParser: true })
//   .then(() => {
//     const updateNote = {"title": "Wubba Lubba Dub Dub x3", "content": "It means I updated"};
//     return Note.findByIdAndUpdate("5bfdadc5d6e28500ce353c4f", updateNote, {new: true});
//   })
//   .then(results => {
//     console.log(results);
//   })
//   .then(() => {
//     return mongoose.disconnect();
//   })
//   .catch(err => {
//     console.error(`ERROR: ${err.message}`);
//     console.error(err);
//   });

// mongoose.connect(MONGODB_URI, { useNewUrlParser: true })
//   .then(() => {
//     return Note.findByIdAndRemove("5bfdadc5d6e28500ce353c4f");
//   })
//   .then(results => {
//     console.log(results);
//   })
//   .then(() => {
//     return mongoose.disconnect();
//   })
//   .catch(err => {
//     console.error(`ERROR: ${err.message}`);
//     console.error(err);
//   });
