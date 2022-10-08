import { ResizeImage } from "../Routes/api/utilities/imageprocessing";
import fs from "fs";
import sharp from "sharp";
import supertest from "supertest";

import app from "../index";

const request = supertest(app);
describe("endpoint responses suite", () => {
  it("gets the api endpoint", async () => {
    const response = await request.get(
      "/api/image?filename=santamonica&width=256&height=256"
    );
    expect(response.status).toBe(200);
  });

  it("returns an image", async () => {
    const response = await request.get(
      "/api/image?filename=santamonica&width=256&height=256"
    );
    expect(response.type).toBe("image/jpeg");
  });
});

describe("image processing suite", (): void => {
  const FILE_NAME = "icelandwaterfall";
  const width = 265;
  const height = 265;

  beforeAll(() => {
    if (
      fs.existsSync(
        __dirname +
          "/../../" +
          "assets/thumb/" +
          FILE_NAME +
          "_" +
          width +
          "_" +
          height +
          ".jpg"
      )
    )
      fs.unlinkSync(
        __dirname +
          "/../../assets/thumb/" +
          FILE_NAME +
          "_" +
          width +
          "_" +
          height +
          ".jpg"
      );
  });

  it("should create a new file for the resized image", async (): Promise<void> => {
    await ResizeImage(
      sharp(__dirname + "/../../" + "assets/full/" + FILE_NAME + ".jpg"),
      width,
      height,
      __dirname +
        "/../../assets/thumb/" +
        FILE_NAME +
        "_" +
        width +
        "_" +
        height +
        ".jpg"
    );
    expect(
      fs.existsSync(
        __dirname +
          "/../../" +
          "assets/thumb/" +
          FILE_NAME +
          "_" +
          width +
          "_" +
          height +
          ".jpg"
      )
    ).toBe(true);
  });
});
