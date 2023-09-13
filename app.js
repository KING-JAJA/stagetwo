const express = require('express');
const sequelize = require('./config/db')
const synchronizeModel = require('./config/config');
const router = require('./routes/router');

require('dotenv').config();

const app = express();

app.use(express.json());

app.use(router);


const port = process.env.PORT;
synchronizeModel().then(() => {
    app.listen(port, () => {
        console.log(`Server started on port ${port}`);
    })
}).catch((error) => {
    console.error(`Error synchronizing database! ${error}`);
});