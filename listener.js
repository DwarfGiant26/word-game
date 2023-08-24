const net = require('net');

class Listener{
    port;
    listener;
    socket;

    constructor(port){
        this.port = port;
    }

    serve(processDataFn){
        this.listener = net.createServer(socket => {
            console.log('Client connected to Match');
        
            this.socket = socket;

            this.defineSocketBehaviour(processDataFn);
        });
        
        this.listener.listen(this.port, () => {
        });
    }

    defineSocketBehaviour(processDataFn){
        // Listen for data from the client
        this.socket.on('data', data => {
            data = data.toString();
            console.log('Match received:', data);
            processDataFn(data, this.getSocket);
        });
    
        // Handle the client disconnecting
        this.socket.on('end', () => {
            console.log('Client disconnected');
        });
    }

    getSocket(){
        return this.socket;
    }

    sendToPlayer(message){
        this.socket.write(message);
    }

}

module.exports = Listener;