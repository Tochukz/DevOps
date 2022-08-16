const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
  return res.send('Welcome to the Pet App');
});

module.exports = router; 