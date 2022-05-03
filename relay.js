const port = 8765;
const express = require("express");
const Gun = require("gun");
const app = express();
//app.use(Gun.serve);

const server = app.listen(port);

Gun({ file: "data", web: server });

console.log("Server started on port " + port + " with /gun");
