let chalk = require('chalk');
let commander = require('commander');

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


commander.parse(process.argv);


