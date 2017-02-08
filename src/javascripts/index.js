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
var $ingreLi = $('.ingre-li');


//--------VARIABLES ----------//


//------ TEMPLATES ---------//
function ingreListItemTemplate(obj){
    return `
        <li data-id="${obj._id}">
            <p style="display: inline-block">${obj.name} ${obj.quantity} ${obj.unit}</p>
            <button class="btn btn-warning btn-sm del-btn" data-id="${obj._id}"><span class="icon-bin-2"></span></button>
        </li>
    `
}

//------- EVENTS ----------//

$addIngreBtn.on({
    'click' : function(e) {
        addIngreBtnHandler(e);
    }
});

$ingreLi.on('click', $ingreLiDelBtn, function(e) {
    delIngreBtnHandler(e, this);
});

/*===========================

        CONTROLLER

=============================*/

//------- FUNCTIONS ----------//
function delIngreBtnHandler(e, selector) {
    e.preventDefault();

    var postId = $subFormIngre.attr('data-id');
    var ingreId = $(selector).attr('data-id');

    var ingreData = {
        'ingreId' : ingreId
    };

    //console.log(ingreId);
    //console.log(postId);

    $.ajax({
        type : 'POST',
        url : './delete-ingredient/' + postId,
        data : ingreData,
        dataType : 'json',
        success: function(data) {
            console.log('ingredient deleted');

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
            console.log('success, ingredient added');
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