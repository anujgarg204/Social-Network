const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const passport = require('passport')

const users = require('./routes/api/users')
const profile = require('./routes/api/profile')
const posts = require('./routes/api/posts')

const app = express();

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())


mongoose.connect('mongodb://localhost:27017/social', {useNewUrlParser: true}).then(() => console.log('mongo working')).catch(err => console.log(err));

//passport middleware
app.use(passport.initialize())

// passport config
require('./config/passport.js')(passport)

app.use('/api/users', users);
app.use('/api/posts', posts);
app.use('/api/profile',profile);

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`server up on port ${port}`)
});