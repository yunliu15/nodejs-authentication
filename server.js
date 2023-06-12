const express = require('express');
const app = express();
const {logger} = require('./middleware/logEvents');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const path = require('path');
const PORT = process.env.PORT || 3500;
const errorHandler = require('./middleware/errorHandler');

// custom middleware logger
app.use(logger);

//cross origin source sharing

app.use(cors(corsOptions));

// built-in middleware to handle urlencoded data
// in other words, form data:  
// ‘content-type: application/x-www-form-urlencoded’
// (it will apply to all routs below)
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json 
app.use(express.json());

//serve static files
app.use(express.static(path.join(__dirname, '/public'))); // default for /
app.use('/subdir', express.static(path.join(__dirname, '/public')));

// routes
app.use('/', require('./routes/root'));
app.use('/subdir', require('./routes/subdir'));
app.use('/employees', require('./routes/api/employees'));
app.use('/register', require('./routes/register'));
app.use('/login', require('./routes/auth'));

//Route handlers
/* app.get('/hello(.html)?', (req, res, next) => {
    console.log('attempted to lead hello.html');
    next();
}, (req, res) => {
    res.send('hello word!')
});

const one = (req, res, next) => {
    console.log('one');
    next();
}
const two = (req, res, next) => {
    console.log('two');
    next();
}
const three = (req, res) => {
    console.log('three');
    res.send('finished')
}
app.get('/chain(.html)?', [one, two, three]) */

app.all('*', (req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    } else if (req.accepts('json')) {
        res.json({ "error": "404 Not Found" });
    } else {
        res.type('txt').send("404 Not Found");
    }
})

app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));