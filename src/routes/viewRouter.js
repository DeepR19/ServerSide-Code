const express = require('express');
const view = require('../Controller/viewController');

const router = express.Router();

router.get('/pug',view.root)
router.get('/overview', view.getCustomer);

module.exports = router