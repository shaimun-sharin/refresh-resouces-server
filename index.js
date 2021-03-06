const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  res.send("running server");
});

app.listen(port, () => {
  console.log(`listening to port ${port}`);
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bojeg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
async function run() {
  try {
    await client.connect();
    const fruitCollection = client.db("fooddb").collection("foods");
    const adminCollection = client.db("admindb").collection("admins");
    // AUTH
    app.post("/login", async (req, res) => {
      const user = req.body;
      const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "1d",
      });
      res.send({ accessToken });
    });

    //GET Data
    app.get("/food", async (req, res) => {
      const query = {};
      const cursor = fruitCollection.find(query);
      const foods = await cursor.toArray();
      res.send(foods);
    });
    //GET single Data

    app.get("/food/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const food = await fruitCollection.findOne(query);
      res.send(food);
    });

    //    POST Data
    app.post("/food", async (req, res) => {
      console.log(req.body);
      const newFood = req.body;
      const result = await fruitCollection.insertOne(newFood);
      console.log(result);
      res.send(result);
    });
    app.get("/item", async (req, res) => {
      const authHeader = req.headers.authorization;
      console.log(authHeader);
      const email = req.query.email;
      console.log(email);
      const query = { email: email };
      const cursor = fruitCollection.find(query);
      const items = await cursor.toArray();
      res.send(items);
    });

    // DELETE data
    app.delete("/food/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await fruitCollection.deleteOne(query);
      res.send(result);
    });

    // ADMIN DATA
    app.get("/admin", async (req, res) => {
      const query = {};
      const cursor = adminCollection.find(query);
      const admins = await cursor.toArray();
      res.send(admins);
    });
    app.put("/food/:id", async (req, res) => {
      const id = req.params.id;
      const updateQuantity = parseInt(req.body);
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          quantity: updateQuantity.quantity,
        },
      };
      const result = await fruitCollection.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });
  } finally {
  }
}

run().catch(console.dir);
