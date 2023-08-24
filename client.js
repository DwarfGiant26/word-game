const StringFormatter = require('./stringFormater.js');
net = require('net');
const Poll = require('./Poll.js');

class Client{

	connectionToServer;
	isPlaying = false;
	connectionToMatch;
	isMyTurn;
	output;
	isInputMode=true;

  	constructor(){

  	}
	
	sendWordToServer(message){
		this.connectionToServer.write(message);
	}

	sendWordToMatch(message){
		this.connectionToMatch.write(message);
	}

	setIsInputMode(value){
		this.isInputMode = value
	}

	connectToServer(port=9999){

		this.connectionToServer = new net.Socket();

		this.connectionToServer.connect(port, 'localhost', () => {
		});

		this.connectionToServer.on('close', () => {
			console.log('Connection closed');
		});

		this.connectionToServer.on('data', (data) => {
			
			data = data.toString()
			
			this.output = data;

			console.log(StringFormatter.format('SF {}', this.output));
			
			var match = data.match(/match (?<port>\d+), (?<playerNo>\d)/)
			if (match){
				this.connectToMatch(match.groups.port);
				if(match.groups.playerNo == 1){
					this.isMyTurn = true;
				}else{
					this.isMyTurn = false;
				}
			}
		});


	}

	connectToMatch(port){
		//connect to the port
		this.connectionToMatch = new net.Socket();
		this.connectionToMatch.connect(port, 'localhost', () => {
			this.output = "Connected to match"

			//update states
			this.isPlaying = true;
		});
		this.connectionToMatch.on('data',(data) => {
			data = data.toString()
			this.output = data;
		});

		
	}

	endConnection(){
		this.connectionToServer.end();
	}

	async serve(){
		const readline = require('readline').createInterface({
  			input: process.stdin,
			output: process.stdout
		});
		
		//determine who goes first
		while(true){
			
			if(this.isInputMode){
				var word = await new Promise(resolve => readline.question(ClientIOLogic.getInputPrompt(this.isPlaying), resolve));
				ClientIOLogic.processInput(this.isPlaying, word, (message)=>{this.sendWordToServer(message)}, (message)=>{this.sendWordToMatch(message)}, (value)=>{this.setIsInputMode(value)});
				console.log(StringFormatter.format("In input: {}", this.isInputMode));
			}else{
				var output = await ClientIOLogic.getOutput(this.isPlaying, this.isMyTurn, ()=>{return this.output});
				if(output != null){
					console.log(output);
				}
				ClientIOLogic.setIsInputModeBasedOnOutput(this.isPlaying, this.isMyTurn, output, (value)=>{this.setIsInputMode(value)});
				console.log(StringFormatter.format("In output: {}", this.isInputMode));
			}
			
			// Add an exit condition for the loop, for example:
			if (word === 'exit') {
				break;
			}
		}
	}

}

class ClientIOLogic{
	static async getOutput(isPlaying, isMyTurn, getOutput){
		// keep checking on the this.output field until it is no longer null
		var toReturn = await Poll.variablePoll(getOutput);
		this.output = undefined;
		return toReturn;
	}

	static setIsInputModeBasedOnOutput(isPlaying, isMyTurn, output, setIsInputMode){
		setIsInputMode(true);
	}

	static processInput(isPlaying, word, sendWordToServer, sendWordToMatch, setIsInputMode){
		if(isPlaying){
			sendWordToMatch(word);
		}else{
			switch (word){
				case 'play':
					sendWordToServer('play');
					break;
				default: // if it doesn't belong to any valid command then don't let it set input mode to false
					return;
			}
		}
		setIsInputMode(false);
	}

	static getInputPrompt(isPlaying){
		if(isPlaying){
			return 'Enter your word:';
		}else{
			return 'Enter command:'
		}
	}
}

client = new Client();
client.connectToServer();
// run client
client.serve();
// client.endConnection();
