let chalk = require('chalk');
let commander = require('commander');
let fs = require('fs');

let home = process.env.HOME || process.env.HOMEPATH;
let dataPath = `${home}/.taskino`;

function errLog(err) {
    console.log(`An error occurred: ${err}`);
}

function writeTaskObj(obj) {
    let objString = JSON.stringify(obj);
    try {
        fs.writeFileSync(`${dataPath}/taskObj`, objString, err => {
            errLog(err);
        });
    } catch (err) {
        errLog(err);
    }
}

function writeConfig(conf) {
    console.log('writing config');
    let confString = JSON.stringify(conf);
    try {
        fs.writeFileSync(`${dataPath}/config.json`, confString, err => {
            errLog(err);
        });
    } catch (err) {
        errLog(err);
    }
}

function chalkWrite(color, def, text) {
    let colorText = undefined;
    try {
        colorText = eval(`chalk.${color}(text)`);
    } catch (err) {
        // invalid chalk color specified in config. switch to default
        colorText = eval(`chalk.${def}(text)`);
    }
    console.log(colorText);
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
        writeTaskObj(defTaskObj);
        let defConfig = {
            low: 'green',
            med: 'yellow',
            high: 'red'
        };
        writeConfig(defConfig);
    }
}

// load the taskObj from taskObj.json in the .taskino directory
function getTaskObj() {
    try {
        let content = fs.readFileSync(`${dataPath}/taskObj`, {encoding: 'utf-8'});
        return JSON.parse(content);
    } catch (err) {
        errLog(err);
    }
}

// writes the task into taskObj.json with the appropriate priority
function addTask(taskPriority, task) {
    let taskObj = getTaskObj();
    taskObj[taskPriority].push(task);
    writeTaskObj(taskObj);
}

// displays all priorities of task, in color
function displayTasks() {
    let titleStyle = '.bold';
    try {
        let taskObj = getTaskObj();
        let config = JSON.parse(fs.readFileSync(`${dataPath}/config.json`, {encoding: 'utf-8'}));
        // display high
        chalkWrite(`${config.high}${titleStyle}`, `red${titleStyle}`, 'HIGH PRIORITY');
        let highPriority = taskObj.highPriority;
        for (let i=0; i<highPriority.length; i++) {
            chalkWrite(config.high, 'red', `${i+1}. ${highPriority[i]}`);
        }
        // display med
        chalkWrite(`${config.med}${titleStyle}`, `yellow${titleStyle}`, 'MED PRIORITY');
        let medPriority = taskObj.medPriority;
        for (let k=0; k<medPriority.length; k++) {
            chalkWrite(config.med, 'yellow', `${highPriority.length + k+1}. ${medPriority[k]}`);
        }
        // display low
        chalkWrite(`${config.low}${titleStyle}`, `green${titleStyle}`, 'LOW PRIORITY');
        let lowPriority = taskObj.lowPriority;
        for (let k=0; k<lowPriority.length; k++) {
            chalkWrite(config.low, 'green', `${highPriority.length + medPriority.length +  k+1}. ${lowPriority[k]}`);
        }
    } catch (err) {
        errLog(err);
    }
}

// removes the given task from taskObj
function removeTaskByNum(num) {
    let taskObj = getTaskObj();
    if (num <= taskObj.highPriority.length) {
        taskObj.highPriority.splice(num - 1, 1); 
    } else if (num <= (taskObj.highPriority.length + taskObj.medPriority.length)) {
        taskObj.medPriority.splice(num - taskObj.highPriority.length - 1, 1);
    } else {
        taskObj.lowPriority.splice(num - taskObj.highPriority.length - taskObj.medPriority.length - 1, 1);
    }
    writeTaskObj(taskObj);
}

// command for adding low-priority tasks
commander
    .command('addl <task>')
    .description('Add a low priority task')
    .action(function(task, command) {
        initializeTaskData();
        addTask('lowPriority', task);
        console.log(`Added ${task}`);
    });

// command for adding medium-priority tasks
commander
    .command('addm <task>')
    .description('Add a medium priority task')
    .action(function(task, command) {
        initializeTaskData();
        addTask('medPriority', task);
        console.log(`Added ${task}`);
    });

// command for adding high-priority tasks
commander
    .command('addh <task>')
    .description('Add a medium priority task')
    .action(function(task, command) {
        initializeTaskData();
        addTask('highPriority', task);
        console.log(`Added ${task}`);
    });

// command for displaying tasks
commander
    .command('show')
    .description('Display current tasks, sorted by priority')
    .action(function(task, command) {
        initializeTaskData();
        displayTasks();
    });

// command for completing tasks
commander
    .command('complete <task>')
    .description('Complete the given task')
    .action(function(task, command) {
        initializeTaskData();
        removeTaskByNum(task);
    });

commander.parse(process.argv);
