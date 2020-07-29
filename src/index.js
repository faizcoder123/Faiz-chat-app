const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const { generateMessage, generateLocationMessage } = require('./utils/messages')
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')// serve html ccss using niddleware

app.use(express.static(publicDirectoryPath))



io.on('connection', (socket) => {
      console.log('New WebSocket connection')


    socket.on('sendMessage', (message,callback) => {
              const user=getUser(socket.id)
              io.to(user.room).emit('message', generateMessage(user.username,message))
              callback()
           })


  socket.on('disconnect', () => {

            const user = removeUser(socket.id)// search user by id and remove from array
            if (user) {

                io.to(user.room).emit('message', generateMessage(user.room,user.username+' has left!'))
            }

           })


  socket.on('join', ({username,room}, callback) => {
            const { error, user } = addUser({ id: socket.id, username,room})

              if (error) {
                   return callback(error)
                 }
              socket.join(room);
                //io.to  send to specific Room
              socket.emit('message', generateMessage(room,'Welcome!'))//generate will return object
              socket.broadcast.to(room).emit('message', generateMessage(room,username+ ' has joined!'))// to all exxept current
              callback()

          })

   socket.on('sendLocation', (coords,callback) => {
             const user=getUser(socket.id)
             io.to(user.room).emit('locationMessage',  generateLocationMessage(user.username,'https://google.com/maps?q='+coords.latitude+','+coords.longitude))///open map by latitide langitude
              callback()
             })

})


server.listen(port, () => {
    console.log('Server is up on port '+port)

})


// let count=0;// new user will increament and send to everyone
// io.on('connection', (socket) => {// new client connected
//     console.log('New WebSocket connection')
//     socket.emit('countUpdated',count)//  emitting server to client(chat.js)
//
//     socket.on('increament',()=>{// on means receiving from server
//        count++;
//        io.emit('countUpdated',count)// io emit for every not only for local(particular conneciton) as socket does
//     })
// })
