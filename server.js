const express = require("express");

const server = express()

server.all("/", (req,res) => {
  res.send("Dodge is running !")
})

// function that starts server 
function keepAlive() {
  server.listen(3000, () => {
    console.log(`Server is ready to bang.`)
  })
}

module.exports = keepAlive