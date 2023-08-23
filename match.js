const net = require('net');
const Listener = require('./listener.js')


class Match{

    connectionId;
    portPlayer1;
    portPlayer2;
    listenerPlayer1;
    listenerPlayer2;
    isPlayer1Turn = true;
    lastWord = ""

    constructor(connectionId, portPlayer1, portPlayer2){
        this.connectionId = connectionId;
        this.portPlayer1 = portPlayer1;
        this.portPlayer2 = portPlayer2;
        this.listenerPlayer1 = new Listener(this.portPlayer1);
        this.listenerPlayer2 = new Listener(this.portPlayer2);
    }

    getPortPlayer1(){return this.portPlayer1};

    getPortPlayer2(){return this.portPlayer2};

    processDataFn(data, socket, peerSocket){
        if (!checkWordValidity(data)){
            socket.write("Invalid word");
        }else{
            peerSocket.write(data);
        }
        
    }

    checkWordValidity(data){
        return true
    }

    async serve(){
        this.listener.serve()
    }
}

module.exports = Match;