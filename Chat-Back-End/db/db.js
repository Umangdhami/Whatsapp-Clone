const mongoose = require('mongoose');
const dotenv = require('dotenv')
dotenv.config()

mongoose.connect(`${process.env.DATABASE_URL}${process.env.DATABASE_NAME}`).then(() => {
    console.log('Database Connected...');
}).catch((err) => {
    console.log('Database Error...', err);
})

module.exports = mongoose