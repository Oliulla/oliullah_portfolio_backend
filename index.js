const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// middlewares
app.use(cors());
app.use(express.json());

// db
const uri = `mongodb+srv://${process.env.db_user}:${process.env.db_pass}@cluster0.g9drewa.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function dbAdmin() {
  try {
    const projectsDetailsCollection = client.db("portfolio").collection("projectDetails");

    app.get("/project/:title", async(req, res) => {
        // console.log(req.params);
        const title = req.params.title;
        const allDetails = await projectsDetailsCollection.find({}).toArray();
        // console.log(allDetails);
        const filter = allDetails.filter(allDetail => allDetail.title === title);
        const details = filter[0].imgs;
        // console.log(details);
        res.send([title, details]);
    })

  } finally {
  }
}
dbAdmin().catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("server ready!");
});

app.listen(port, () => {
  console.log(`Portfolio app listening on port ${port}`);
});
