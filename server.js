//global variables
let g_signed_in_users = [];

//data
const data = {
    users:[
        {
            username: "Riasat",
            email: "riasat@gmail.com",
            password: "$2b$10$j7vPO/irpOSFCyks9GgA/.R0isuwNKLuTsSdDjji2EZSHDELCh8yO",
            signed_in: false,
            score: 0
        },
        {
            username: "Mufrat",
            email: "mufrat@gmail.com",
            password: "$2b$10$j7vPO/irpOSFCyks9GgA/.R0isuwNKLuTsSdDjji2EZSHDELCh8yO",
            signed_in: false,
            score: 0
        },
        {
            username: "a",
            email: "a@a",
            password: "$2b$10$j7vPO/irpOSFCyks9GgA/.R0isuwNKLuTsSdDjji2EZSHDELCh8yO",
            signed_in: false,
            score: 0
        }
    ] 
}

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

//get all users(default behaviour(REDACTED test function)
/*app.get('/', (req, res) =>{
    res.json(g_signed_in_user);
})*/

//sign in func
app.post("/signin", (req, res) =>{

    const {email, password} = req.body;
    let signinSuccess = false;
    let currentUserPos = null;

    data.users.forEach( (item,pos) =>{
        if(item.email === email){
            signinSuccess = bcrypt.compareSync(password,item.password);
            if (signinSuccess) {
                item.signed_in = true;
                g_signed_in_users.push(item);
                currentUserPos = pos;
            }
        }
    })

    if(signinSuccess){
        let currentUser = {
            email: data.users[currentUserPos].email,
            score: data.users[currentUserPos].score,
            username: data.users[currentUserPos].username
        }
        res.status(200).json(currentUser);
    }else{
        res.status(400).json("CANNOT SIGN IN");
    }
})


//sign out func
app.post("/signout/:email", (req, res) => {

    const {email} = req.params;

    data.users.forEach((item) => {
        if (item.email === email) {
            g_signed_in_users.filter( (obj) => {
                obj === item;
            })
            item.signed_in = false;
        }
    })

    res.status(200).json("SIGNED OUT");
})

//register func
app.post("/register", (req, res) => {

    let already_registered = false;

    const { username, email, password } = req.body;
    let hash_password = bcrypt.hashSync(password, hashStr);

    data.users.forEach((item) => {
        if (item.email === email) {
            already_registered = true;
        }
    })

    if(already_registered){
        res.status(400).json("USER ALREADY REGISTERED");
    }else{
        let new_user = {
            username: username,
            email : email,
            password: hash_password,
            signed_in: false,
            score: 0
        }

        let new_mock_user = {
            email: new_user.email,
            username: new_user.username,
            score: new_user.score
        }

        data.users.push(new_user);

        res.status(200).json(new_mock_user);
    }
})


//user rank(image) function
app.put("/:email", (req, res) => {

    const { email } = req.params;
    let updated_score = 0;

    data.users.forEach((item) => {
        if (item.email === email) {
            item.score++;
            updated_score = item.score;
        }
    })

    if(updated_score !== 0){
        res.status(200).json(updated_score);
    }else{
        res.status(400).json("SCORE UPDATE FAILED");
    }
})

app.listen(3000);