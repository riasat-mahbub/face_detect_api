//global variables
let g_signed_in_users = [];

//knex
const knex = require('knex');

const pg = knex({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: 'postgres',
        password: '',
        database: 'face_detect'
    }
});

//bcrypt
const bcrypt = require('bcrypt');
const hashStr = 10;

//express
const express = require('express');
const app = express();

//body parser 
const bodyParser = require('body-parser');
app.use(bodyParser.json());

//cors
const cors = require('cors');
app.use(cors());

//get all users(default behaviour)
app.get('/', (req, res) =>{
    res.json("server is working");
}
//sign in func
app.post("/signin", (req, res) =>{

    const {email, password} = req.body;

    if(email === null || password === null){
        res.json("Empty Email or password");
    }

    pg
    .select('*').from('signin').where({
        email: email
    })
    .then( (signinUsers) => {

        if(signinUsers.length > 0){
            let signinSuccess = bcrypt.compareSync(password, signinUsers[0].hash);
        
            if(signinSuccess){
                pg
                .select('*').from('users').where({
                    id: signinUsers[0].id
                })
                .then( (registeredUsers) => {
                    let signedInUser = {
                        name: registeredUsers[0].name,
                        email: registeredUsers[0].email,
                        score: registeredUsers[0].score
                    }

                    res.status(200).json(signedInUser);
                })
            }
        }else{
            res.status(400).json("CANNOT SIGN IN")
        }
    })

})


//register func
app.post("/register", (req, res) => {

    const { name, email, password } = req.body;
    let hash_password = bcrypt.hashSync(password, hashStr);
    
    if (email === null || password === null) {
        res.json("Empty Email or password");
    }

    let new_user = {
        name: name,
        email : email,
        joined: new Date()
    }


    pg('users')
    .insert(new_user)
    .then( () =>{


        //set login credentials
        let login_user = {
            email: new_user.email,
            hash: hash_password
        }

        pg('signin')
            .insert(login_user)
            .then( );

        //send a mock user to the frontend
        let mock_user = {
            email: new_user.email,
            name: new_user.name,
            score: 0
        }

        res.status(200).json(mock_user);
    })
    .catch( (err) =>{
        res.status(400).json("REGISTRATION ERROR")
    });

})


//user rank(image) function
app.put("/:email", (req, res) => {

    const { email } = req.params;

    pg('users')
    .where('email', '=', email)
    .increment('score', 1)
    .returning('score')
    .then( (scores) =>{
        res.status(200).json(scores[0]);
    })
    .catch( (err) => {
        res.status(400).json("UPDATE FAILED")
    })
})

//port
const PORT = process.env.PORT;
app.listen(PORT|| 3000);