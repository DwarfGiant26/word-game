class Listener{
    port;
    listener;
    socket;
    peerSocket;
    constructor(port){
        this.port = port;
    }

    serve(processDataFn){
        this.listener = net.createServer(socket => {
            console.log('Client connected');
        
            this.socket = socket;
        });
        
        this.listen(port, () => {
            console.log('Server listening on port', port);
        });

        defineSocketBehaviour(processDataFn);
    }

    defineSocketBehaviour(processDataFn){
        // Listen for data from the client
        this.socket.on('data', data => {
            data = data.toString();
            console.log('Received from client:', data);
            processDataFn(data, this.socket, this.peerSocket);
        });
    
        // Handle the client disconnecting
        this.socket.on('end', () => {
            console.log('Client disconnected');
        });
    }
}

module.exports = Listener;