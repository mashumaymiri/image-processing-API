import express from "express";
import {
  CheckFileName,
  CheckWidthHeight,
  CheckFileExists,
} from "./utilities/checks";

const image = express.Router();

/* 
    sendfile: http://expressjs.com/en/5x/api.html#res.sendfile
    sharp: https://www.npmjs.com/package/sharp
*/
image.get("/", [CheckFileName, CheckWidthHeight, CheckFileExists]);

export default image;
