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

router
    .route('/search-results')
    .get(viewController.searchRender);

router
    .route('/gallery')
    .get(viewController.galleryRender);


//==============  AJAX ROUTES  ==============================//

router
    .route('/fill-categories')
    .get(viewController.fillCategoryPanel);

router 
    .route('/find-gallery-photo')
    .post(viewController.findGalleryPhoto);


module.exports = router;