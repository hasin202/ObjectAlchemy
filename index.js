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
      id: "b64db70b-0179-4f79-9f8a-8a6c0a0f80c5",
      item_image: "Image",
      date: "2023-09-10",
      time: "14:30:00",
      inCart: true,
      itemName: "Shirt",
      price: 19.99,
      quantity: 1,
      tags: ["clothing", "fashion"],
    },
    {
      id: "3e72e7f7-8a4d-4bed-a75b-2eb3e57917b8",
      item_image: "Image",
      date: "2023-09-11",
      time: "09:45:00",
      inCart: true,
      itemName: "Jeans",
      price: 49.99,
      quantity: 1,
      tags: ["clothing", "denim"],
    },
    {
      id: "7dc69756-7c0e-4a3e-bb6a-4b45b4c2107d",
      item_image: "Image",
      date: "2023-09-12",
      time: "16:15:00",
      inCart: true,
      itemName: "Shoes",
      price: 79.99,
      quantity: 1,
      tags: ["footwear", "fashion"],
    },
    {
      id: "d483086c-3049-43bb-95f9-e5ede51a45b7",
      item_image: "Image",
      date: "2023-09-13",
      time: "12:00:00",
      inCart: true,
      itemName: "Hat",
      price: 29.99,
      quantity: 1,
      tags: ["accessory", "headwear"],
    },
    {
      id: "902a7a42-5ce0-4df1-b259-63b13a1178b8",
      item_image: "Image",
      date: "2023-09-14",
      time: "18:30:00",
      inCart: true,
      itemName: "Socks",
      price: 9.99,
      quantity: 1,
      tags: ["clothing", "footwear"],
    },
  ];

  const list = Promise.all(
    objs.map(async function (e) {
      try {
        const response = await openai.createImage({
          prompt: `Given the following object generate a relevant image for the property that has the value "Image".
                  Take special note of the properties and their values in the provided object to help with defining features.
                  The image should be of the product described in the object on a plain colored background. Sigma 85 mm f/1.4
          ${JSON.stringify(e)}`,
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
  res.json(all);
});

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});
