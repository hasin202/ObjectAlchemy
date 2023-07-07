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

  try {
    const jsonObjects = await generateJSONObjects(
      object,
      number_of_objects,
      extra_info
    );
    res.json(jsonObjects);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.post("/img", async (req, res) => {
  const { object, number_of_objects, extra_info } = req.body;
  let jsonObjects, imgPrompts, list;

  // try {
  //   jsonObjects = await generateJSONObjects(
  //     object,
  //     number_of_objects,
  //     extra_info
  //   );
  // } catch (error) {
  //   res.status(400).send(error.message);
  // }

  // console.log(jsonObjects);
  // try {
  //   imgPrompts = await generateImgPrompt(jsonObjects);
  // } catch (error) {
  //   res.status(400).send(error.message);
  // }

  // console.log(imgPrompts);

  // try {
  //   list = await generateImgs(imgPrompts);
  // } catch (error) {
  //   res.status(400).send(error.message);
  // }

  try {
    console.log("1");
    const jsonObjects = await generateJSONObjects(
      object,
      number_of_objects,
      extra_info
    );
    console.log("2");
    const imgPrompts = await generateImgPrompt(jsonObjects);
    console.log("3");
    const list = await generateImgs(imgPrompts);
    console.log("4");

    jsonObjects.map((obj, i) => {
      for (let key in obj) {
        if (obj[key] === "Image") {
          obj[key] = list[i];
          return obj;
        }
      }
    });
    res.send(jsonObjects);
  } catch (error) {
    res.status(400).send(error.message);
  }

  // res.send(await list);
});

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});
