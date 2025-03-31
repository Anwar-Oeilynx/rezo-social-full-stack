const express = require('express');
// const { use } = require('react');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const userRoutes = require('./routes/user.routes');
const postRoutes = require('./routes/post.routes');
require('dotenv').config({path: './config/.env'});
const port = process.env.PORT;
 require('./config/db');
// appel checkUser
const { checkUser,requireAuth } = require('./middleware/auth.middleware');

const app = express();  
 

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

//apple jwt
app.get('*', checkUser); // middleware pour tester si le user est connecté
// appel de require 
app.get('/jwtid', requireAuth, (req, res) => {
    const user = res.locals.user;
    res.status(200).send(user._id);
});
// routes 
app.use('/api/user', userRoutes);
app.use('/api/post', postRoutes);


 
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    });