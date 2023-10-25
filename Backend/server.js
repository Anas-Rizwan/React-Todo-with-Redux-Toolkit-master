// import  Express  from "express";
// import  mysql  from "mysql";
// import { CorsOptions } from "cors";
import express from 'express'
import cors from 'cors'
import mysql from 'mysql'
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import session from 'express-session';

const app = express()
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['POST', 'GET'],
    credentials: true,
}));
app.use(express.json())
app.use(cookieParser())
// app.use(session({
//     secret: 'secret',
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//         secure: false,
//         maxAge: 1000 * 60 * 60 * 24
//     }
// }))
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'todolist'
})

app.get('/', (req, res) => {
    return res.json('from backend')
})

// SIGN_UP
app.post('/signup', (req, res) => {
    // Check if the email or name already exists in the database
    const checkQuery = 'SELECT * FROM user WHERE name = ? OR email = ? OR password = ? ';
    const checkValues = [req.body.name, req.body.email, req.body.password];

    db.query(checkQuery, checkValues, (err, existingUser) => {
        if (err) {
            return res.json({ status: "Error", EmptyField: "Fill All Fileds" });
        }
        console.log('existingUser', existingUser)
        if (existingUser.length > 0) {
            const isNameTaken = existingUser.some(user => user.name === req.body.name);
            const isEmailTaken = existingUser.some(user => user.email === req.body.email);
            const isPasswordTaken = existingUser.some(user => user.password === req.body.password);

            if (isNameTaken) {
                return res.json({ status: "NameError", NameError: "Name already in use" });
            }
            if (isEmailTaken) {
                return res.json({ status: "EmailError", EmailError: "Email already in use" });
            }
            if (isPasswordTaken) {
                return res.json({ status: "PasswordError", PasswordError: "Password already in use" });
            }
        } else {
            // No existing user with the same email or name, proceed with registration
            const sql = 'INSERT INTO user (`name`,`email`,`password`) VALUES(?)';
            const values = [
                req.body.name,
                req.body.email,
                req.body.password,
            ]
            db.query(sql, [values], (err, data) => {
                if (err) {
                    return res.json({ status: "Error", EmptyField: "Fill All Fields" })
                }
                else {
                    return res.json({ status: "Success", })

                }
            })
        }
    });
});



// LOGIN
app.post('/login', async (req, res) => {
    const sql = 'SELECT id , name FROM user WHERE email = ? and password = ?';

    db.query(sql, [req.body.email, req.body.password,], async (err, data) => {
        console.log('err', err);
        if (err) {
            return res.json({ status: "Error", EmptyField: "Fill All Login Fields" })
        }
        else {
            if (data.length > 0) {

                const userId = data[0].id;
                const username = data[0].name;
                const token = await jwt.sign({ username }, "jwt-secret-key", { expiresIn: '1d' })
                res.cookie('token', token,)
                res.cookie('id', userId,)
                console.log('username:', username);
                return res.json({ status: "Success", userId: userId, username: username, token: token });
            } else {
                return res.json({ status: "Error", Error: "Login Decline Check Your Email or Password", EmptyField: "Fill All Fields" });
            }
        }

    })
})

// Verify User
const Verifyuser = (req, res, next) => {
    const token = req.cookies.token
    if (!token) {
        console.log('you are not authorized');
        return res.json({ Error: 'you are not authorized', valid: false })
    } else {
        jwt.verify(token, "jwt-secret-key", (err, decode) => {
            if (err) {
                res.redirect('/login'); // Redirect to login page if not logged in
                res.json({ valid: false });
            } else {
                console.log(decode);
                req.name = decode.username
                req.token = token
                next()
            }
        })
    }
}

app.get('/verify', Verifyuser, (req, res) => {
    const user_id = req.cookies.id
    const data = req.cookies.data
    const username = req.name;
    const token = req.token;
    res.json({ status: 'success', user_id, data, username, token, valid: true })
});

// User Logout
app.get('/logout', (req, res) => {
    res.clearCookie('token')
    res.json({ status: 'success', valid: false });
});

// Post Todo Item
app.post('/todo', (req, res) => {
    const sql = 'INSERT INTO todo_table (`todos`,`user_id`) VALUES(?)'
    const value = [
        req.body.todos,
        req.body.user_id,
    ]
    db.query(sql, [value], (err, data) => {
        if (err) {
            return res.json({ status: "Error", EmptyField: "Fill All Fields" })
        }
        else {
            return res.json({ status: "Success", })
        }
    })
})
// Get Todo Item
app.get('/gettodo', (req, res) => {
    const sql = 'SELECT id, todos FROM user u INNER JOIN todo_table t ON u.id = t.user_id'
    db.query(sql, (err, data) => {
        console.log("data", data);
        if (err) {
            return res.json({ error: 'Error in Fetching Data', })
        }
        else {
            res.cookie('id', data)
            return res.json({ status: 'success', data })
        }
        // return res.json(data)
    })
})
// app.get('/session', (req, res) => {
//     if (req.session.username) {
//         return res.json({ valid: true, username: req.session.username })
//     } else {
//         return res.json({ valid: false })
//     }
// })

app.get('/user', (req, res) => {
    const sql = 'SELECT * FROM user'
    db.query(sql, (err, data) => {
        if (err) return res.json(err)
        console.log("data", data);
        return res.json(data)
    })
})


app.listen(8081, () => {
    console.log('listen');
})