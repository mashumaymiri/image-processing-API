import sharp from "sharp";

/**
 * @description Resizes the given image, then saves the image to the given output.
 * @middleware
 * @param {sharp.Sharp} Image - The image.
 * @param {number} width - The width of the image.
 * @param {number} height - The height of the image.
 * @param {string} Output - The route of the output file.
 */
function ResizeImage(
  Image: sharp.Sharp,
  width: number,
  height: number,
  Output: string
): Promise<boolean> {
  return Image.resize(width, height)
    .toFile(Output)
    .then(() => {
      return true;
    })
    .catch((err) => {
      console.log(err);
      return false;
    });
}

export { ResizeImage };
