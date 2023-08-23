const Match = require('./match.js');
const StringFormatter = require('./stringFormater.js');

class Server{
    serverId;
    matches = [];
    portStart = 10000;
    lastPort = this.portStart - 1;
    socket;
    clientIds = [];
    clientsLookingForMatch = [];

    constructor(){

    }

    async startListening(port=9999){

        // const net = require('net');

        // const server = net.createServer(socket => {
        //     console.log('Client connected');
        //     this.defineSocketBehaviour(socket);

        // });

        // server.listen(port, () => {
        //     console.log('Server listening on port', port);
        // });

        const net = require('net');

        const server = net.createServer(socket => {
            console.log('Client connected');
            this.defineSocketBehaviour(socket);
        });

        server.listen(port, () => {
            console.log('Server listening on port', port);
        });

    }

    defineSocketBehaviour(socket){
        // Listen for data from the client
        socket.on('data', data => {
            data = data.toString();
            console.log('Received from client:', data);
            switch (data){
                case 'play':
                    this.addPlayerToMatchMakingList(socket);
            }
        });

        // Handle the client disconnecting
        socket.on('end', () => {
            console.log('Client disconnected');
        });
    }

    addPlayerToMatchMakingList(playerSocket){
        this.clientsLookingForMatch.push(playerSocket);
    }

    createMatch(player1Socket, player2Socket){
        
        // create match
        console.log('Create Match');
        var newMatch = new Match(this.generateMatchId(), this.lastPort+1, this.lastPort+2)
        this.matches.push(newMatch);
        console.log(newMatch.portPlayer1);
        console.log(newMatch.portPlayer2);
        console.log('Match Created');       
        // inform client on the port of match
        player1Socket.write(StringFormatter.format("Connect To Match in Port {}",newMatch.getPortPlayer1()));
        player2Socket.write(StringFormatter.format("Connect To Match in Port {}",newMatch.getPortPlayer2()));

        console.log('Player informed on match');
        // update states
        this.lastPort += 2;
    }

    generateMatchId(){
        return 1;
    }

    async serve(){
        while(true){
            await new Promise(r => setTimeout(r, 2000));
            // perform match making
            var players = this.pick2Players();
            if (players != null){
                var [player1Socket, player2Socket] = players;
                this.createMatch(player1Socket, player2Socket);
            }
        }
    }

    pick2Players(){
        if (this.clientsLookingForMatch.length >= 2){
            var player1 = this.clientsLookingForMatch.pop();
            var player2 = this.clientsLookingForMatch.pop();

            return [player1, player2];
        }
        return null;
    }
}

server = new Server();
server.startListening();
server.serve();