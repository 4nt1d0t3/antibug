const express = require('express');
const router = express.Router();

//INDEX -- PROJECTS ROUTE
router.get('/projects', (req, res) => {
	res.render('projects');
});

module.exports = router;