import dotenv from "dotenv"
import { app } from "./app.js";
import dbconnect from "./db/index.js";
dbconnect()
  .then(() => {
    console.log("Database Connected Successfully");
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });

dotenv.config({
  path: "./env",
});
