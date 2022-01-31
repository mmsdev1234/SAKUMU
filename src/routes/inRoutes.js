'use strict';

const express = require('express');
const router = express.Router();
const inController = require('../controllers/inController');

//GET
router.get("/", inController.noMenu);
router.get("/:no", inController.get);
router.get("/:no/edit", inController.edit);
router.get("/:no/add", inController.addNew);
router.get("/:no/all", inController.getAll);
router.get("/:no/tunggakan", inController.getTunggakan);
router.get("/:no/search", inController.getSearch);
router.get("/:no/delete", inController.getDelete);

//POST
router.post("/:no/edit", inController.update);
router.post("/:no", inController.inSearch);
router.post("/:no/newsubmit", inController.newSubmit);

module.exports = {
    inroutes: router
}