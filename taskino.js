let chalk = require('chalk');
let commander = require('commander');
let fs = require('fs');

let home = process.env.HOME || process.env.HOMEPATH;
let dataPath = `${home}/.taskino`;

function writeTaskObj(objString) {
    fs.writeFileSync(`${dataPath}/taskObj`, objString, err => {
        console.log(`An error occurred: ${err}`);
    });
}

// setup the default task-holding object
function initializeTaskData() {
    if (!fs.existsSync(dataPath)) {
        fs.mkdirSync(dataPath);
        let defTaskObj= {
            lowPriority: [],
            medPriority: [],
            highPriority: []
        };
        let objString = JSON.stringify(defTaskObj);
        writeTaskObj(objString);
    }
}

function addTask(taskPriority, task) {
    try {
        let content = fs.readFileSync(`${dataPath}/taskObj`, {encoding: 'utf-8'});
        let taskObj = JSON.parse(content);
        taskObj[taskPriority].push(task);
        let objString = JSON.stringify(taskObj);
        writeTaskObj(objString);
    } catch (err) {
        console.log(`An error occurred: ${err}`);
    }
}

commander
    .command('addl <task>')
    .description('Add a low priority task')
    .action(function(task, command) {
        addTask('lowPriority', task);
        console.log(`Added ${task}`);
    });

commander
    .command('addm <task>')
    .description('Add a medium priority task')
    .action(function(task, command) {
        addTask('medPriority', task);
        console.log(`Added ${task}`);
    });

commander
    .command('addh <task>')
    .description('Add a medium priority task')
    .action(function(task, command) {
        addTask('highPriority', task);
        console.log(`Added ${task}`);
    });


commander.parse(process.argv);
