/* 
*  Author: Phap Duong Dieu
*/
"use strict";


var _stage;
var _cursor;
var _shape;
var _isMouseDown;
var _color;
var _isColorful;
var _size;
var _oldX, _oldY;
var Notification;

//initiate app
$(document).ready(function() {

	//check if touch is supported
	if (createjs.Touch.isSupported()) {
		$("html").addClass("touch");
	}

	init();
});



// change Pen colors
$(".rad-brush").on("change", function() {
	_color = $(".rad-brush:checked").val();
	_isColorful = false;

	if (_color == "colorful") {
		_isColorful = true;
		_color = createjs.Graphics.getRGB(Math.round(Math.random()*255), Math.round(Math.random()*255), Math.round(Math.random()*255));
	}
	_cursor.graphics.beginFill(_color).drawCircle(0, 0, _size);
})

// clear stage
$(".btn-eraser > label").on("click", function() {
	_shape.graphics.clear();
	_stage.update();
});

// save image
$(".btn-save > label").on("click", function() {
	_stage.canvas.toBlob(function(blob) {
		var file = saveAs(blob, "artwork.png");

		//show notification
		showNotification("Artwork <3", "Your artwork has been saved!");
	}, "image/png");

});


function init() {
	//stage canvas
	_stage = new createjs.Stage("workspace");
	_stage.enableDOMEvents(true);
	createjs.Touch.enable(_stage);

	_shape = new createjs.Shape();
	_isMouseDown = false;
	_color = $(".rad-brush:checked").val();
	_isColorful = ($(".rad-brush:checked").val() == "colorful" ? true : false);
	_size = 10;

	//cursor
	_cursor = new createjs.Shape();
	_cursor.graphics.beginFill(_color).drawCircle(0, 0, _size);
	_cursor.x = -100;
	_cursor.y = -100;

	_stage.addChild(_shape, _cursor);
	_stage.update();

	//events
	_stage.on("stagemousedown", stage_OnStageMouseDown);
	_stage.on("stagemouseup", stage_OnStageMouseUp);
	_stage.on("stagemousemove", stage_OnStageMouseMove);
	_stage.on("mouseenter", function() {
		_cursor.graphics.beginFill(_color).drawCircle(0, 0, _size);
		_stage.update();
	});
	_stage.on("mouseleave", function() {
		_cursor.graphics.clear();
		_stage.update();
	});

	// initiate notification request
	Notification = window.Notification || window.mozNotification || window.webkitNotification;
	Notification.requestPermission(function (permission) {
		//console.log(permission);
	});
}


function stage_OnStageMouseDown(e) {
	_isMouseDown = true;
	
	//detect left mouse only
	//console.log(e.nativeEvent.button);
	if(e.nativeEvent.button == 0) {
		//draw a dot whenever mouse down
		_shape.graphics.beginStroke(_color).setStrokeStyle(_size, "round").lineTo(e.stageX, e.stageY);
		_stage.update();
	}
}
function stage_OnStageMouseUp(e) {
	_isMouseDown = false;

	//set random color
	if (_isColorful) {
		_color = createjs.Graphics.getRGB(Math.round(Math.random()*255), Math.round(Math.random()*255), Math.round(Math.random()*255));

		// update new pen color based on the new generated color
		_cursor.graphics.clear();
		_cursor.graphics.beginFill(_color).drawCircle(0, 0, _size);
	}
	
	_stage.update();
}
function stage_OnStageMouseMove(e) {
	_cursor.x = e.stageX;
	_cursor.y = e.stageY;

	//start drawing
	if (_isMouseDown) {
		_shape.graphics.beginStroke(_color).setStrokeStyle(_size, "round").moveTo(_oldX, _oldY).lineTo(e.stageX, e.stageY);
	}

	_stage.update();

	_oldX = e.stageX;
	_oldY = e.stageY;
}


// show notification
function showNotification(title, msg) {
	var instance = new Notification(
		title, {
			body: msg
		}
	);

	instance.onclick = function () {
		// Something to do
	};
	instance.onerror = function () {
		// Something to do
	};
	instance.onshow = function () {
		// Something to do
	};
	instance.onclose = function () {
		// Something to do
	};

	return false;
}
