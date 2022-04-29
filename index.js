const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require("mongodb");

app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  res.send("running server");
});

app.listen(port, () => {
  console.log(`listening to port ${port}`);
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ekqo2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
async function run() {
  try {
    await client.connect();
    const fruitCollection = client.db("dbuser").collection("foods");
    app.get("/food", async (req, res) => {
      const query = {};
      const cursor = fruitCollection.find(query);
      const foods = await cursor.toArray();
      res.send(foods);
    });
  } finally {
  }
}
run().catch(console.dir);
