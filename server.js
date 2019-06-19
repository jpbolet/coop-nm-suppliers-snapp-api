const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const PORT = 4001;

// app.use(cors({ credentials: true }));
app.use(cors());
app.use(bodyParser.json());

const supplierDataRoutes = require('./api/routes/supplierData');

app.use('/snapp', supplierDataRoutes);

app.listen(PORT, function() {
    console.log("Server is running on Port: " + PORT);
});
