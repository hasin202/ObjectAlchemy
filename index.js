const express = require("express");
const cors = require("cors");
const openai = require("./openai-api/openai");
const generateJSONObjects = require("./dataCreator");
const generateImgPrompt = require("./imgPrompt");

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

  const jsonObjects = await generateJSONObjects(
    object,
    number_of_objects,
    extra_info
  );

  console.log(jsonObjects);

  const imgPrompts = await generateImgPrompt(jsonObjects);

  console.log(imgPrompts);

  const list = Promise.all(
    imgPrompts.map(async function (e) {
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
      }
    })
  );

  res.send(await list);
});

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});
