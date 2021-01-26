const path = require("path");
const express = require("express");
const xss = require("xss");
const NoteService = require("./notes-service");
const noteRouter = express.Router();
const jsonBodyParser = express.json();

const serializeNote = (note) => ({
  id: note.id,
  name: xss(note.name),
  content: xss(note.content),
  folderid: note.folderid,
  modified: note.modified,
});

noteRouter
  .route("/")
  .get((req, res, next) => {
    const knexInstance = req.app.get("db");
    NoteService.getAllNotes(knexInstance)
      .then((notes) => {
        res.json(notes.map(serializeNote));
      })
      .catch(next);
  })
  .post(jsonBodyParser, (req, res, next) => {
    const knexInstance = req.app.get("db");
    const { name, content, folderid, modified } = req.body;
    const newNote = { name, content, folderid };

    for (const [key, value] of Object.entries(newNote))
      if (value == null)
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` },
        });

    newNote.folderid = Number(folderid);

    if (modified) {
      newNote.modified = modified;
    }

    NoteService.insertNote(knexInstance, newNote)
      .then((note) => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${note.id}`))
          .json(serializeNote(note));
      })
      .catch(next);
  });

noteRouter
  .route("/:id")
  .all((req, res, next) => {
    NoteService.getById(req.app.get("db"), req.params.id)
      .then((note) => {
        if (!note) {
          return res.status(404).json({
            error: { message: "Note does not exist" },
          });
        }
        res.note = note;
        next();
      })
      .catch(next);
  })
  .get((req, res, next) => {
    res.json(serializeNote(res.note));
  })
  .delete((req, res, next) => {
    NoteService.deleteNote(req.app.get("db"), req.params.id)
      .then((numRowsAffected) => {
        return res.status(204).end();
      })
      .catch(next);
  })
  .patch(jsonBodyParser, (req, res, next) => {
    const { name, content, modified } = req.body;
    const newNoteFields = { name, content, modified };

    const numOfValues = Object.values(newNoteFields).filter(Boolean).length;
    if (numOfValues === 0) {
      return res.status(400).json({
        error: {
          message: "Your response must include: name, content",
        },
      });
    }

    NoteService.updateNote(req.app.get("db"), req.params.id, newNoteFields)
      .then((numRowsAffected) => {
        return res.status(204).end();
      })
      .catch(next);
  });

module.exports = noteRouter;
