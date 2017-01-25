// View Controller

exports.home = function(req, res) {
    
    res.render('home');
};

exports.postWrapper = function(req, res) {
    
    res.render('postWrapper', { 
        pageTitle: "Create Post",
        hasForm: true
    });
};