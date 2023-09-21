const io = require('socket.io-client').io

const socket = new io('http://localhost:5000')

socket.emit('Simo','Domguia Simo Ulrich')

socket.on('test',()=>{
   console.log("Okay it works")
}) 
