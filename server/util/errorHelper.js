module.exports = function(err){
        var errors = {};

        for(var prop in err.errors){
            if(err.errors.hasOwnProperty(prop)){
                errors[err.errors[prop].path] =err.errors[prop].message;
            }
        }
        return errors;
};