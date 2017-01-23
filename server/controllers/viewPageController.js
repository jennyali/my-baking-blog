// Page View Controller
//------------------------------------

exports.renderViewPage = function(req, res) {
    res.render('formPost', {
        pageTitle: "All Posts",
        hasForm: false,
        hasAllPosts: true
    });
};