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
// console.log(uri);
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function dbAdmin() {
  try {
    const projectsDetailsCollection = client
      .db("portfolio")
      .collection("projectDetails");
    const projectsCollection = client.db("portfolio").collection("projects");
    const dailyQuotes = client.db("portfolio").collection("quotes");
    console.log("db connected")

    app.get("/projects", async (req, res) => {
      try {
        const projects = await projectsCollection.find({}).toArray();
        if (projects) {
          res.json({
            status: true,
            message: "projects got successfully",
            data: projects,
          });
        } else {
          res.json({ status: false, message: "data got failed", data: [] });
        }
      } catch (error) {
        res.json({ status: false, message: error.message });
      }
    });

    // send specific projects details
    app.get("/project/:title", async (req, res) => {
      // console.log(req.params);
      const title = req.params.title;
      const allDetails = await projectsDetailsCollection.find({}).toArray();
      // console.log(allDetails);
      const filter = allDetails.filter(
        (allDetail) => allDetail.title === title
      );
      const details = filter[0].imgs;
      // console.log(details);
      res.send([title, details]);
    });


    // Send daily quote
    app.get('/daily-quote', async (req, res) => {
      try {
        function getDayInfoFromDate() {
          // Get the current date
          const currentDate = new Date();

          // Get the day of the year (1-based)
          const startOfYear = new Date(currentDate.getFullYear(), 0, 1);
          const dayNumber =
            Math.ceil((currentDate - startOfYear) / (24 * 60 * 60 * 1000)) + 1;


          return {
            day: dayNumber,
          };
        }
        const day = getDayInfoFromDate()
        const dailyQuote = await dailyQuotes.findOne(day);
        if (dailyQuote) {
          res.status(200).json({ status: true, message: 'daily quote got successfully', data: dailyQuote });
        } else {
          res.json({ status: false, message: 'data got failed', data: [] });
        }
      } catch (error) {
        res.json({ status: false, message: error.message });
      }
    });
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
