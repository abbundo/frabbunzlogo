/*global window, document */
var maxWide = 5;
var minWide = 1;
var wideDelta = 0.1;
var factorScaleX = 4;
var factorScaleY = 4;
var centerX;
var centerY;
var basicPoints = [[0, 0], [0, 2], [-1, 2], [-2, 2], [-2, 1], [-2, 0], [-2, -1], [-2, -2], [-1, -2], [0, -2], [1, -2], [2, -2], [2, -1], [2, 0], [2, 1], [2, 2], [1, 2]];
var basicPointsLen = basicPoints.length;
var basicPointsHalfLen = parseInt('' + (basicPointsLen / 2), 10);

/*each zircle has a b factor and an [x0,y0] starting poit */
var drawZircle = function (x0, y0, containerName, stepZ, px, py, k1) {
    "use strict";
    var canvasContainer = $('#' + containerName)[0];
    var context = canvasContainer.getContext("2d");
    context.strokeStyle = "rgba(109,109,109,0.8)";
    context.beginPath();
    var currX = x0;
    var currY = y0;
    var iterations = 0;
    var i;
    var a;
    var b;
    var currentStep = 2 + basicPointsHalfLen;
    while (currentStep < (k1 + basicPointsLen + 1)) {
        i = currentStep % basicPointsLen;
        if (iterations >= k1) {
            context.beginPath();
            context.strokeStyle = "rgba(109,109,109,0.8)";
            a = currX;
            b = currY;
            context.moveTo(a, b);
            a = currX + basicPoints[i][0] * factorScaleX;
            b = currY + basicPoints[i][1] * factorScaleY;
            context.lineTo(a, b);
            a = currX + basicPoints[i][0] * factorScaleX + stepZ * factorScaleX * px;
            b = currY + basicPoints[i][1] * factorScaleY + stepZ * factorScaleY * py;
            context.lineTo(a, b);
            a = currX + stepZ * factorScaleX * px;
            b = currY + stepZ * factorScaleY * py;
            context.lineTo(a, b);
            a = currX;
            b = currY;
            context.lineTo(a, b);
            context.stroke();
        }
        iterations += 1;
        currX += basicPoints[i][0] * factorScaleX;
        currY += basicPoints[i][1] * factorScaleY;
        currentStep += 1;
    }
};

var resizeCanvas = function (containerName, canvasWrapper) {
    "use strict";
    var width = Math.min($(window).width(), $('#' + canvasWrapper).outerWidth());
    var height = Math.min($(window).height(), $('#' + canvasWrapper).outerHeight());
    centerX = width - 50;
    centerY = Math.round(height / 2) -25;
    var container = $('#' + containerName)[0];
    $(container).offset($('#' + canvasWrapper).offset());
    container.setAttribute('width', width);
    container.setAttribute('height', height);
};

$(document).ready(function () {
    "use strict";
    var stepZ = minWide;
    var incrementDelta = wideDelta;

    setInterval(function () {
        resizeCanvas("myCanvas", "mainframecontent");
        var currX1 = centerX;
        var currY1 = centerY;
        var w = 0;
        while (w < basicPointsHalfLen) {
            currX1 += basicPoints[w][0] * factorScaleX * stepZ;
            currY1 += basicPoints[w][1] * factorScaleY * stepZ;
            drawZircle(currX1, currY1, "myCanvas", stepZ, basicPoints[w + 1][0], basicPoints[w + 1][1], w);
            w += 1;
        }
        while (w < basicPointsLen - 1) {
            currX1 += basicPoints[w][0] * factorScaleX * stepZ;
            currY1 += basicPoints[w][1] * factorScaleY * stepZ;
            drawZircle(currX1, currY1, "myCanvas", stepZ, basicPoints[w + 1][0], basicPoints[w + 1][1], w + 1);
            w += 1;
        }
        stepZ += incrementDelta;
        if (stepZ > maxWide || stepZ <= minWide) {
            incrementDelta = -incrementDelta;
        }
    }, 1000 / 24);

    $(window).resize(function () {
        setTimeout(function () {
            resizeCanvas("myCanvas", "mainframecontent");
        }, 250);
    });
});
