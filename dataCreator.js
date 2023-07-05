const openai = require("./openai-api/openai.js");

async function generateJSONObjects(object, numberOfObjects, extraInfo) {
  const obj = JSON.stringify(object);

  try {
    const { data } = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `As a skilled data creator, your task is to generate a valid array of n JSON objects based 
                    on a given example schema. The value of each property in the input object should be relevant to its
                    name. For instance, if a property is named "name," you could assign the value 'bob roberts,' and if
                    another property is called "ID," it could be assigned the value '34532,' and so on. Please ensure 
                    that you only include the JSON values in your output and no additional strings or information. If a
                    property is an object with multiple child properties, generate the same number of child properties
                    accordingly.`,
        },
        {
          role: "user",
          content: `object: ${obj} number of objects: ${numberOfObjects} extra context: ${extraInfo}. Note: Don't change any of the property names passed in with the schema`,
        },
      ],
    });

    // Extract the JSON array from the response
    const json = data.choices[0].message.content.match(/\[.*\]/s);
    return JSON.parse(json);
  } catch (error) {
    throw new Error("Something went wrong. Please try again.");
  }
}

module.exports = generateJSONObjects;
