const handleSignin = (db, bcrypt) => (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json("incorrect for submission"); // if theres no email or password the function returns the error response and ends execution
  }
  db.select("email", "hash")
    .from("login")
    .where({
      email: email // this is the same as doing where("email", "0", email)
    })
    .then(data => {
      const isValid = bcrypt.compareSync(password, data[0].hash);
      if (isValid) {
        db.select("*")
          .from("users")
          .where("email", "=", email)
          .then(user => {
            res.json(user[0]);
          })
          .catch(err => {
            res.status(400).json("unable to get user");
          });
      } else if (!isValid) {
        res.status(400).json("wrong credentials");
      }
    })
    .catch(err => res.status(400).json("wrong credentials")); // i think this is doing nothing
};

module.exports = {
  handleSignin: handleSignin
};
