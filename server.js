const Match = require('./match.js');

class Server{
    serverId;
    match;
    

    constructor(){

    }

    startListening(port=9999){

        const net = require('net');

        const server = net.createServer(socket => {
            console.log('Client connected');

            // Listen for data from the client
            socket.on('data', data => {
                data = data.toString();
                console.log('Received from client:', data);
                switch (data){
                    case 'play':
                        this.createMatch();
                }
            });

            // Handle the client disconnecting
            socket.on('end', () => {
                console.log('Client disconnected');
            });
        });

        server.listen(port, () => {
            console.log('Server listening on port', port);
        });

    }

    createMatch(){
        console.log('match created');
        this.match = new Match(this.generateMatchId());
    }

    generateMatchId(){
        return 1;
    }

    serve(){
    }
    
    matchMaking(){

    }
}

server = new Server();
server.startListening();