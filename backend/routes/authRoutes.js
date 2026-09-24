const router = require('express').Router()
const authController = require('../controllers/authControllers')
const middleware = require('../middlewares/middleware')

router.post('/api/login', authController.login)
router.post('/api/signup', authController.signup)
router.post('/api/news/writer/add',middleware.auth,middleware.role, authController.add_writer)

router.get('/api/news/writers',middleware.auth,middleware.role, authController.get_writers)
router.get('/api/news/staff',middleware.auth,middleware.role, authController.get_staff) // For all staff
router.delete('/api/news/member/:id',middleware.auth,middleware.role, authController.delete_member)
router.get('/api/news/writer/:id',middleware.auth,middleware.role, authController.get_writer)
router.post('/api/change-password', middleware.auth, authController.change_password)
router.post('/api/update-profile-image', middleware.auth, authController.update_profile_image)

module.exports = router
