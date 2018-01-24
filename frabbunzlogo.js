/*global window, document */
var bx = 8;
var by = 7;
var xb = 0;
var yb = 0;
var centerX = 0;
var centerY = 0;
var zDelta = [[0, 0], [0, 2], [-1, 2], [-2, 2], [-2, 1], [-2, 0], [-2, -1], [-2, -2], [-1, -2], [0, -2], [1, -2], [2, -2], [2, -1], [2, 0], [2, 1], [2, 2], [1, 2]];

/*each zircle has a b factor and an [x0,y0] starting poit */
var drawZircle = function (x0, y0, containerName, stepZ, px, py, k1) {
    "use strict";
    var c = $('#' + containerName)[0];
    var ctx = c.getContext("2d");
    ctx.strokeStyle = "rgba(109,109,109,0.8)";
    ctx.beginPath();
    var currX = x0;
    var currY = y0;
    var gullo = 0;
    var i;
    var a;
    var b;
    var k2 = 1 + Math.round(zDelta.length / 2);
    while (k2 < (k1 + zDelta.length + 1)) {
        i = k2 % zDelta.length;
        if (gullo >= k1) {
            ctx.beginPath();
            ctx.strokeStyle = "rgba(109,109,109,0.8)";
            a = currX;
            b = currY;
            ctx.moveTo(a, b);
            a = currX + zDelta[i][0] * bx;
            b = currY + zDelta[i][1] * by;
            ctx.lineTo(a, b);
            a = currX + zDelta[i][0] * bx + stepZ * bx * px;
            b = currY + zDelta[i][1] * by + stepZ * by * py;
            ctx.lineTo(a, b);
            a = currX + stepZ * bx * px;
            b = currY + stepZ * by * py;
            ctx.lineTo(a, b);
            a = currX;
            b = currY;
            ctx.lineTo(a, b);
            ctx.stroke();
        }
        gullo += 1;
        currX += zDelta[i][0] * bx;
        currY += zDelta[i][1] * by;
        k2 += 1;
    }
};

var resizeCanvas = function (containerName, canvasWrapper) {
    "use strict";
    var width = Math.max($(window).width(), $('#' + canvasWrapper).outerWidth()) - 20;
    var height = Math.max($(window).height(), $('#' + canvasWrapper).outerHeight()) - 67;
    centerX = Math.round(width / 2);
    centerY = Math.round(height / 2);
    var c = $('#' + containerName)[0];
    $(c).offset($('#' + canvasWrapper).offset());
    c.setAttribute('width', width);
    c.setAttribute('height', height);
};

$(document).ready(function () {
    "use strict";
    var stepZ = 1;
    var extra = 0.1;

    setInterval(function () {
        resizeCanvas("myCanvas", "mainframecontent");
        var currX1 = centerX;
        var currY1 = centerY;
        var w = 0;
        while (w < Math.round(zDelta.length / 2)) {
            currX1 += zDelta[w][0] * bx * stepZ;
            currY1 += zDelta[w][1] * by * stepZ;
            drawZircle(currX1, currY1, "myCanvas", stepZ, zDelta[w + 1][0], zDelta[w + 1][1], w);
            w += 1;
        }
        while (w < zDelta.length - 1) {
            currX1 += zDelta[w][0] * bx * stepZ;
            currY1 += zDelta[w][1] * by * stepZ;
            drawZircle(currX1, currY1, "myCanvas", stepZ, zDelta[w + 1][0], zDelta[w + 1][1], w + 1);
            w += 1;
        }
        stepZ += extra;
        if (stepZ > 5) {
            extra = -0.1;
        }
        if (stepZ <= 1) {
            extra = 0.1;
        }
    }, 1000 / 24);

    $(window).resize(function () {
        setTimeout(function () {
            resizeCanvas("myCanvas", "mainframecontent");
        }, 250);
    });
});
