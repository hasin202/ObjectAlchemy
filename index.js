const PORT = 3000;

const express = require("express");
const app = express();

//this essentially the same as the code in the file ../lect1/http.js but much simpler thanks to express
app.get("/", (req, res) => {
  res.end("bye");
});

app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});
