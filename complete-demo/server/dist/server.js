"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;

var _global = _interopRequireDefault(require("./global"));

function _default() {
  var net = require("net");

  var port = 8000;
  var hostname = "127.0.0.1";
  var server = new net.createServer(function (connection) {
    connection.on("data", function (data) {
      var result = data.toString();
      var chars = result.split("-");
      _global["default"].flag = chars[1] === "i" ? true : false;
      console.log(result, _global["default"].flag);
    });
    connection.on("end", function () {
      console.log("close connection");
    });
  });
  server.listen(port, hostname, function () {
    console.log("The server is running on\uFF1Ahttp://".concat(hostname, ":").concat(port));
  });
}