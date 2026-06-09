const express = require('express');

const app = express();
const http = require('http');
const server = http.createServer(app);
const socketIo = require('socket.io');
const io = socketIo(server);

app.use(express.static('public'));

const users = new Set();

io.on('connection', (socket) => {

    socket.on('join', (user) => {
        users.add(user);
        socket.username = user;
        io.emit('userJoined', user);

        io.emit('userList', Array.from(users));

    })
    
    socket.on('userChat', (message)=>{
        io.emit('userChat', message);
    })
    
    //disconnection of an user

    socket.on('disconnect', ()=>{
      console.log('An user is disconneted');
        users.forEach(user=>{
            if(user === socket.username){
               users.delete(user);
               io.emit('userLeft', user);
               io.emit("userList", Array.from(users));
            }
        })
    })

})


const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Ther serve is running on port ${PORT}`);

})