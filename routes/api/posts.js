const express = require('express')
const router = express.Router();

// @route     Get api/posts/test
// @desc      Tests posts route
// @access    Public
router.get('/test', (req,res) => res.json({
    msg: "Posts working"
}))

module.exports = router;