# ObjectAlchemy

This API will generate you an array of objects given just an example schema, with each object containg relevant information for your needs.

For example if your request looks like

```
const axios = require("axios");

const data = {
  object: {
    id: "uuid",
    date: "calendar date",
    time: "time of day",
    inCart: true,
    itemName: "string",
    price: 0.0,
    quantity: 0,
    best_before: "date",
  },
  number_of_objects: "5",
  extra_info: "Each object is an item in an online shopping cart",
};

const getData = async () => {
  try {
    const res = await axios.post("http://localhost:3000", data);
    console.log(res.data);
  } catch (error) {
    console.log(error);
  }
};

getData();
```

You can expect the response to look something like:

```
[
	{
		"id": "6305e1af-15cd-49f2-87f8-032c565104c8",
		"date": "2023-07-15",
		"time": "14:30:45",
		"inCart": true,
		"itemName": "Shirt",
		"price": 24.99,
		"quantity": 1,
		"best_before": "2025-12-31"
	},
	{
		"id": "e26d4d93-40ca-4a69-a496-8b258a4285f7",
		"date": "2023-07-15",
		"time": "16:45:10",
		"inCart": true,
		"itemName": "Shoes",
		"price": 79.99,
		"quantity": 1,
		"best_before": "2025-12-31"
	}
    +3 more objects...
]
```

## Image generation

If for every object you would like a relevant image you can hit the `/img` endpoint which will use the generated objects to prompt the openai API to generate a relevant image. Furthermore, if you want the image to be in a certain style you can also pass in the property `img_info` in your request body

## Request body formatting for endpoints

Request body format for `/` endpoint:

```
{
    object: {
        <THE OBJECT YOU WANT TO MAKE AN ARRAY OF>
    },
    number_of_objects: <NUMBER OF OBJECTS YOU WANT TO POPULATE THE ARRAY, capped at 8 to reduce response time and cost>,
    extra_info: <SOME RELEVANT INFORMATION ABOUT WHAT THE OBJECT IS, eg a comic book superhero, an item in a shopping cart etc>
}
```

Request body format for `/img` endpoint:

```
{
    object: {
        <THE OBJECT YOU WANT TO MAKE AN ARRAY OF>
    },
    number_of_objects: <NUMBER OF OBJECTS YOU WANT TO POPULATE THE ARRAY, capped at 8 to reduce response time and cost>,
    extra_info: <SOME RELEVANT INFORMATION ABOUT WHAT THE OBJECT IS, eg a comic book superhero, an item in a shopping cart etc>,
    img_info: <KEYWORDS TO INFLUENCE THE STYLE OF THE IMAGE GENERATED, use: https://docs.google.com/document/d/11WlzjBT0xRpQhP9tFMtxzd0q6ANIdHPUBkMV-YB043U/edit#heading=h.sqbemjap41ye to help>
}
```
