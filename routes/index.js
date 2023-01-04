// const { prisma } = require('@prisma/client');
const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', async function (req, res) {
  res.status(200).json({
    status: 200,
    msg: "Example Get",
    data: ["Hello World", "WWorldHello", "Hi Worldy"]
  });
});

module.exports = router;
