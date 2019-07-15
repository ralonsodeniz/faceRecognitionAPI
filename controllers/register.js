const handleRegister = (req, res, db, bcrypt) => {
  const { email, name, password } = req.body;
  if (!email || !name || !password) {
    return res.status(400).json("incorrect form submission");
  }
  const hash = bcrypt.hashSync(password); //this is the method to do the hash syncronously
  db.transaction(trx => {
    // trx parameter substitutes db inside the transaction method, it is already referenced to db in the db.transaction()
    trx
      .insert({
        hash: hash,
        email: email
      })
      .into("login") //.into("login") method is the same that if we had used trx("login").insert
      .returning("email")
      .then(loginEmail => {
        return trx("users") // in another video this line is return db("users"), why that return? I think the return is because of the transactions, without the return the transaction returns errors
          .returning("*") // this means users insert the new user and then it returns all the columns just inserted
          .insert({
            email: loginEmail[0], // because we are using the result of the insertion promiso of login table it returns an array in the returning so we have to select the first object of the array to get the correct syntax of the email
            name: name,
            joined: new Date()
          })
          .then(user => {
            res.json(user[0]); // user is an array of objects, since we are inserting just 1 we can point the first object and this way we don't return an array to the front end but just the desired object
          });
      })
      .then(trx.commit) // this line is needed in order to commit the transaction if both actions, insert in both tables, are successful
      .catch(trx.rollback); // this line is needed to abort the transaction if something fails
  }).catch(err => {
    res.status(400).json("unable to register");
  });
};

module.exports = {
  handleRegister: handleRegister
};
