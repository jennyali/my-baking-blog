// Post Manage Route
//-------------------------------------

var router = require('express').Router();
var postEditorController = require('../controllers/postEditorController');

router
    .route('/')
    .get(postEditorController.pageRender);

router
    .route('/editPost/update-post/:id')
    .post(postEditorController.updatePost);

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
    .route('/ingredients-list/:id')
    .get(postEditorController.ingreFormRender)
    .post(postEditorController.ingreFormProcess);


module.exports = router;