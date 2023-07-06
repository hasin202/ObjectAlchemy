const imgPromptMessage = (object) => {
  return [
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
                    ${JSON.stringify(object)}
                    Using information that you deem relevant, from the object, for generating a detailed image give me a prompt that when given to DALLE should generate me
                    a relevant image`,
    },
  ];
};

module.exports = imgPromptMessage;
