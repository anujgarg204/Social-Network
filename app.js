const express = require('express')
const mongoose = require('mongoose')


const users = require('./routes/api/users')
const profile = require('./routes/api/profile')
const posts = require('./routes/api/posts')


const app = express();

mongoose.connect('mongodb://localhost:27017/social', {useNewUrlParser: true}).then(() => console.log('mongo working')).catch(err => console.log(err));

app.get('/',(req,res) => {
    return res.send('Hello!')
});

app.use('/api/users', users);
app.use('/api/posts', posts);
app.use('/api/profile',profile);

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`server up on port ${port}`)
});