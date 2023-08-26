class Poll{
    constructor(){

    }

    static async variablePoll(getVariable){
        while(true){
            await new Promise(r => setTimeout(r, 1000));
            var variable = getVariable();
            if(variable != undefined){
                return variable
            }
        }
    }
}

module.exports = Poll;