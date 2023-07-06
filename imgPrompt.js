const openai = require("./openai-api/openai.js");
const imgPromptMessage = require("./prompt-messages/imgPrompt");

const generateImgPrompt = async (objects) => {
  const imgPrompts = await Promise.all(
    objects.map(async function (e) {
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
  return imgPrompts;
};

module.exports = generateImgPrompt;
