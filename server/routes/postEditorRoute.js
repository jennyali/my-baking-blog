// Post Manage Route
//-------------------------------------

var router = require('express').Router();
var postEditorController = require('../controllers/postEditorController');

router.use(function(req, res, next) {
    console.log(req.isAuthenticated());
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
});

router
    .route('/')
    .get(postEditorController.pageRender);

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


//==============  AJAX ROUTES  ==============================//

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