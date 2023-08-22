class Client{

	connectionToServer;
	net = require('net');
	isPlaying = false;

  	constructor(){

  	}
	
	sendWordToServer(message){
		this.connectionToServer.write(message);
	}

	connectToServer(port=9999){

		this.connectionToServer = new this.net.Socket();

		this.connectionToServer.connect(port, 'localhost', () => {
			console.log('Connected to server');

			// Send data to the server
			const message = 'Hello from client!';
			this.connectionToServer.write(message);
		});

		this.connectionToServer.on('Match created!', () => {
			console.log('Match is created');
		});

		this.connectionToServer.on('close', () => {
			console.log('Connection closed');
		});


	}

	endConnection(){
		this.connectionToServer.end();
	}

	getOutput(){
		if (this.isPlaying){
			return "Opponent's word:\n";
		}
		return "Welcome";
	}

	processInput(word){
		switch (word){
			case 'play':
				this.sendWordToServer('play');
		}
	}

	async serve(){
		const readline = require('readline').createInterface({
  			input: process.stdin,
			output: process.stdout
		});
		
		//determine who goes first
		while(true){
			console.log(this.getOutput());
			var word = await new Promise(resolve => readline.question('Enter your word:', resolve));
			
			this.processInput(word);

			// Add an exit condition for the loop, for example:
			if (word === 'exit') {
				break;
			}
		}
	}

}

client = new Client();
client.connectToServer();
// run client
client.serve();
// client.endConnection();
