const express = require('express');
const router = express.Router();

const savedata = require('../controllers/savedataController');

router.get('/company', savedata.companies);
router.get('/nasdaq', savedata.nasdaq);
router.get('/stockprice', savedata.stockprice);
router.get('/keymetrix', savedata.keymetrix);
router.get('/dividend', savedata.dividend);

module.exports = router