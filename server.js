//IMPORT MODULES -------------------------------------------------
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
const mysql = require('mysql');
//END SECTION ---------------------------------------------------

// ----------------- CONNECT TO SQL DATABASES. FIX LATER BY MIGRATING TO MYSQL2!!!!!!!!!!!!!!!!!!!!
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'ud'
});
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to database: ' + err.stack);
        return;
    }
    console.log(`Connected to ${connection} as id ` + connection.threadId);
});

const courses = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'courses'
});
courses.connect((err) => {
    if (err) {
        console.error('Error connecting to database: ' + err.stack);
        return;
    }
    console.log(`Connected to ${courses} as id ` + courses.threadId);

});

const userdata = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'user_data'
});
userdata.connect((err) => {
    if (err) {
        console.error('Error connecting to database: ' + err.stack);
        return;
    }
    console.log(`Connected to ${courses} as id ` + courses.threadId);

});
// END SECTION ----------------------------------------------------------------------

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/login.html');
});
app.post('/submit', (req, res) => {
    const username = req.body['username'];
    const password = req.body['password'];
    const uid = req.body['id'];
    console.log(uid);
    const queryString = 'SELECT * FROM admin WHERE username = ? AND password = ?';
    const queryParams = [username, password];
    connection.query(queryString, queryParams, (error, results, fields) => {
        if (error) throw error;
        if (results.length > 0) {
            res.sendFile(__dirname + '/public/index.html');

        } else {
            res.sendFile(__dirname + '/public/error.html');
        }
    });

});
app.post('/course_data', (req, res) => {
    courses.query('SELECT * FROM course', (error, results, fields) => {
        if (error) throw error;
        res.send(results);
    });
});


app.get('/delete-row', (req, res) => {
    const id = req.query.id
    console.log(id)
    res.send('ID received successfully!')
    const sql = `DELETE FROM course WHERE courseID = ${id}`;
    courses.query(sql, function (error, result) {
        if (error) throw error;
        console.log(result.affectedRows + " record(s) deleted");
    });
})

// STARTUP SERVER AND LISTEN ON SPECIFIC PORT ON SPECIFIC HOSTNAME --------
//still in progress
const port = 3000;
const hostname = '192.168.56.1'
app.listen(port, hostname,() => {
    console.log(`Server listening on port ${port}`);
});
// END SECTION -----------------------------------------------------------
