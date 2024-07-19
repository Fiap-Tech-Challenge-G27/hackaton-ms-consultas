const { Router } = require('express');

const controller = require('./controller.js');

const router = Router();

router.get('', controller.getHealth);

module.exports = router;