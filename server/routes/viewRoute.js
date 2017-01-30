//View Route

var router = require('express').Router();
var viewController = require('../controllers/viewController');

router
    .route('/')
    .get(viewController.homeRenderPagi);

router
    .route('/recipe-index')
    .get(viewController.recipeIndexCategories);

router
    .route('/recipe-index/:category')
    .get(viewController.categoryRender);

router
    .route('/recipe-index/page')
    .get(viewController.recipeIndexPagi);

router
    .route('/view-post/:id')
    .get(viewController.viewPostRender);

router
    .route('/about')
    .get(viewController.aboutRender);


module.exports = router;