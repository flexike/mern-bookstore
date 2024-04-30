const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const cors = require("cors");

// middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("I'm alive");
});

// MongoDB configuration
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri =
  "mongodb+srv://mern-book-store:EqrL8ffzKpPNMtNw@cluster0.y1ltbmz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // create collection of documents
    const booksCollection = client.db("BookInventory").collection("books");

    // insert a book into db: post method
    app.post("/upload-book", async (req, res) => {
      const data = req.body;
      const result = await booksCollection.insertOne(data);
      res.send(result);
    });

    // get all books
    app.get("/all-books", async (req, res) => {
      const books = booksCollection.find();
      const result = await books.toArray();
      res.send(result);
    });

    // patch or update method
    app.patch("/book/:id", async (req, res) => {
      const id = req.params.id;
      const newData = req.body;
      const filter = { _id: new ObjectId(id) };
      const updData = {
        $set: { ...newData },
      };

      const result = await booksCollection.updateOne(filter, updData);
      res.send(result);
    });

    // delete method
    app.delete("/book/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };

      const result = await booksCollection.deleteOne(filter);
      res.send(result);
    });

    // sort by category
    app.get("/all-books", async (req, res) => {
      let query = {};
      if (req.query?.category) {
        query = { category: req.query.category };
      }

      const result = await booksCollection.find(query).toArray();
      res.send(result);
    });

    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

// Server Starting
app.listen(port, () => {
  console.log(`SERVER STARTED on port: ${port}`);
});
