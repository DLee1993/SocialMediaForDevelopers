const Express = require("express");
const connectDB = require("./config/db");
const PORT = process.env.PORT || 5000;
const app = Express();

//* - connect to the database
connectDB();

//* - initialise middleware
app.use(Express.json({ extended: false }));

app.get("/", (req, res) => {
    res.send("api running");
});

//* - Define Routes
app.use("/users", require("./routes/api/users"));
app.use("/auth", require("./routes/api/auth"));
app.use("/profile", require("./routes/api/profile"));
app.use("/posts", require("./routes/api/posts"));

app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));
