// we take the Clarifai auth to the backendo because in the front end the API key is visible when we make a request to the API
const Clarifai = require("clarifai");

const app = new Clarifai.App({
  apiKey: process.env.API_CLARIFAI
});

const handleApiCall = (req, res) => {
  app.models
    .predict(Clarifai.FACE_DETECT_MODEL, req.body.imageUrl)
    .then(data => {
      res.json(data);
    })
    .catch(err => res.status(400).json("unable to work with API"));
};

const handleImage = (req, res, db) => {
  const { id } = req.body;
  db("users")
    .where("id", "=", id) // this is the same that .where({id: id})
    .increment("entries", 1)
    .returning("entries")
    .then(entries => {
      res.json(entries[0]);
    })
    .catch(err => res.status(400).json("unable to get entries"));
};

module.exports = {
  handleImage,
  handleApiCall
};
