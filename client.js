class Client{
  	constructor(){

  	}
	
	sendWordToServer(word){

	}

	connectToServer(port=9999){
		const net = require('net');

		const client = new net.Socket();

		client.connect(port, 'localhost', () => {
			console.log('Connected to server');

			// Send data to the server
			const message = 'Hello from client!';
			client.write(message);

			// Close the connection after sending the message
			client.end();
		});

		client.on('close', () => {
			console.log('Connection closed');
		});


	}

	async serve(){
		const readline = require('readline').createInterface({
  			input: process.stdin,
			output: process.stdout
		});
		//connect to server
		//determine who goes first
		while(true){
			console.log("Opponent's word:\n");
			//var word = await readline.question('Enter your word:');
			var word = await new Promise(resolve => readline.question('Enter your word:', resolve));
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
// Client.serve();
