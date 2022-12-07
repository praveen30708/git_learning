const mongoose = require("mongoose")

module.exports = async () => {
    mongoose.connect(process.env.DB_URL, {
        useNewUrlParser: true,
        useUnifiedToplogy: true
    }).then(() => {
        console.log("DB connected Success");
    }).catch(error => console.log(error.message));
}