const path = require("path");
const express = require("express");
const xss = require("xss");
const NotesService = require("./notes-service");
const notesRouter = express.Router();
const jsonParser = express.json();

const serializeNote = (note) => ({
  //   id: note.id,
  //   user_name: xss(need.user_name),
  //   email: xss(need.email),
  //   tampons: xss(need.tampons),
  //   pads: xss(need.pads),
  //   zipcode: xss(need.zipcode),
});

notesRouter
  .route("/")
  .get((req, res, next) => {
    const knexInstance = req.app.get("db");
    NotesService.getAllNotes(knexInstance)
      .then((notes) => {
        res.json(notes.map(serializeNote));
      })
      .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    const { user_name, email, pads, tampons, zipcode } = req.body;
    const newInventory = { user_name, email, pads, tampons, zipcode };

    for (const [key, value] of Object.entries(newInventory)) {
      if (value == null) {
        return res.status(400).json({
          error: {
            message: `Missing '${key}' in request body `,
          },
        });
      }
    }
    InventoriesService.insertInventory(req.app.get("db"), newInventory)
      .then((inventory) => {
        res
          .status(201)
          .location(`/inventories/${inventory.id}`)
          .json(inventory);
      })
      .catch(next);
  });
inventoriesRouter
  .route("/:inventory_id")
  .all((req, res, next) => {
    InventoriesService.getById(req.app.get("db"), req.params.inventory_id)
      .then((inventory) => {
        if (!inventory) {
          return res.status(404).json({
            error: { message: "Inventory doesn't exist" },
          });
        }
        res.inventory = inventory;
        next();
      })
      .catch(next);
  })
  .get((req, res, next) => {
    res.json(serializeInventory(res.inventory));
  })
  .delete((req, res, next) => {
    InventoriesService.deleteInventory(
      req.app.get("db"),
      req.params.inventory_id
    )
      .then((numRowsAffected) => {
        res.status(204).end();
      })
      .catch(next);
  })
  .patch(jsonParser, (req, res, next) => {
    const { user_name, email, tampons, pads, zipcode } = req.body;
    const inventoryToUpdate = { user_name, email, tampons, pads, zipcode };

    const numberOfValues = Object.values(inventoryToUpdate).filter(Boolean)
      .length;
    if (numberOfValues === 0)
      return res.status(400).json({
        error: {
          message:
            "Request body must contain  'user_name', 'email', 'pads','tampons','zipcode'",
        },
      });
    InventoriesService.updateInventory(
      req.app.get("db"),
      req.params.inventory_id,
      inventoryToUpdate
    )
      .then((numRowsAffected) => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = inventoriesRouter;
