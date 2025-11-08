const router = require('express').Router()
const middleware = require('../middlewares/middleware')
const newsController = require('../controllers/newsController')


// dashboard

router.post('/api/news/add', middleware.auth, newsController.add_news)
router.put('/api/news/update/:news_id', middleware.auth, newsController.update_news)
router.put('/api/news/status-update/:news_id', middleware.auth, newsController.update_news_update)
router.delete('/api/news/:news_id', middleware.auth, newsController.delete_news)

router.get('/api/images', middleware.auth, newsController.get_images)
router.post('/api/images/add', middleware.auth, newsController.add_images)

router.get('/api/news', middleware.auth, newsController.get_dashboard_news)
router.get('/api/news/:news_id', middleware.auth, newsController.get_dashboard_single_news)
router.get('/api/writer/stats', middleware.auth, newsController.get_writer_stats)
router.get('/api/admin/stats', middleware.auth, middleware.role, newsController.get_admin_stats)
router.get('/api/editor/stats', middleware.auth, middleware.editorOrAdmin, newsController.get_writer_stats)
router.get('/api/dashboard/recent-news', middleware.auth, newsController.get_dashboard_recent_news)


// website

router.get('/api/all/news', newsController.get_all_news)
router.get('/api/popular/news', newsController.get_popular_news)
router.get('/api/latest/news', newsController.get_latest_news)
router.get('/api/images/news', newsController.get_images)
router.get('/api/recent/news', newsController.get_recent_news)

router.get('/api/news', newsController.get_news_list)
router.get('/api/news/:id', newsController.get_single_news)
router.get('/api/categories', newsController.get_categories_list)
router.get('/api/news/search', newsController.news_search)

router.get('/api/news/details/:slug', newsController.get_news)
router.get('/api/news/view/:slug', newsController.get_news)
router.get('/api/category/all', newsController.get_categories)

router.get('/api/category/news/:category', newsController.get_category_news)
router.get('/api/search/news', newsController.news_search)

router.delete('/api/clear-sample-data', newsController.clear_sample_data)



// Category management routes (admin only)
router.post('/api/categories', middleware.auth, middleware.role, newsController.add_category)
router.get('/api/categories/admin', middleware.auth, middleware.role, newsController.get_categories_admin)
router.put('/api/categories/:category_id', middleware.auth, middleware.role, newsController.update_category)
router.delete('/api/categories/:category_id', middleware.auth, middleware.role, newsController.delete_category)
router.get('/api/categories/active', newsController.get_active_categories)

module.exports = router
