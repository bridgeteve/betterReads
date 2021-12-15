const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const updateCurrentlyReading = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);
  await client.connect();
  const db = client.db("betterReads");
  await db
    .collection("users")
    .findOneAndUpdate(
      { email: req.body.email },
      { $push: { currentlyReading: req.body.volumeId } }
    );
  res.status(200).json({ status: 200, ...req.body });
  client.close();
};

const updateToBeRead = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);
  await client.connect();
  const db = client.db("betterReads");
  await db
    .collection("users")
    .findOneAndUpdate(
      { email: req.body.email },
      { $push: { TBR: req.body.volumeId } }
    );
  res.status(200).json({ status: 200, ...req.body });
  client.close();
};

const updateRead = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);
  await client.connect();
  const db = client.db("betterReads");
  await db
    .collection("users")
    .findOneAndUpdate(
      { email: req.body.email },
      { $push: { Read: req.body.volumeId } }
    );
  res.status(200).json({ status: 200, ...req.body });
  client.close();
};

const updateFavorites = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);
  await client.connect();
  const db = client.db("betterReads");
  await db
    .collection("users")
    .findOneAndUpdate(
      { email: req.body.email },
      { $push: { Favorites: req.body.volumeId } }
    );
  res.status(200).json({ status: 200, ...req.body });
  client.close();
};

//GET shelves
const getCurrentlyReading = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);
  await client.connect();
  const db = client.db("betterReads");
  const result = await db
    .collection("users")
    .findOne(
      { email: req.body.email },
      { projection: { currentlyReading: 1, _id: 0 } }
    );
  res
    .status(200)
    .json({ status: 200, message: "all good", currentlyReading: result });
  client.close();
};

const getToBeRead = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);
  await client.connect();
  const db = client.db("betterReads");
  const result = await db
    .collection("users")
    .findOne({ email: req.body.email }, { projection: { TBR: 1, _id: 0 } });
  res.status(200).json({ status: 200, message: "all good", TBR: result });
  client.close();
};

const getRead = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);
  await client.connect();
  const db = client.db("betterReads");
  const result = await db
    .collection("users")
    .findOne({ email: req.body.email }, { projection: { Read: 1, _id: 0 } });
  res.status(200).json({ status: 200, message: "all good", Read: result });
  client.close();
};

const getFavorites = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);
  await client.connect();
  const db = client.db("betterReads");
  const result = await db
    .collection("users")
    .findOne(
      { email: req.body.email },
      { projection: { Favorites: 1, _id: 0 } }
    );
  res.status(200).json({ status: 200, message: "all good", Favorites: result });
  client.close();
};

//handler to push book from currently reading to read and delete from currently reading
const updateAndDelete = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);
  await client.connect();
  const db = client.db("betterReads");
  const volumeId = req.body.volumeId;
  await db
    .collection("users")
    .findOneAndUpdate({ email: req.body.email }, { $push: { Read: volumeId } });

  await db
    .collection("users")
    .findOneAndUpdate(
      { email: req.body.email },
      { $pull: { currentlyReading: volumeId } }
    );
  res.status(200).json({ status: 200, ...req.body });
  client.close();
};

const getFriend = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);
  await client.connect();
  const db = client.db("betterReads");
  const email = req.params.email;
  await db.collection("users").findOne({ email }, (err, result) => {
    result
      ? res.status(200).json({ status: 200, data: result })
      : res.status(404).json({ status: 404, data: "Not Found" });
    client.close();
  });
};

const updateFriends = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);
  await client.connect();
  const db = client.db("betterReads");
  await db
    .collection("users")
    .findOneAndUpdate(
      { email: req.body.userEmail },
      { $push: { friends: req.body.email } }
    );
  client.close();
};

const deleteFromShelf = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);
  await client.connect();
  const db = client.db("betterReads");
  const shelf = req.body.shelf;
  await db
    .collection("users")
    .findOneAndUpdate(
      { email: req.body.email },
      { $pull: { [shelf]: { $in: [req.body.volumeId] } } }
    );
  res.status(200).json({ status: 200, message: "removed!" });
  client.close();
};

const addReview = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);
  await client.connect();
  const db = client.db("betterReads");
  const newReview = {
    email: req.body.email,
    review: req.body.review,
    rating: req.body.rating,
    id: req.body.id,
    thumbnail: req.body.thumbnail,
    title: req.body.title,
    likes: [],
    comments: [],
  };
  await db.collection("reviews").insertOne(newReview);
  res
    .status(200)
    .json({ status: 200, message: "added review document to collection" });
  client.close();
};

const getReviews = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);
  await client.connect();
  const db = client.db("betterReads");
  const result = await db
    .collection("reviews")
    .find({ email: req.body.email })
    .toArray();
  res.status(200).json({ status: 200, message: "all good", reviews: result });
  client.close();
};

const updateLikes = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);
  await client.connect();
  const db = client.db("betterReads");
  const id = req.params.id;
  await db
    .collection("reviews")
    .findOneAndUpdate({ id: id }, { $push: { likes: req.body.email } });
  res.status(200).json({ status: 200, message: "all good" });
  client.close();
};

const deleteLike = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);
  await client.connect();
  const db = client.db("betterReads");
  const id = req.params.id;
  await db
    .collection("reviews")
    .findOneAndUpdate({ id: id }, { $pull: { likes: req.body.email } });
  res.status(200).json({ status: 200, message: "all good" });
  client.close();
};

const addComment = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);
  await client.connect();
  const db = client.db("betterReads");
  const id = req.params.id;
  await db.collection("reviews").findOneAndUpdate(
    { id: id },
    {
      $push: {
        comments: { comment: req.body.comment, email: req.body.email },
      },
    }
  );
  res
    .status(200)
    .json({ status: 200, message: "all good", comment: req.body.comment });
  client.close();
};

const getComments = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);
  await client.connect();
  const db = client.db("betterReads");
  const id = req.params.id;
  const result = await db
    .collection("reviews")
    .findOne({ id: id }, { projection: { comments: 1, _id: 0 } });
  res.status(200).json({ status: 200, message: "all good", result });
  client.close();
};

const updateReview = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);
  await client.connect();
  const db = client.db("betterReads");
  const id = req.body.id;
  await db
    .collection("reviews")
    .findOneAndUpdate({ id: id }, { $set: { review: req.body.review } });
  await db
    .collection("reviews")
    .findOneAndUpdate({ id: id }, { $set: { rating: req.body.rating } });
  res.status(200).json({ status: 200, message: "all good" });
  client.close();
};

module.exports = {
  updateCurrentlyReading,
  updateToBeRead,
  updateFavorites,
  updateRead,
  getCurrentlyReading,
  getFavorites,
  getRead,
  getToBeRead,
  getFriend,
  updateFriends,
  deleteFromShelf,
  updateAndDelete,
  addReview,
  getReviews,
  updateLikes,
  deleteLike,
  addComment,
  getComments,
  updateReview,
};
