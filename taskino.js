let chalk = require('chalk');
let commander = require('commander');

// setup the default task-holding object
function initializeTaskData() {
    let fs = require('fs');
    let home = process.env.HOME || process.env.HOMEPATH;
    let dataPath = `${home}/.taskino`;
    if (!fs.existsSync(dataPath)) {
        fs.mkdirSync(dataPath);
        let defTaskObj= {
            lowPriority: [],
            medPriority: [],
            highPriority: []
        };
        let serialize = require('node-serialize');
        let objString = serialize.serialize(defTaskObj);
        fs.writeFileSync(`${dataPath}/taskObj`, objString, err => {
            console.log(`An error occurred: ${err}`);
        });
    }
}

commander
    .command('addl <task>')
    .description('Add a low priority task')
    .action(function(task, command) {
        console.log(`Added ${task}`);
    });

commander
    .command('addm <task>')
    .description('Add a medium priority task')
    .action(function(task, command) {
        console.log(`Added ${task}`);
    });

commander
    .command('addh <task>')
    .description('Add a medium priority task')
    .action(function(task, command) {
        console.log(`Added ${task}`);
    });


//commander.parse(process.argv);

module.exports = { setup: initializeTaskData };
