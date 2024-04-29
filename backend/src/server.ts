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
    .then((response) => {
      const dom = new JSDOM(response.data);

      dom.window.document
        .querySelectorAll('[data-component-type="s-search-result"]')
        .forEach((productItem) => {
          const price = productItem.querySelector(
            ".a-price .a-offscreen"
          )?.textContent;
          const title = productItem.querySelector(
            ".a-size-mini .a-size-base-plus"
          )?.textContent;
          const reviewAmount = productItem.querySelector(
            '[data-component-type="s-client-side-analytics"] .a-size-base'
          )?.textContent;
          const amountOfStars = productItem.querySelector(
            ".a-icon .a-icon-alt"
          )?.textContent;
          const imgUrl =
            productItem.querySelector<HTMLImageElement>("img.s-image")?.src;

          const product: ProductType = {
            title: "",
            price: "",
            reviewAmount: 0,
            amountOfStars: "",
            imgUrl: "",
          };
          if (price) {
            product.price = price;
          }
          if (title) {
            product.title = title;
          }
          if (reviewAmount) {
            product.reviewAmount = Number(reviewAmount);
          }
          if (amountOfStars) {
            product.amountOfStars = amountOfStars;
          }
          if (imgUrl) {
            product.imgUrl = imgUrl;
          }

          productList.push(product);
        });
    })
    .catch((error) => {
      console.log("Error:" + error.response.data);
    });

  res.status(200).json(productList);
});

const port = 8080;
app.listen(port, () => {
  console.log("Http Server Running");
});
