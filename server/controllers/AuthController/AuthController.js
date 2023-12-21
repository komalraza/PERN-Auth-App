const asyncHanlder = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const { Client } = require("pg");
const connectionUrl = process.env.CONNECTION_URL;

const client = new Client(connectionUrl);

client.connect((err, res) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Auth controller connected");
  }
});

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

// Refresh token

const refreshToken = (id) => {
  return jwt.sign({ email }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "10m",
  });
};

// Create New User Account  
const RegisterUser = asyncHanlder(async (req, res) => {
  const { name, email, password, role } = req.body;

  console.log(req.body, "FormData");

  try {
    if (!name || !email || !password) {
      res.status(400);
      throw Error("Please add all required fields");
    }
    // Vaidation of Signup Form fileds

    if (!validator.isEmail(email)) {
      throw Error("Email must be a valid email");
    }

    if (!validator.isStrongPassword(password)) {
      throw Error("Please enter a strong password");
    }
    try {
      // await client.connect();

      // check if user exists
      const userExists = await client.query(
        "SELECT * FROM users Where email = $1",
        [email]
      );

      if (userExists?.rowCount > 0) {
        res.status(400);
        // throw new Error("User already exists");
        // await client.end();

        return res.json({ message: "User already exists" });
      }

      // create hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt?.hash(password, salt);

      console.log("Hashed Password", hashedPassword);

      let userRole;
      if (role !== "") {
        userRole = role;
      } else {
        userRole = "";
      }
      // create user
      const user = await client.query(
        `INSERT INTO users (name, email, password, role,auth_token) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [name, email, hashedPassword, userRole, ""]
      );

      console.log(user.rowCount, "Inserted user");

      if (user) {
        let userToken = generateToken(user?.rows[0]?.id);
        res.status(200).send({
          email: user?.rows[0].email,
          name: user?.rows[0]?.name,
          role: user?.rows[0]?.role,
          auth_token: userToken,
        });
      } else {
        res.status(400).json({ message: "Invalid user" });
      }
    } catch (error) {
      console.log(error);
      // await client.end();
    } finally {
      // await client.end();
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//   Authenticate user on Logged in
const LoginUser = asyncHanlder(async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      res.status(400);
      throw new Error("Please add all fields");
    }
    try {
      // Check for user email
      const userEmail = await client.query(
        `SELECT * from users where email= $1`,
        [email]
      );
      let user = userEmail?.rows[0];

      if (!user) {
        res.status(401);
        throw new Error("Invalid Email Address");
        // await client.end();
      }
      let matchPassword = await bcrypt.compare(password, user?.password);

      if (!matchPassword) {
        // await client.end();

        res.status(401);
        throw new Error("Invalid Password");
      }

      const AuthToken = generateToken(user.id);
      if (user && matchPassword) {
        console.log(user.auth_token, "DB", AuthToken);

        try {
          const userUpdate = await client.query(
            `update users set auth_token=$1 where email= $2 Returning *`,
            [AuthToken, email]
          );

          if (userUpdate?.rowCount > 0) {
            let data = userUpdate?.rows[0];
            // await client.end();

            return res.status(201).json({
              name: data?.name,
              email: data?.email,
              token: data?.auth_token,
              role: data?.role,
            });
          } else {
            // await client.end();

            return res.status(201).json({
              name: user?.name,
              email: user?.email,
              token: AuthToken,
              role: user?.role,
            });
          }
        } catch (error) {
          // await client.end();

          console.log(error, "User login error");
        } finally {
          // await client.end();
        }
      } else {
        // await client.end();

        return res.status(400).json({ error: error } || "Invalid credentials");
      }
    } catch (error) {
      console.log(error, "Signin");
      // await client.end();
    } finally {
      // await client.end();
    }
  } catch (err) {
    console.log("err", "Sign in API");
  }
});

const RefreshToken = asyncHanlder(async (req, res) => {
  try {
    await client.connect();

    const token = await client.query(``);
  } catch (error) {
    console.log(error);
    // await client.end();
  } finally {
    // await client.end();
  }
});

// Forget Password
const ForgetPassword = asyncHanlder(async (req, res) => {
  res.json({
    message: "Forget password email",
  });
});



// Reset Password
const ResetPassword = asyncHanlder(async (req, res) => {});

module.exports = {
  RefreshToken,
  LoginUser,
  ResetPassword,
  ForgetPassword,
  RegisterUser,
};
