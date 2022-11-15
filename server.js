const Express = require("express");
const connectDB = require('./config/db'); 
const PORT = process.env.PORT || 5000;
const app = Express();

//info - connect to the database
connectDB(); 

app.get("/", (req, res) => {
    res.send("api running");
});

app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));
