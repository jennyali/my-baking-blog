// Post Manage Route
//-------------------------------------

var router = require('express').Router();
var postEditorController = require('../controllers/postEditorController');

router
    .route('/')
    .get(postEditorController.pageRender)
    .post(postEditorController.createPost);

router
    .route('/editPost/:id')
    .get(postEditorController.editPost)
    .post(postEditorController.updatePost);

router
    .route('/deletePost/:id')
    .get(postEditorController.deletePost);


module.exports = router;