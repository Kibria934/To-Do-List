const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
const port = process.env.PORT || 5000;

// ---------- midle ware -----------
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bsm5s.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const toDoCollection = client.db("myToDoLit").collection("todo");
    app.post("/allTodo", async (req, res) => {
      const toDo = req.body;
      const result = await toDoCollection.insertOne(toDo);
      res.send(result);
      console.log(toDo);
    });


    app.get('/allToDo',async(req,res)=>{
      const result = await toDoCollection.find().toArray();
      res.send(result)
    })

    app.delete('/allToDo/:id',async(req,res)=>{
      const id = req.params.id;
      console.log(id);
      const query = {_id:ObjectId(id)};
      const result = await toDoCollection.deleteOne(query);
      res.send(result)
    })
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello From my todo server");
});

app.listen(port, () => {
  console.log(`my todo server is running on port: ${port}`);
});
