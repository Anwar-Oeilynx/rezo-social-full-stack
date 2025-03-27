const express = require('express');
// const { use } = require('react');
const bodyParser = require('body-parser');

const userRoutes = require('./routes/user.routes');
require('dotenv').config({path: './config/.env'});
const port = process.env.PORT;
 require('./config/db');

const app = express();  
 

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// routes 
app.use('/api/user', userRoutes);


 
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    });