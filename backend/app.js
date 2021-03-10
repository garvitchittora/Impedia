const express = require('express')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 3000
const db = require('./db')


// Importing Routers
const studentRouter = require('./routes/studentRouter')
const authorityRouter = require('./routes/authorityRouter')
const adminRouter = require('./routes/adminRouter')


// Adding parsing middlewares
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
app.use(cors());

// Adding db connection logs
db.once('open', function () {
    console.log('Connected to MongoDB');
});
db.on('error', function (err) {
    console.log(err);
});


// Adding router middleware
app.use('/student', studentRouter);
app.use('/authority', authorityRouter);
app.use('/admin', adminRouter);


// Adding dummy routes
app.get('/', (req, res) => {
    res.send("Impedia API working successfully.");
})

// Starting the server
app.listen(port, () => console.log(`Impedia API listening at http://localhost:${port}`))