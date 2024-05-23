const mongo_db = require("mongoose");
const connect_db = async () => {
      try {
            mongo_db.set("strictQuery", false);
            const conn = await mongo_db.connect(process.env.MONGODB_URI);
            console.log(`database connected:${conn.connection.host}`);

      }
      catch (err) {
            console.log(err)
      }
}
module.exports = connect_db;