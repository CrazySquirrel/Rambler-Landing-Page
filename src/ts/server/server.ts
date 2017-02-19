"use strict";

declare let require:any;
declare let process:any;
declare let global:any;

const FS = require("fs");
const SPDY = require("spdy");
const HTTP = require("http");
const HTTPS = require("https");
const EXPRESS = require("express");
const COOKIE_PARSER = require("cookie-parser");
const BODY_PARSER = require("body-parser");
const COMPRESSION = require("compression");
const MULTER = require("multer");
const RAVEN = require("raven");

RAVEN.config(global["process"]["env"]["SENTRY_NODE"]).install();

const NODEMAILER = require("nodemailer");

const STORAGE = MULTER.diskStorage({
  destination: (req, file, callback) => {
    callback(null, './cv');
  },
  filename: (req, file, callback) => {
    callback(null, file.fieldname + "-" + Date.now() + "." + file.originalname.split(".").pop());
  },
});

const UPLOAD = MULTER({storage: STORAGE}).single("cv");

const OPTIONS = {
  key: FS.readFileSync("ssl/key.pem"),
  cert: FS.readFileSync("ssl/cert.pem")
};

const MAX_AGE = 1000 * 60 * 60 * 24 * 365;

const APP = EXPRESS();
/**
 * Error handler
 */
APP.use(RAVEN.requestHandler());
/**
 * Compressing
 */
APP.use(COMPRESSION());
/**
 * Cookie processor
 */
APP.use(COOKIE_PARSER());
/**
 * Parsers for POST data
 */
APP.use(BODY_PARSER.json());
APP.use(BODY_PARSER.urlencoded({extended: false}));
/**
 * Point static path to dist
 */
APP.use(EXPRESS.static(global["process"]["env"]["STATIC_FOLDER"], {
  etag: true,
  maxAge: MAX_AGE
}));
/**
 * Hendle post cv upload
 */
APP.post("/", (req, res) => {
  UPLOAD(req, res, (err)=> {
    if (err) {
      res.end(JSON.stringify({
        status: "error",
        error: err,
      }));
    } else {
      const MAIL_TRANSPORT = NODEMAILER.createTransport({
        direct: true,
        host: global["process"]["env"]["EMAIL_HOST"],
        port: global["process"]["env"]["EMAIL_PORT"],
        auth: {
          user: global["process"]["env"]["EMAIL_LOGIN"],
          pass: global["process"]["env"]["EMAIL_PASSWORD"],
        },
        secure: true
      });

      const MAIL_OPTIONS = {
        from: global["process"]["env"]["EMAIL_FROM"],
        to: global["process"]["env"]["EMAIL_TO"],
        subject: "New CV from CrazySquirrel.ru for Rambler",
        attachments: [
          {
            filename: req.file.originalname,
            path: global["process"]["env"]["CV_FOLDER"] + req.file.path,
            contentType: req.file.mimetype,
            cid: req.file.filename,
          }
        ]
      };

      MAIL_TRANSPORT.sendMail(MAIL_OPTIONS, (error, info) => {
        if (error) {
          res.end(JSON.stringify({
            status: "error",
            error: err,
          }));
        } else {
          res.end(JSON.stringify({
            status: "ok",
            file: req.file,
          }));
        }
      });
    }
  });
});
/**
 * Catch all other routes and return the index file
 */
APP.get("*", (req, res) => {
  res.status(404).send("Sorry can not find that!");
});
/**
 * Get port from environment and store in Express.
 */
APP.set("port", 8892);

SPDY.createServer(OPTIONS, APP).listen(8892);

HTTP.createServer(APP).listen(8890);
HTTPS.createServer(OPTIONS, APP).listen(8891);