const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'D24$m?!tdy',
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
    password: 'D24$m?!tdy',
    database: 'courses'
});
courses.connect((err) => {
    if (err) {
        console.error('Error connecting to database: ' + err.stack);
        return;
    }
    console.log(`Connected to ${courses} as id ` + courses.threadId);
});


const port = 3000;
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/login.html');
});
app.post('/submit', (req, res) => {
    const username = req.body['username'];
    const password = req.body['password'];
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

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
