const router = require('express')
    .Router();
const controller = require('../../controllers/user');

router.route('/')
    .get(controller.getUsers)
    .post(controller.addUser);

module.exports = router;
