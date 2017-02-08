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
var $formPostDiv = $('#form-post');

var $inputIngreName = $('#input-ingre-name');
var $inputIngreQtn = $('#input-ingre-quantity');
var $inputIngreUnit = $('#input-ingre-unit');
var $subFormIngre = $('#sub-form-ingre');

var $ingreList = $('#ingredient-list');

var $ingreLiDelBtn = $('.del-btn');
var $ingreLiEditBtn = $('.edit-btn');

var $ingreLi = $('.ingre-li');



//--------VARIABLES ----------//


//------ TEMPLATES ---------//
function ingreListItemTemplate(obj){
    return `
        <li data-id="${obj._id}" class="ingre-li">
            <p style="display: inline-block">${obj.name} ${obj.quantity} ${obj.unit}</p>
            <button class="btn btn-danger btn-sm del-btn" data-id="${obj._id}"><span class="icon-bin-2"></span></button>
            <button class="btn btn-default btn-sm edit-btn" data-id="{{this._id}}"><span class="icon-edit-1"></span></button>
        </li>
    `
}

//------- EVENTS ----------//

$addIngreBtn.on({
    'click' : function(e) {
        addIngreBtnHandler(e);
    }
});

$ingreList.on('click', 'li button.del-btn', function(e) {
// individual ingredient delete button
    delIngreBtnHandler(e, this);
});

$ingreList.on('click', 'li button.edit-btn', function(e) {
// individual ingredient edit button
    editIngreBtnHandler(e, this);
});



/*===========================

        CONTROLLER

=============================*/

//------- FUNCTIONS ----------//

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
            console.log('ingredient ready for edit');
            console.log(data);

            var ingreObj = data;

            $inputIngreName.val(ingreObj.name);
            $inputIngreQtn.val(ingreObj.quantity);
            $inputIngreUnit.val(ingreObj.unit);
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

            var updatedIngreList = $($ingreList).children('li');

            var foundLi = _.find(updatedIngreList, li => {

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
            
            template += ingreListItemTemplate(newIngre);
            $(template).appendTo($ingreList);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log('error', errorThrown);
        }
    });

}

//------- FUNCTION CALLS ----------//



});