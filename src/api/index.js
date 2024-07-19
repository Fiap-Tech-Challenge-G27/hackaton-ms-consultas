const { Router } = require('express'); 
const health = require('./health/routes.js');

const router =  Router();

router.use("/health", health);

module.exports = router;