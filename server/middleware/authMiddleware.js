const jwt = require("jsonwebtoken");
const { Client } = require("pg");
const connectionUrl = process.env.CONNECTION_URL;

const client = new Client(connectionUrl);

client.connect((err, res) => {
  if (err) {
    console.log(err);
  } else {
    console.log("middlware connected");
  }
});
const requireAuth = async (req, res, next) => {
  // Verify Authorized access

  const { authorization } = req.headers;

  if (!authorization) return res.status(401).json({ error: "Authorization" });

  const token = authorization.split(" ")[1];

  try {
    const tokenId = jwt.verify(token, process.env.JWT_SECRET);

    const { id } = tokenId;
    const userExists = await client.query("SELECT * FROM users Where id = $1", [
      id,
    ]);

    req.user = userExists;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ error: "Request is not Authorized" });
  }
};

module.exports = requireAuth;
