import express from "express";
import sharp from "sharp";
import fs from "fs";

import { ResizeImage } from "./imageprocessing";

/**
 * @description Checks if the file exists using filename
 * @middleware
 * @param {string} FILE_NAME - The name of the file
 */
function CheckFileName(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): void {
  const FILE_NAME: string = req.query["filename"] as unknown as string;
  if (
    !fs.existsSync(
      __dirname + "/../../../../" + "assets/full/" + FILE_NAME + ".jpg"
    )
  )
    res.status(400).send("Image does not exists");
  else next();
}

/**
 * @description Checks if the request has valid width and height. Sends a full image if the width and height are not provided.
 * @middleware
 * @param {number} width - The width of the image
 * @param {number} height - The height of the image
 */
function CheckWidthHeight(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): void {
  const FILE_NAME: string = req.query["filename"] as unknown as string;

  if (
    isNaN(parseInt(req.query["width"] as string)) ||
    isNaN(parseInt(req.query["height"] as string))
  )
    // if parsing the strings returns NaN
    res.status(400).send("Invalid parameters!");
  else if (req.query["width"] == undefined && req.query["height"] == undefined)
    res.sendFile("assets/full/" + FILE_NAME + ".jpg", {
      root: __dirname + "/../../../../",
    });
  else next();
}

/**
 * @description Checks if the files exists using File name.
 * @middleware
 * @param {string} FILE_NAME - The name of the file
 */
function CheckFileExists(req: express.Request, res: express.Response): void {
  const FILE_NAME: string = req.query["filename"] as unknown as string;
  const FULL_IMAGE = sharp(
    __dirname + "/../../../../" + "assets/full/" + FILE_NAME + ".jpg"
  );
  let width: number = parseInt(req.query["width"] as string);
  let height: number = parseInt(req.query["height"] as string);

  FULL_IMAGE.metadata()
    .then((metadata): void => {
      // if the request contains undefined height or weight, assign the default values for them.
      if (req.query["width"] == undefined) width = metadata.width as number;
      if (req.query["height"] == undefined) height = metadata.height as number;
    })
    .then((): void => {
      if (
        fs.existsSync(
          __dirname +
            "/../../../../" +
            "assets/thumb/" +
            FILE_NAME +
            "_" +
            width +
            "_" +
            height +
            ".jpg"
        )
      ) {
        res.sendFile(
          "assets/thumb/" + FILE_NAME + "_" + width + "_" + height + ".jpg",
          {
            root: __dirname + "/../../../../",
          }
        );
      } else {
        ResizeImage(
          FULL_IMAGE,
          width,
          height,
          __dirname +
            "/../../../../" +
            "assets/thumb/" +
            FILE_NAME +
            "_" +
            width +
            "_" +
            height +
            ".jpg"
        ).then((canSendFile: boolean) => {
          if (canSendFile)
            res.sendFile(
              "assets/thumb/" + FILE_NAME + "_" + width + "_" + height + ".jpg",
              {
                root: __dirname + "/../../../../",
              }
            );
          else res.status(500).send("Failed to process");
        });
      }
    });
}

export { CheckFileName, CheckWidthHeight, CheckFileExists };
