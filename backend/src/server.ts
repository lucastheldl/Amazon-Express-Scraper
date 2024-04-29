import axios from "axios";
import express from "express";
import jsdom from "jsdom";
import cors from "cors";

const app = express();
const { JSDOM } = jsdom;

//CORS config to allow frontend to acess the server.
//If you're using live server to load your index file then yopu may need to change the origin.
app.use(
  cors({
    origin: "null",
  })
);

//Type declaration of our products
interface ProductType {
  title: string;
  price: string;
  reviewAmount: number;
  amountOfStars: string;
  imgUrl: string;
}
//Endpoint "search"
app.get("/search", async (req, res) => {
  //retrieve the query parameter from the URL
  const { q } = req.query;
  //Create a list to store our formated products
  const productList: ProductType[] = [];

  //Makes a GET request to amazon search using headers to simulate a browser request
  await axios({
    method: "get",
    url: `https://www.amazon.com/s?k=${q}`,
    headers: {
      "User-Agent":
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.90 Safari/537.36",
      Accept:
        "text/html, application/xhtml+xml, application/xml;q=0.9, image/webp, */*;q=0.8",
    },
  })
    //then gets the response and parses it using JSDOM.
    .then((response) => {
      const dom = new JSDOM(response.data);
      //Get all products objects from the page
      dom.window.document
        .querySelectorAll('[data-component-type="s-search-result"]')
        .forEach((productItem) => {
          //get the price element content
          const price = productItem.querySelector(
            ".a-price .a-offscreen"
          )?.textContent;

          //get the title element content
          const title = productItem.querySelector(
            ".a-size-mini .a-size-base-plus"
          )?.textContent;

          //get the review element content
          const reviewAmount = productItem.querySelector(
            '[data-component-type="s-client-side-analytics"] .a-size-base'
          )?.textContent;

          //get the stars element content
          const amountOfStars = productItem.querySelector(
            ".a-icon .a-icon-alt"
          )?.textContent;

          //get the image element content
          const imgUrl =
            productItem.querySelector<HTMLImageElement>("img.s-image")?.src;

          //Create a new product obejct to inject in it the retrieved data
          const product: ProductType = {
            title: "",
            price: "",
            reviewAmount: 0,
            amountOfStars: "",
            imgUrl: "",
          };

          //check if theres a price
          if (price) {
            product.price = price;
          }
          //check if theres a title
          if (title) {
            product.title = title;
          }
          //check if theres a reviewAmount
          if (reviewAmount) {
            product.reviewAmount = Number(reviewAmount);
          }
          //check if theres a amountOfStars
          if (amountOfStars) {
            product.amountOfStars = amountOfStars;
          }
          //check if theres a image URL
          if (imgUrl) {
            product.imgUrl = imgUrl;
          }
          //Add the created product to the list
          productList.push(product);
        });
    })
    .catch((error) => {
      //Catch any errors with the request
      console.log("Error:" + error.response.data);
    });
  //return the product list if everything goes right
  res.status(200).json(productList);
});

//Make server lister to the port
const port = 8080;

app.listen(port, () => {
  console.log("Http Server Running");
});
