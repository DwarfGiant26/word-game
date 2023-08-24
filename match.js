const net = require('net');
const Listener = require('./listener.js')


class Match{

    connectionId;
    portPlayer1;
    portPlayer2;
    listenerPlayer1;
    listenerPlayer2;
    isPlayer1Turn = true;
    lastWord = "";

    constructor(connectionId, portPlayer1, portPlayer2){
        this.connectionId = connectionId;
        this.portPlayer1 = portPlayer1;
        this.portPlayer2 = portPlayer2;
        this.listenerPlayer1 = new Listener(this.portPlayer1);
        this.listenerPlayer2 = new Listener(this.portPlayer2);
    }

    getPortPlayer1(){return this.portPlayer1};

    getPortPlayer2(){return this.portPlayer2};

    processDataFn(data, socket, otherPlayerNo){
        if (!this.checkWordValidity(data)){
            socket.write("Invalid word");
        }else{
            this.sendToPlayer(otherPlayerNo, data);
        }
    }

    sendToPlayer(playerNo, data){
        if(playerNo == 1){
            this.listenerPlayer1.sendToPlayer("Opponent's word:"+data);
        }else{
            this.listenerPlayer2.sendToPlayer("Opponent's word:"+data);
        }
    }

    checkWordValidity(data){
        return true;
    }

    async serve(){
        this.listenerPlayer1.serve((data, socket)=>{this.processDataFn(data, socket, 2)});
        this.listenerPlayer2.serve((data, socket)=>{this.processDataFn(data, socket, 1)});
    }
}

module.exports = Match;