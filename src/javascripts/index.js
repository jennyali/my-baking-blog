import 'babel-polyfill';


var Promise = require('bluebird');
var _ = require('lodash');

require('../sass/main.scss');

$(document).ready(function(){



/*==========================

            MODEL

=============================*/

//------- ARRAYS ----------//

// ------ OBJECTS -----------------//


//------- FUNCTION CONSTRUCTORS ----------//


//------- ARRAY UPDATERS VIA FUNCTION CONSTRUCTORS -----//

/*===========================

            VIEW

=============================*/

//------- SELECTORS ----------//

// Form SELECTORS
var $addIngreBtn = $('#add-ingre-btn');
var $updateIngredientBtn = $('#update-ingredient-btn');
var $formPostDiv = $('#form-post');

var $inputIngreName = $('#input-ingre-name');
var $inputIngreQtn = $('#input-ingre-quantity');
var $inputIngreUnit = $('#input-ingre-unit');
var $subFormIngre = $('#sub-form-ingre');

var $ingredientList = $('#ingredient-list');

var $ingreLiDelBtn = $('.del-btn');
var $ingreLiEditBtn = $('.edit-btn');

var $ingreLi = $('.ingre-li');

// instructions sub-form
var $instructionsForm = $('#instructions-form');
var $instructionsFormList = $('#instructions-form ol');

//images sub-form
var $imgForm = $('.img-form');
var $primaryPhotoWrapper = $('#primary-photo-wrapper');
var $btnPhotoPrimary = $('.btn-photo-primary');

var $secondaryPhotoWrapper = $('#secondary-photo-wrapper');
var $extraPhotoWrapper = $('#extra-photo-wrapper');

//--------VARIABLES ----------//


//------ TEMPLATES ---------//
function primaryPhotoInputTemplate(name) {
    return `
        <div class="form-group">

            <img class="img-responsive img-thumbnail" src="/assets/images/default-placeholder.png">

            <label class="control-label">${name} Photo:</label>
             <div class="input-group">
                 <select id="${name}-photo-select" class="form-control" name="${name}Photo">
                 <option value="default-placeholder.png" selected disabled>Choose from the following...</option>

                </select>
                </div>
            </div>
    `
}


function stepInputTemplate(obj) {
    return `
    <li>
        <div class="input-group">
            <input class="form-control" type="text" name="instructions[]" required />
            <div class="input-group-btn">
                <button class="btn btn-danger remove-step-btn"><span class="icon-bin-2"></span></button>
            </div>
        </div>
    </li>
    `
}


function updatedIngredientLiTemplate(obj) {
    return `
        <li data-id="${obj._id}" class="ingre-li">
            <p style="display: inline-block">${obj.name} ${obj.quantity} ${obj.unit}</p>
            <button class="btn btn-danger btn-sm del-btn" data-id="${obj._id}"><span class="icon-bin-2"></span></button>
            <button class="btn btn-info btn-sm edit-btn" data-id="${obj._id}"><span class="icon-edit-1"></span></button>
        </li>`
}


function ingredientListItemTemplate(obj) {
    return `
        <li data-id="${obj._id}" class="ingre-li">
            <p style="display: inline-block">${obj.name} ${obj.quantity} ${obj.unit}</p>
            <button class="btn btn-danger btn-sm del-btn" data-id="${obj._id}"><span class="icon-bin-2"></span></button>
            <button class="btn btn-default btn-sm edit-btn" data-id="${obj._id}"><span class="icon-edit-1"></span></button>
        </li>`
}

// Button TEMPLATES

function addPrimaryPhotoBtnTemplate(name) {
    return `
        <button class="btn btn-primary btn-photo-${name}">
            Add ${name} Photo <span class="icon-add-1">
        </button>
    `
}

function cancelPhotoBtnTemplate(obj) {
    return `
        <button class="btn btn-danger cancel-photo-btn ">
            <span class="icon-arrow-67"></span> Cancel
        </button>
        `
}

function updateIngreBtnTemplate(obj) {
    return `
        <button id="update-ingredient-btn" class="btn btn-info update-btn" data-id="${obj._id}">
            Update <span class="icon-wrench"></span>
        </button>`
}

function addIngreBtnTemplate(obj) {
    return `
        <button id="add-ingre-btn" class="btn btn-primary">
            Add <span class="icon-add-1"></span>
        </button>`
}

//------- EVENTS ----------//

// ====== Extra Photo

$extraPhotoWrapper.on('click', 'button.btn-photo-extra', function(e) {
 // btn to make select input for photo appear   
    secondaryPhotoHandler(e, $extraPhotoWrapper, 'extra');
});

$extraPhotoWrapper.on('click', 'button.cancel-photo-btn', function(e) {
// removes photo input from DOM, reverts to add photo button
    cancelPrimaryPhotoHandler(e, $extraPhotoWrapper, 'extra');
});

$extraPhotoWrapper.on('change', 'select#extra-photo-select', function(e){
// on change the new value needs to update the img tag    
    primaryPhotoSelectHandler(this, $extraPhotoWrapper);
});

$extraPhotoWrapper.on('click', 'button.delete-img-btn', function(e) {
// uses AJAX to delete current image from recipe    
    primaryPhotoDeleteBtnHandler(e, $extraPhotoWrapper, 'extra');
});

// ====== secondary Photo

$secondaryPhotoWrapper.on('click', 'button.btn-photo-secondary', function(e) {
 // btn to make select input for photo appear   
    secondaryPhotoHandler(e, $secondaryPhotoWrapper, 'secondary');
});

$secondaryPhotoWrapper.on('click', 'button.cancel-photo-btn', function(e) {
// removes photo input from DOM, reverts to add photo button
    cancelPrimaryPhotoHandler(e, $secondaryPhotoWrapper, 'secondary');
});

$secondaryPhotoWrapper.on('change', 'select#secondary-photo-select', function(e){
// on change the new value needs to update the img tag    
    primaryPhotoSelectHandler(this, $secondaryPhotoWrapper);
});

$secondaryPhotoWrapper.on('click', 'button.delete-img-btn', function(e) {
// uses AJAX to delete current image from recipe    
    primaryPhotoDeleteBtnHandler(e, $secondaryPhotoWrapper, 'secondary');
});
//-----------------------------------------------------------
// ====== Primary Photo

$primaryPhotoWrapper.on('click', 'button.delete-img-btn', function(e) {
// uses AJAX to delete current image from recipe    
    primaryPhotoDeleteBtnHandler(e, $primaryPhotoWrapper, 'primary');
});

$primaryPhotoWrapper.on('change', 'select#primary-photo-select', function(e){
// on change the new value needs to update the img tag    
    primaryPhotoSelectHandler(this, $primaryPhotoWrapper);
});

$primaryPhotoWrapper.on('click', 'button.cancel-photo-btn', function(e) {
// removes photo input from DOM, reverts to add photo button
    cancelPrimaryPhotoHandler(e, $primaryPhotoWrapper, 'primary');
});

$primaryPhotoWrapper.on('click', 'button.btn-photo-primary', function(e) {
 // btn to make select input for photo appear   
    primaryPhotoHandler(e, this);
});


//=======  instructions subform 
$instructionsForm.on('click', 'button.remove-step-btn', function(e) {
// remove step from instructions 'form'
    removeStepBtnHandler(e, this);
});

$instructionsForm.on('click', 'button#add-step-btn', function(e) {
// add step button for instructions 'form'
    addStepBtnHandler(e, this);
});

$ingredientList.on('click', 'li button.del-btn', function(e) {
// individual ingredient delete button
    delIngreBtnHandler(e, this);
});

$ingredientList.on('click', 'li button.edit-btn', function(e) {
// individual ingredient edit button
    editIngreBtnHandler(e, this);
});

$subFormIngre.on('click', 'button.update-btn', function(e) {
// individual ingredient update button
    updateIngreBtnHandler(e, this);
});

$subFormIngre.on('click', 'button#add-ingre-btn', function(e) {
// individual ingredient add button
    addIngreBtnHandler(e);
});

/*===========================

        CONTROLLER

=============================*/

//------- FUNCTIONS ----------//

// ======== secondary photo functions

function secondaryPhotoHandler(e, selector, imgName) {
// adds select input to DOM  
    e.preventDefault();
    var postId = $subFormIngre.attr('data-id');

    $.ajax({
        type : 'GET',
        url : './obtain-photo-files/' + postId,
        data : postId,
        dataType : 'json',
        success: function(data) {

            var template = "";
            template += primaryPhotoInputTemplate(imgName);

            selector.empty();
            $(template).appendTo(selector);

            data.map(function(name) {
                $(selector).find('#'+ imgName + '-photo-select').append('<option value=' + name + '>' + name + '</option>');
            });

            var btnTemplate = "";
            btnTemplate += cancelPhotoBtnTemplate();
            $(btnTemplate).appendTo(selector);
            

        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log('error', errorThrown);
        }
    });

}


// ======== primary photo functions
function primaryPhotoDeleteBtnHandler(e, selector, name) {
    e.preventDefault();

    var postId = $subFormIngre.attr('data-id');

    $.ajax({
        type : 'POST',
        url : './delete-' + name +'-photo/' + postId,
        data : postId,
        dataType : 'json',
        success: function(data) {
            var template = "";
            template += addPrimaryPhotoBtnTemplate(name);

            selector.empty();
            $(template).appendTo(selector);

        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log('error', errorThrown);
        }
    });
}



function primaryPhotoSelectHandler(that, selector) {
    var selectValue = $(that).val();

    $(selector).find('img').attr('src', '/assets/images/' + selectValue);
}


function cancelPrimaryPhotoHandler(e, selector, name) {
// removes photo input from DOM
    e.preventDefault();
    var template = "";
    template += addPrimaryPhotoBtnTemplate(name);
    
    selector.find('.cancel-photo-btn').remove();
    selector.empty();
    $(template).appendTo(selector);
}


function primaryPhotoHandler(e, selector) {
// adds select input to DOM  
    e.preventDefault();
    var postId = $subFormIngre.attr('data-id');

    $.ajax({
        type : 'GET',
        url : './obtain-photo-files/' + postId,
        data : postId,
        dataType : 'json',
        success: function(data) {

            var template = "";
            template += primaryPhotoInputTemplate('primary');

            $primaryPhotoWrapper.empty();
            $(template).appendTo($primaryPhotoWrapper);

            data.map(function(name) {
                $($primaryPhotoWrapper).find('#primary-photo-select').append('<option value=' + name + '>' + name + '</option>');
            });

            var btnTemplate = "";
            btnTemplate += cancelPhotoBtnTemplate();
            $(btnTemplate).appendTo($primaryPhotoWrapper);
            

        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log('error', errorThrown);
        }
    });

}


function addStepBtnHandler(e, selector) {
// adds input form for step
    e.preventDefault();
    var template = "";

    template += stepInputTemplate();
    $(template).appendTo($instructionsFormList);
}

function removeStepBtnHandler(e, selector) {
//removes input from DOM
    e.preventDefault();

    $(selector).closest('li').remove();
}



function updateIngreBtnHandler(e, selector) {
    e.preventDefault();

    var postId = $subFormIngre.attr('data-id');
    var ingredientId = $(selector).attr('data-id');

    var formData = {
        'name' : $inputIngreName.val(),
        'quantity' : $inputIngreQtn.val(),
        'unit': $inputIngreUnit.val(),
        'ingredientId': ingredientId
    };

    $.ajax({
        type : 'POST',
        url : './update-ingredient/' + postId,
        data : formData,
        dataType : 'json',
        success: function(data) {
            console.log('ingredient updated');

            var ingredientObj = data;

            //--- Edit exsisting Li via, remove & appendTo. ---//

            //remove.
            var updatedingredientList = $($ingredientList).children('li');

            var foundLi = _.find(updatedingredientList, li => {

                    if ($(li).attr('data-id') === ingredientId) {
                        return li;

                    } else if ($(li).attr('data-id') !== ingredientId) {
                        return console.log('not found in update');
                    }
                });
            
            $(foundLi).remove();

            //appendTo.
            var templateLi = "";
            templateLi += updatedIngredientLiTemplate(ingredientObj);
            $(templateLi).appendTo($ingredientList);


            // Button change: Update -> Add.
            var templateBtn = "";
            templateBtn += addIngreBtnTemplate();
            $($subFormIngre).find('button.update-btn').remove();
            $(templateBtn).appendTo($subFormIngre);

            // Clear form values.

            $inputIngreName.val('');
            $inputIngreQtn.val(0);
            $inputIngreUnit.val('');
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log('error', errorThrown);
        }
    });
}


function editIngreBtnHandler(e, selector) {
    e.preventDefault();

    var li = $(selector).closest('li'); // gets button parent li
    var ingreId = $(li[0]).attr('data-id'); // gets li data-id number
    var postId = $subFormIngre.attr('data-id'); // parent post id

    var ingreData = {
        'ingreId' : ingreId
    };

    $.ajax({
        type : 'POST',
        url : './edit-ingredient/' + postId,
        data : ingreData,
        dataType : 'json',
        success: function(data) {
            //console.log('ingredient ready for edit');

            var ingreObj = data;
            var template = "";
            template += updateIngreBtnTemplate(ingreObj);

            $inputIngreName.val(ingreObj.name);
            $inputIngreQtn.val(ingreObj.quantity);
            $inputIngreUnit.val(ingreObj.unit);

            
            $($subFormIngre).find('button').remove();
            $(template).appendTo($subFormIngre);


        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log('error', errorThrown);
        }
    });
}

function delIngreBtnHandler(e, selector) {
    e.preventDefault();

    var li = $(selector).closest('li');
    var postId = $subFormIngre.attr('data-id');
    var ingreId = $(li[0]).attr('data-id');

    var ingreData = {
        'ingreId' : ingreId
    };

    $.ajax({
        type : 'POST',
        url : './delete-ingredient/' + postId,
        data : ingreData,
        dataType : 'json',
        success: function(data) {
            console.log('ingredient deleted');

            var updatedingredientList = $($ingredientList).children('li');

            var foundLi = _.find(updatedingredientList, li => {

                    if ($(li).attr('data-id') === ingreId) {
                        
                        return li;

                    } else {
                        return console.log('not found');
                    }

                });
            
            $(foundLi).remove();

        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log('error', errorThrown);
        }
    });
}


function addIngreBtnHandler(e) {
    e.preventDefault();

    var postId = $subFormIngre.attr('data-id');

    var formData = {
        'name' : $inputIngreName.val(),
        'quantity' : $inputIngreQtn.val(),
        'unit': $inputIngreUnit.val()
    };

    $.ajax({
        type : 'POST',
        url : './update-post/' + postId,
        data : formData,
        dataType : 'json',
        success: function(data) {
            console.log('ingredient added');
            var newIngre = _.last(data);
            var template = "";
            
            template += ingredientListItemTemplate(newIngre);
            $(template).appendTo($ingredientList);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log('error', errorThrown);
        }
    });

}

//------- FUNCTION CALLS ----------//



});