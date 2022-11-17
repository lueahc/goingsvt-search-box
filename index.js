const express = require('express');
const app = express();

const ejs = require('ejs');
const bodyParser = require('body-parser');
const pool = require('./config/database');
const func = require('./func');

require('dotenv').config();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.redirect('/search');
});

app.get('/search', async (req, res) => {
    res.render('search_box');
})

app.post('/search', async (req, res) => {
    const line = req.body.line;
    const connection = await pool.getConnection(async (conn) => conn);

    const query = `
        select 
            timetable.idx, 
            timetable.time, 
            timetable.subtitle, 
            video.title, 
            video.url 
        from timetable 
        left join video 
        on timetable.belong_idx = video.idx
        where timetable.subtitle like '%${line}%';
        `

    const [rows] = await connection.query(query);

    connection.release();

    const resData = {
        line: line,
        result: rows
    }

    res.render('search_result', {
        data: resData,
        func: func.renderFunc
    })
})

app.listen(PORT, () => { console.log(`listening on ${PORT}`); });