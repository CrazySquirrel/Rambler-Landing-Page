"use strict";

if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = "production";
}

const NODE_ENV = process.env.NODE_ENV || "production";

const StringReplacePlugin = require("string-replace-webpack-plugin");

const WebpackNotifierPlugin = require("webpack-notifier");

const path = require("path");

const webpack = require("webpack");

const fs = require("fs");

const crypto = require("crypto");

const packagenpm = require("./package.json");

/**
 * Plugins list
 */
let arrPlugins = [
  new WebpackNotifierPlugin(),
  new StringReplacePlugin()
];
/**
 * Add additional plugins
 */
arrPlugins.push(
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify(NODE_ENV)
      }
    })
);
/**
 * Compress js
 */
arrPlugins.push(
    new webpack.optimize.UglifyJsPlugin({
      minimize: true,
      sourceMap: false,
      output: {
        comments: false
      },
      compressor: {
        warnings: false
      }
    })
);

const REPLACER = {
  replacements: [
    {
      pattern: /#HASH#/gi,
      replacement: function (string, pattern1) {
        return crypto.createHash("md5").update(
            (new Date()).getTime().toString()).digest("hex");
      }
    },
    {
      pattern: /#PACKAGE_NAME#/gi,
      replacement: function (string, pattern1) {
        return packagenpm.name;
      }
    },
    {
      pattern: /#PACKAGE_VERSION#/gi,
      replacement: function (string, pattern1) {
        return packagenpm.version;
      }
    }
  ]
};

let settings;

if (fs.existsSync("./server.config.json")) {
  settings = require("./server.config.json");
} else {
  settings = require("./server.config.example.json");
}

for (let setting in settings.apps[0].env) {
  if (settings.apps[0].env.hasOwnProperty(setting)) {
    REPLACER.replacements.push({
      pattern: new RegExp("#(" + setting + ")#", "ig"),
      replacement: function (string, pattern1) {
        return settings.apps[0].env[pattern1];
      }
    })
  }
}

module.exports = {
  output: {
    pathinfo: true,
    path: __dirname,
    sourceMapFilename: "[name].map.js",
    filename: "[name].js",
  },
  devtool: (NODE_ENV === "development" ? "inline-source-map" : (NODE_ENV
  === "testing" ? "inline-source-map" : "source-map")),
  plugins: arrPlugins,
  resolve: {
    extensions: ["", ".webpack.js", ".web.js", ".ts", ".tsx", ".js"],
    alias: {
      "CSDebug": path.join(__dirname, "node_modules")
      + "/CSDebug/lib/CSDebug.ts",
      "CSLogger": path.join(__dirname, "node_modules")
      + "/CSLogger/lib/CSLogger.ts",
      "AnimationFrame": path.join(__dirname, "node_modules")
      + "/AnimationFrame/lib/AnimationFrame.ts",
      "Utils": path.join(__dirname, "node_modules") + "/Utils/lib/Utils.ts",
    }
  },
  resolveLoader: {
    root: path.join(__dirname, "node_modules"),
    extensions: ["", ".js", ".ts", ".jsx", ".tsx"]
  },
  module: {
    loaders: [
      {
        test: /\.ts(x?)$/,
        loaders: [
          StringReplacePlugin.replace(REPLACER),
          "babel-loader?presets[]=babel-preset-es2015-loose",
          "ts-loader"
        ]
      },
      {
        test: /\.json$/,
        loaders: [
          "json-loader",
          StringReplacePlugin.replace(REPLACER),
        ]
      },
      {
        test: /\.md$/,
        loader: "null"
      }
    ]
  }
};