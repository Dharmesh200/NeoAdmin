const express = require("express");
const ApiRoutes = require("./routes/Router");
const cookieParser = require("cookie-parser");
const { connect } = require("mongoose");

const app = express();
const mongodbURL ='mongodb://localhost:27017/NeoKred';

app.use(express.json());

let startServer = async () => {

    let dataBase = async ()=>{
        connect(mongodbURL);
        console.log('database is connected');
    };
    dataBase();

    app.use(cookieParser());
    app.use("", ApiRoutes);

    const port = process.env.PORT || 5000

    app.listen(port, () => {
        console.log(`server is running on http://localhost:${port}`);
    })
};
startServer()