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
                    accordingly. Wherver the value for a property is "Image" dont make any changes, just keep the value
                    as "Image". For example, given the following
                    input object:
  
                    {
                      "id": "uuid",
                      "item_image":"Image",
                      "date": "calendar date",
                      "time": "time of day",
                      "inCart": true,
                      "itemName": "string",
                      "price": 0.0,
                      "quantity": 0,
                      "tags": [
                         "string",
                         "string",
                         "string"
                      ]
                    },
                    "number_of_objects":"5",
                    "extra_info":"Each object is an item in an online shopping cart"
                   }
                  
                   You would return something like: 
                   {
                    id: c182b196-ff4e-436b-8e9b-4a97923003f9,
                    "item_image":"Image",
                    date:  2023-06-22
                    time: 19:23:27
                    inCart: true
                    itemName: "cat food"
                    price: 6.50,
                    quantity: 2
                    tags: [
                       "pet",
                       "pet food",
                       "furry friend",
                    ]
                 }`,
        },
        {
          role: "user",
          content: `object: ${obj} number of objects: ${numberOfObjects} extra context: ${extraInfo}. Note: Don't change any of the property names passed in with the schema`,
        },
      ],
    });

    // Extract the JSON array from the response
    const json = data.choices[0].message.content.match(/\[.*\]/s);
    console.log([
      {
        role: "system",
        content: `As a skilled data creator, your task is to generate a valid array of n JSON objects based 
                  on a given example schema. The value of each property in the input object should be relevant to its
                  name. For instance, if a property is named "name," you could assign the value 'bob roberts,' and if
                  another property is called "ID," it could be assigned the value '34532,' and so on. Please ensure 
                  that you only include the JSON values in your output and no additional strings or information. If a
                  property is an object with multiple child properties, generate the same number of child properties
                  accordingly. Wherver the value for a property is "Image" dont make any changes, just keep the value
                  as "Image". Any other properties should be filled with relevant values. For example, given the following
                  input object:

                  {
                    "id": "uuid",
                    "date": "calendar date",
                    "time": "time of day",
                    "inCart": true,
                    "itemName": "string",
                    "price": 0.0,
                    "quantity": 0,
                    "tags": [
                       "string",
                       "string",
                       "string"
                    ]
                  },
                  "number_of_objects":"5",
                  "extra_info":"Each object is an item in an online shopping cart"
                 }
                
                 You would return something like: 
                 {
                  id: c182b196-ff4e-436b-8e9b-4a97923003f9,
                  date:  2023-06-22
                  time: 19:23:27
                  inCart: true
                  itemName: "cat food"
                  price: 6.50,
                  quantity: 2
                  tags: [
                     "pet",
                     "pet food",
                     "furry friend",
                  ]
               }
                  `,
      },
      {
        role: "user",
        content: `object: ${obj} number of objects: ${numberOfObjects} extra context: ${extraInfo}. Note: Don't change any of the property names passed in with the schema`,
      },
    ]);
    return JSON.parse(json);
  } catch (error) {
    throw new Error("Something went wrong. Please try again.");
  }
}

module.exports = generateJSONObjects;
