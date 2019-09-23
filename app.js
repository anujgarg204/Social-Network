const express = require('express')

const app = express();

app.get('/',(req,res) => {
    return res.send('Hello!')
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`server up on port ${port}`)
});