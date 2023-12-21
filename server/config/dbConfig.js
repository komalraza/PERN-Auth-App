const { Client } =  require("pg");
const connectionUrl = process.env.CONNECTION_URL

const client = new Client(connectionUrl);

const connectDb = async () => {
  try {
    await client.connect();

    console.log("Connected");
  } catch (error) {
    console.log(error);
    await client.end();
  }finally{
    await client.end()
  }
};

module.exports= connectDb;
