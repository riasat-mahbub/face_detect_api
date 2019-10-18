//global variables
let g_signed_in_user = null;

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

//get all users(default begaviour)
app.get('/', (req, res) =>{
    res.json(g_signed_in_user);
})

//sign in func
app.post("/signin", (req, res) =>{

    if (g_signed_in_user != null) {
        return res.status(400).json("ALREADY SIGNED IN");
    }

    const {email, password} = req.body;
    
    data.users.forEach( (item) =>{
        if(item.email === email){
            const same = bcrypt.compareSync(password,item.password);
            if (same) {
                item.signed_in = true;
                g_signed_in_user = item;
            }
        }
    })

    if(g_signed_in_user != null){
        res.status(200).json(g_signed_in_user)
    }else{
        res.status(400).json("SIGN IN ERROR");
    }
})


//sign out func
app.post("/signout", (req, res) => {

    if (g_signed_in_user == null) {
        return res.status(400).json("ALREADY SIGNED OUT")
    }

    data.users.forEach((item) => {
        if (item.email === g_signed_in_user.email) {
            item.signed_in = false;
            g_signed_in_user = null;
        }
    })

    if (g_signed_in_user == null) {
        res.status(200).json("SIGNED OUT")
    } else {
        res.status(400).json("SIGN OUT ERROR");
    }
})

//register func
app.post("/register", (req, res) => {

    if(g_signed_in_user != null){
        return res.status(400).json("ALREADY SIGNED IN");
    }

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

        data.users.push(new_user);

        g_signed_in_user = new_user;
        g_signed_in_user.signed_in = true;

        res.status(200).json(g_signed_in_user);
    }
})

//profile find function
app.get("/:email", (req, res) => {

    const {email} = req.params;
    let matching_user = null;

    data.users.forEach((item) => {
        if (item.email === email) {
            matching_user = item;
        }
    })

    if (matching_user != null) {
        res.status(200).json(matching_user)
    } else {
        res.status(400).json("CANT FIND USER");
    }
})


//user rank(image) function
app.put("/:email", (req, res) => {

    const { email } = req.params;
    let updated_score = false;

    data.users.forEach((item) => {
        if (item.email === email) {
            ++(item.score);
            updated_score = true;
        }
    })

    if(updated_score){
        res.status(200).json("SCORE UPDATED");
    }else{
        res.status(400).json("SCORE UPDATE FAILED");
    }
})

app.listen(3000);