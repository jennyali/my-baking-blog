// View Controller

exports.home = (req, res) => {
    
    res.render('home');
};

exports.postWrapper = (req, res) => {
    
    res.render('postWrapper', { 
        pageTitle: "Create Post",
        hasForm: true
    });
};