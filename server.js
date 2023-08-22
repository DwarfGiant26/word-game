class Server{
    serverId;
    

    constructor(){

    }

    startListening(port=9999){

        const net = require('net');

        const server = net.createServer(socket => {
            console.log('Client connected');

            // Listen for data from the client
            socket.on('data', data => {
                console.log('Received from client:', data.toString());
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
    
    matchMaking(){

    }
}

server = new Server();
server.startListening();