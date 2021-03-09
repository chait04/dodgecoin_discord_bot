const Discord = require("discord.js")
// repl database import statement
const Database = require("@replit/database")
const fetch = require("node-fetch")
const keepAlive = require("./server")

//----------------------------------------------------
// creating new database
const db = new Database()
const client = new Discord.Client()

//----------------------------------------------------
// array of sad words msg
const sadWords = ["sad", "depressed", "unhappy", "angry","frustration", "boring", "tp", "kam", "santap", "nikal", "aree", "are", "arey", "areey"]

// array of encouragements msg
const starterEncouragements = [
  "Cheer up!",
  "dude talk with us",
  "chill buddy, listen some music",
  "hang up buddy",
  "Im musk, elon musk :'') "
]

//----------------------------------------------------
// setting key for database (encouragements) . this works  as key value pair
db.get("encouragements").then(encouragements => {
  if(!encouragements || encouragements.length < 1) {
    db.set("encouragements", starterEncouragements)
  }
})

// setting key for database (responding) point of this is weather it responds to sad words or not
db.get("responding").then(value => {
  if(value == null){
    db.set("responding", true)
  }
})

// adding new encouragements
function upadteEncouragements(encouragingMessage){
  db.get("encouragements").then(encouragements => {
    encouragements.push([encouragingMessage])
    db.set("encouragements", encouragements)
    //      key                     value
  })
}

// deleting encouragements
function deleteEncouragements(index){
  db.get("encouragements").then(encouragements => {
    if(encouragements.length > index) {
      encouragements.splice(index, 1)
      db.set("encouragements", starterEncouragements)
    }
  })
}

//----------------------------------------------------
// fetching data from url
async function getQuote() {
  const req = await fetch("https://zenquotes.io/api/random")
  const data =await req.json()
  return data[0]["q"] + " -" + data[0]["a"]
}

//----------------------------------------------------

// console output when we run bot
client.on("ready", () => {
  console.log(`Loged in as ${client.user.tag}`)
})

client.on("message", msg => {
// msg for hi/Hello/Hey
  if(msg.content === "hi" || msg.content === "Hi" || msg.content === "hello" || msg.content === "Hey") {
    msg.reply(`what's up, ${client.user.username} Hope you're doing well`)
  }
})

// message
client.on("message", msg => {
  if (msg.author.bot) return

// message for sending quotes
  if(msg.content === "$quote"){
    getQuote().then(quote => msg.channel.send(quote))
  }

  // taking key of responding to set further commands
  db.get("responding").then(responding => {
    // if responding is true then it will work which we are setting up below (user can change responding state to true/false)
    if(responding && sadWords.some(word => msg.content.includes(word))){
      db.get("encouragements").then(encouragements => {
      const encouragement = encouragements[Math.floor(Math.random() * encouragements.length)]
      // replying to that message
       msg.reply(encouragement)
    })
  }
  })

  // adding new message to encouragements
  if(msg.content.startsWith("$new")){
    encouragingMessage = msg.content.split("$new")[1]
    upadteEncouragements(encouragingMessage)
    msg.channel.send(`New movtivational messge added in by ${client.user}`)
  }

  // deleting message from encouragements
  if(msg.content.startsWith("$del")){
    index = parseInt(msg.content.split("$del")[1])
    deleteEncouragements(index)
    msg.channel.send(`Recent movtivational messge deleted from list by ${client.user}`)
  }

  // list of manually added quotes
  if(msg.content.startsWith("$list")) {
    db.get("encouragements").then(encouragements => {
      msg.channel.send(encouragements)
    })
  }

  // responding status on/off
  if(msg.content.startsWith("$responding")) {
    // trim will clear the extra space from prefix
    value = msg.content.split("$responding")[1].trim()
 
    // console.log(value.toLowerCase() == "true") this line was for debugging

    if(value.toLowerCase() == "true"){
      db.set("responding", true)
      msg.channel.send("Responding is on.")
    } else if (value.toLowerCase() == "false"){
      db.set("responding", false)
      msg.channel.send("Responding is off.")
    } else {
      msg.channel.send(`${client.user} send appropriate command either true/false`)
    }
  }
})

keepAlive()
//----------------------------------------------------
// Token stored in end file
client.login(process.env.DISCORD_BOT_TOKKEN)