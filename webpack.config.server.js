"use strict";

var webpack = require("./webpack.config.base");

webpack = Object.assign(webpack, {
    target: "node",
});

module.exports = webpack;