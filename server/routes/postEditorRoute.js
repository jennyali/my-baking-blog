// Post Manage Route
//-------------------------------------

var router = require('express').Router();
var postEditorController = require('../controllers/postEditorController');
var viewController = require('../controllers/viewController');

router.use(function(req, res, next) { // this code applies to all the routers on page and projects them from non logged in users
    //console.log(req.isAuthenticated());
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
});

//=== Admin seen Views

router
    .route('/')
    .get(postEditorController.pageRender);

router
    .route('/editCategories')
    .get(postEditorController.categoryFormRender);

router
    .route('/createPost')
    .get(postEditorController.formRender)
    .post(postEditorController.createPost);

router
    .route('/viewPost/:id')
    .get(postEditorController.viewPost);

router
    .route('/viewCategory/:category')
    .get(postEditorController.adminCategoryRender);
    
router
    .route('/editPost/:id')
    .get(postEditorController.formRender)
    .post(postEditorController.editPost);

router
    .route('/deletePost/:id')
    .get(postEditorController.deletePost);

router
    .route('/log-out')
    .get(postEditorController.logout);

//==============  AJAX ROUTES  ==============================//

router
    .route('/create-category')
    .post(postEditorController.createCategory);

router 
    .route('/update-category')
    .post(postEditorController.updateCategory);

router
    .route('/editPost/update-post/:id')
    .post(postEditorController.addIngredient);

router
    .route('/editPost/delete-ingredient/:id')
    .post(postEditorController.deleteIngredient);

router
    .route('/editPost/edit-ingredient/:id')
    .post(postEditorController.editIngredient);

router
    .route('/editPost/update-ingredient/:id')
    .post(postEditorController.updateIngredient);

router
    .route('/editPost/obtain-photo-files/:id')
    .get(postEditorController.obtainPhotoFiles);

router
    .route('/editPost/delete-primary-photo/:id')
    .post(postEditorController.deletePrimaryPhoto);

router
    .route('/editPost/delete-secondary-photo/:id')
    .post(postEditorController.deleteSecondaryPhoto);


module.exports = router;