require("dotenv").config();
const { Configuration, OpenAIApi } = require("openai");
const express = require("express");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

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
          content: `You are an expert data creator. Given an example schema you return a valid array of n just JSON objects 
            (where n is defined by the user). For each property of the passed in object give it a relavent value. 
            For example, if a property is name its value could be 'bob roberts' and if there is another property called 
            ID it could be given the value '34532' etc. Only return the JSON value and no other strings or information`,
        },
        {
          role: "user",
          content: `object: ${obj} number of objects: ${number_of_objects} extra context: ${extra_info}`,
        },
      ],
    });
    const response = data.choices[0].message.content;
    //Sometimes some of the responses still include other info and I cant figure out why so this ensures that the response is JSON
    const startIndex = response.indexOf("[");
    const endIndex = response.lastIndexOf("]") + 1;
    const json = response.slice(startIndex, endIndex);

    res.send(JSON.parse(json));
  } catch (error) {
    res.status(400).send("Something went wrong. Please try again");
  }
});

app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});
