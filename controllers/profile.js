const handleProfileGet = (req, res, db) => {
  const { id } = req.params;
  db.select("*")
    .from("users")
    .where({
      // we can do .where({id}) for deconstructing since property and value are the same
      id: id
    })
    .then(user => {
      if (user.length) {
        res.json(user[0]);
      } else {
        res.status(400).json("error getting user");
      }
    });
};

module.exports = {
  handleProfileGet: handleProfileGet // since the object property and the value is the same we could just write handleProfileGet, remember thats this way with all objects
};
