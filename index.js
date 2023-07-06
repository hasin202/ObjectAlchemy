const express = require("express");
const cors = require("cors");
const generateJSONObjects = require("./dataCreator");
const imgPromptMessage = require("./prompt-messages/imgPrompt");

const openai = require("./openai-api/openai.js");

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

  const imgPrompts = Promise.all(
    jsonObjects.map(async function (e) {
      try {
        const { data } = await openai.createChatCompletion({
          model: "gpt-3.5-turbo",
          messages: imgPromptMessage(e),
        });
        return data.choices[0].message.content;
      } catch (error) {
        console.log(error);
      }
    })
  );

  const allImgPrompts = await imgPrompts;
  console.log(allImgPrompts);

  const list = Promise.all(
    allImgPrompts.map(async function (e) {
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

  const all = await list;
  res.send(all);
});

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});
