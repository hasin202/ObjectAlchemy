const openai = require("./openai-api/openai.js");
const dataCreatorMessage = require("./prompt-messages/dataCreator.js");

async function generateJSONObjects(object, numberOfObjects, extraInfo) {
  try {
    const { data } = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: dataCreatorMessage(object, numberOfObjects, extraInfo),
    });

    // Extract the JSON array from the response
    const json = data.choices[0].message.content;
    return JSON.parse(json);
  } catch (error) {
    let msg = "";
    if (error.response.data.error.code === "insufficient_quota")
      msg =
        "Oops. Looks like the openai API limit has been hit. Please try again later";
    else
      msg = "Something went wrong in generating the objects. Please try again.";
    throw Error(msg);
  }
}

module.exports = generateJSONObjects;
