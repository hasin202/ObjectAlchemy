const express = require("express");
const cors = require("cors");
const generateJSONObjects = require("./dataCreator");
const generateImgPrompt = require("./imgPrompt");
const generateImgs = require("./imgGeneration");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.get("/", (req, res) => {
  res.send(
    "Oops. Looks like you sent a GET request. Please try again with a POST request instead."
  );
});

app.post("/", async (req, res) => {
  const { object, number_of_objects, extra_info } = req.body;

  if (!object || !number_of_objects)
    res.status(400).send({
      error:
        "Please make sure you pass in both the object schema, and the number of objects.",
    });
  else if (number_of_objects > 8)
    res
      .status(400)
      .send({ error: "Please make sure number of objects is less than 8." });
  else {
    try {
      const jsonObjects = await generateJSONObjects(
        object,
        number_of_objects,
        extra_info
      );
      res.json(jsonObjects);
    } catch (error) {
      if (error.code) {
        res.status(error.code).json({
          error: {
            ...error,
            help: "https://platform.openai.com/docs/guides/error-codes/api-errors",
            bad_req_help:
              "A code of 400 suggests that one of the prompts is too long. Please either reduce the size of the object or try again",
          },
        });
      } else {
        res.status(400).json({
          error:
            "Something went wrong on our end. Try again, if this message keeps appearing then please wait and try again later",
        });
      }
    }
  }
});

app.post("/img", async (req, res) => {
  const { object, number_of_objects, extra_info, img_info } = req.body;

  if (!object || !number_of_objects)
    res.status(400).send({
      error:
        "Please make sure you pass in both the object schema, and the number of objects.",
    });
  else if (number_of_objects > 8)
    res
      .status(400)
      .send({ error: "Please make sure number of objects is less than 8." });
  else {
    try {
      console.log("1");
      const jsonObjects = await generateJSONObjects(
        object,
        number_of_objects,
        extra_info
      );
      console.log("2");
      const imgPrompts = await generateImgPrompt(jsonObjects, img_info);
      console.log(imgPrompts);
      const list = await generateImgs(imgPrompts, img_info);
      console.log("4");

      jsonObjects.map((obj, i) => {
        for (let key in obj) {
          if (obj[key] === "Image") {
            obj[key] = list[i];
            return obj;
          }
        }
      });
      res.send({ data: jsonObjects });
    } catch (error) {
      if (error.code) {
        res.status(error.code).json({
          error: {
            ...error,
            help: "https://platform.openai.com/docs/guides/error-codes/api-errors",
            bad_req_help:
              "A code of 400 suggests that one of the prompts is too long. Please either reduce the size of the object or try again",
          },
        });
      } else {
        res.status(400).json({
          error:
            "Something went wrong on our end. Try again, if this message keeps appearing then please wait and try again later",
        });
      }
    }
  }
});

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});

module.exports = app;
