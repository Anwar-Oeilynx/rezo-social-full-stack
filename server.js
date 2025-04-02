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

//appel de cors
const cors = require('cors');
const corsOptions = {
    origin:process.env.CLIENT_URL, // Remplacez par l'URL de votre client
    credentials: true, // Autoriser les cookies et les en-têtes d'autorisation
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], // Méthodes autorisées
    allowedHeaders: ['Content-Type', 'Authorization'], // En-têtes autorisés
    exposedHeaders: ['Content-Disposition'], // En-têtes exposés
    preflightContinue: false, // Ne pas continuer la requête après la pré-vérification
    maxAge: 3600, // Durée de mise en cache de la pré-vérification (en secondes)
     optionsSuccessStatus: 200 // For legacy browser support

};

const app = express();  
 
app.use(cors(corsOptions)); // utiliser cors pour les requetes cross-origin
app.use(express.json());//

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