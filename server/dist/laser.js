"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _core = require("@laser-dac/core");

var _simulator = require("@laser-dac/simulator");

var _etherDream = require("@laser-dac/ether-dream");

var _draw = require("@laser-dac/draw");

var _global = _interopRequireDefault(require("./global"));

function _default() {
  return _ref.apply(this, arguments);
}

function _ref() {
  _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
    var dac, scene, step;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            step = function _step() {
              var boxWidth = 0.6;
              var boxHeight = 0.2;
              var boxX = (1 - boxWidth) / 2;
              var boxY = (1 - boxHeight) / 2;
              var count = 10;

              if (_global["default"].flag) {
                drawRect(); // drawLines();
              } else {
                // drawCirlce();
                drawLines(); //   drawLines();
                //   drawDoor();
              }

              function drawDoor() {
                var rect = new _draw.Rect({
                  width: 0.05,
                  height: 1,
                  color: [0, 1, 1],
                  x: 0.5,
                  y: 0
                });
                scene.add(rect);
              }

              function drawLines() {
                for (var i = boxX; i <= boxX + boxWidth; i += boxWidth / count) {
                  var line = new _draw.Line({
                    from: {
                      x: i,
                      y: boxY
                    },
                    to: {
                      x: i,
                      y: boxY + boxHeight
                    },
                    color: [1, 1, 0],
                    blankBefore: true,
                    blankAfter: true
                  });
                  scene.add(line);
                }
              }

              function drawRect() {
                var rect = new _draw.Rect({
                  width: boxWidth,
                  height: boxHeight,
                  color: [0, 1, 1],
                  x: boxX,
                  y: boxY
                });
                scene.add(rect);
              }

              function drawCirlce() {
                var radius = 0.2;
                var circle = new _draw.Circle({
                  x: 0.4,
                  y: 0.4,
                  radius: radius,
                  color: [0, 1, 1]
                });
                scene.add(circle);
              }
            };

            dac = new _core.DAC();
            dac.use(new _etherDream.EtherDream());
            _context.next = 5;
            return dac.start();

          case 5:
            scene = new _draw.Scene({
              resolution: 500
            });
            scene.start(step);
            dac.stream(scene);

          case 8:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _ref.apply(this, arguments);
}