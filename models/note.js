"use strict";

const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
  title: {type: String, required: true},
  content: String,
  folderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Folder' }
});

noteSchema.set("timestamps", true);

noteSchema.set("toJSON", { //toObject seems to fix __v in terminal
  virtuals: true,     // include"Note"-in virtual `id`
  transform: (doc, ret) => {
    delete ret._id; // delete `_id`
    delete ret.__v;
  }
});

const note = mongoose.model("Note", noteSchema);
module.exports = mongoose.model("Note", noteSchema);
