const express = require("express");
const cors = require("cors");
const generateJSONObjects = require("./dataCreator");
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
  const objs = [
    {
      appearance_img: "Image",
      name: "Superman",
      alias: "Clark Kent",
      superpowers: [
        "Super strength",
        "Flying",
        "Invulnerability",
        "Heat vision",
      ],
      origin: "Krypton",
      team_affiliation: "Justice League",
      appearance: {
        height: "Tall",
        weight: "Muscular",
        hair_color: "Black",
        eye_color: "Blue",
      },
      costume: {
        colors: ["Red", "Blue"],
        symbol: "S",
        design: "Cape",
      },
      arch_nemesis: "Lex Luthor",
    },
    {
      appearance_img: "Image",
      name: "Wonder Woman",
      alias: "Diana Prince",
      superpowers: [
        "Superhuman strength",
        "Lasso of Truth",
        "Flight",
        "Immortality",
      ],
      origin: "Themyscira",
      team_affiliation: "Justice League",
      appearance: {
        height: "Tall",
        weight: "Athletic",
        hair_color: "Black",
        eye_color: "Blue",
      },
      costume: {
        colors: ["Red", "Gold"],
        symbol: "W",
        design: "Tiara",
      },
      arch_nemesis: "Cheetah",
    },
    {
      appearance_img: "Image",
      name: "Batman",
      alias: "Bruce Wayne",
      superpowers: ["Intelligence", "Combat skills", "Wealth", "Gadgets"],
      origin: "Gotham City",
      team_affiliation: "Justice League",
      appearance: {
        height: "Tall",
        weight: "Muscular",
        hair_color: "Black",
        eye_color: "Blue",
      },
      costume: {
        colors: ["Black", "Yellow"],
        symbol: "Bat",
        design: "Cape",
      },
      arch_nemesis: "Joker",
    },
  ];

  const imgPrompts = Promise.all(
    objs.map(async function (e) {
      try {
        const { data } = await openai.createChatCompletion({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: `You are an expert prompt generator for DALLE, an image generation API. Given a JSON object you
                        can construct relevant images. I dont want any extra information at all, all I want is the prompt.
                        For example, I don't need to know that the prompt might generate an image that doesn't fully meet
                        the description`,
            },
            {
              role: "user",
              content: `Given the following object
                        ${JSON.stringify(e)}
                        Using information that you deem relevant, from the object, for generating a detailed image give me a prompt that when given to DALLE should generate me
                        a relevant image`,
            },
          ],
        });
        return data.choices[0].message.content;
      } catch (error) {
        console.log(error);
      }
    })
  );

  const allImgPrompts = await imgPrompts;

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
