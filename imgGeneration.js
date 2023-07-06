const openai = require("./openai-api/openai.js");

const generateImgs = async (arr) => {
  const list = await Promise.all(
    arr.map(async function (e) {
      try {
        const response = await openai.createImage({
          prompt: e,
          n: 1,
          size: "1024x1024",
        });

        image_url = response.data.data[0].url;
        return image_url;
      } catch (error) {
        console.log(error);
        throw Error(
          "Something went wrong in generating the images. Please try again."
        );
      }
    })
  );
  return list;
};

module.exports = generateImgs;
