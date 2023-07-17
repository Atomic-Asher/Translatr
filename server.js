// server.js
const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const axios = require('axios');

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    socket.on('chat message', (msg) => {
        axios.post('https://api.openai.com/v1', {
            prompt: msg,
            max_tokens: 60
        }, {
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
            }
        })
        .then(function (response) {
            io.emit('chat message', response.data.choices[0].text.trim());
        })
        .catch(function (error) {
            console.log(error);
        });
    });
});

http.listen(3000, () => {
    console.log('listening on *:3000');
});


