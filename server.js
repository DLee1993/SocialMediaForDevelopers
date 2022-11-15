const Express = require("express");

const PORT = process.env.PORT || 5000;
const app = Express();

app.get("/", (req, res) => {
    res.send("api running");
});

app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));
