const app = require("express")()

//ROUTER
const user = require("./routes/user")

app.use("/api/v1",user)




module.exports = app