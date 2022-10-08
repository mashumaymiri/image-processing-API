import express from "express";
import sharp from "sharp";
import fs from "fs";

const image = express.Router();

/* 
    sendfile: http://expressjs.com/en/5x/api.html#res.sendfile
    sharp: https://www.npmjs.com/package/sharp
*/
image.get("/", (req, res) => {
  const filename: string = req.query.filename as unknown as string;
  let width: number | undefined = parseInt(req.query.width as string);
  let height: number | undefined = parseInt(req.query.height as string);

  if (
    !fs.existsSync(
      __dirname + "/../../../" + "assets/full/" + filename + ".jpg"
    )
  )
    res.send("Image not found!");
  else if (req.query.width == undefined && req.query.height == undefined)
    res.sendFile("assets/full/" + filename + ".jpg", {
      root: __dirname + "/../../../",
    });
  else {
    const Image = sharp(
      __dirname + "/../../../" + "assets/full/" + filename + ".jpg"
    );
    Image.metadata()
      .then((metadata) => {
        // if the request contains undefined height or weight, assign the default values for them
        if (req.query.width == undefined) width = metadata.width;
        if (req.query.height == undefined) height = metadata.height;
      })
      .then(() => {
        if (
          fs.existsSync(
            __dirname + "/../../../" + "assets/thumb/" + filename + "_thumb.jpg"
          )
        ) {
          // check if the file exists using fs
          const thumbImage = sharp(
            __dirname + "/../../../" + "assets/thumb/" + filename + "_thumb.jpg"
          ); // compare the file width and height to check if the thumb file has the same properties.
          thumbImage.metadata().then((metadata) => {
            if (width == metadata.width && height == metadata.height) {
              res.sendFile("assets/thumb/" + filename + "_thumb.jpg", {
                root: __dirname + "/../../../",
              });
            } else {
              // sharp(__dirname+ "/../../../" + "assets/full/"+filename+".jpg")
              Image.resize(width, height)
                .toFile(
                  __dirname +
                    "/../../../" +
                    "assets/thumb/" +
                    filename +
                    "_thumb.jpg"
                )
                .then(() => {
                  res.sendFile("assets/thumb/" + filename + "_thumb.jpg", {
                    root: __dirname + "/../../../",
                  });
                })
                .catch((err) => {
                  console.log(err);
                });
            }
          });
        } else {
          // sharp(__dirname+ "/../../../" + "assets/full/"+filename+".jpg")
          Image.resize(width, height)
            .toFile(
              __dirname +
                "/../../../" +
                "assets/thumb/" +
                filename +
                "_thumb.jpg"
            )
            .then(() => {
              res.sendFile("assets/thumb/" + filename + "_thumb.jpg", {
                root: __dirname + "/../../../",
              });
            })
            .catch((err) => {
              console.log(err);
            });
        }
      });
  }
});

export default image;
