const router = require('express').Router();
const userController = require('../controllers/user');

router.post('/', userController.createUser);
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);

module.exports = router;
