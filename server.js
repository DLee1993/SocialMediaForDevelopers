const Express = require("express");
const connectDB = require('./config/db'); 
const PORT = process.env.PORT || 5000;
const app = Express();

//info - connect to the database
connectDB(); 

app.get("/", (req, res) => {
    res.send("api running");
});

//info - Define Routes
app.use('/users', require('./routes/api/users'))
app.use('/auth', require('./routes/api/auth'))
app.use('/profile', require('./routes/api/profile'))
app.use('/posts', require('./routes/api/posts'))

app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));
