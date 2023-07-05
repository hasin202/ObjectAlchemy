require("dotenv").config();
const { Configuration, OpenAIApi } = require("openai");
const express = require("express");
const cors = require("cors");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.get("/", async (req, res) => {
  res.send(
    "Oops. Looks like you sent a GET request. Please try again with a POST request instead."
  );
});

app.post("/", async (req, res) => {
  const { object, number_of_objects, extra_info } = req.body;
  obj = JSON.stringify(object);

  try {
    const { data } = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `As a skilled data creator, your task is to generate a valid array of n JSON objects
          based on a given example schema. The value of each property in the input object should
          be relevant to its name. For instance, if a property is named "name," you could assign
          the value 'bob roberts,' and if another property is called "ID," it could be assigned the value
          '34532,' and so on. Please ensure that you only include the JSON values in your output and no
          additional strings or information. If a property is an object with multiple child properties,
          generate the same number of child properties accordingly.`,
        },
        {
          role: "user",
          content: `object: ${obj} number of objects: ${number_of_objects} extra context: ${extra_info}. 
          Note: Don't change any of the property names passed in with the schema`,
        },
      ],
    });
    //.match is used to ensure that only JSON is returned as in the response the JSON is always between [....]
    const json = data.choices[0].message.content.match(/\[.*\]/s);
    console.log(prompt);
    res.send(JSON.parse(json));
  } catch (error) {
    res.status(400).send("Something went wrong. Please try again");
  }
});

app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});
