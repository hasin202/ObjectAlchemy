const express = require("express");
const cors = require("cors");
const generateJSONObjects = require("./dataCreator");

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

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});
