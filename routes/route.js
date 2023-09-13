const router = require('express').Router();
const apiRequests = require('../controller/controller');

router.post('/api', apiRequests);
router.get('/api/:user_id', apiRequests);
router.put('/api/:user_id', apiRequests);
router.delete('/api/:user_id', apiRequests);


module.exports = router;