function addTask(){
  const answer = readlineSync.question('What do you want to do?');
  const task = {
    done: false,
    description: answer
  }
  tasks.push(task);
}

function listTasks(){
  console.log("===========================");
  tasks.forEach(task=>console.log(`${task.done?"🟢":"🔴"} ${task.description}` ));
  console.log("===========================");

}

function checkTask(){
  console.log('c');

}

function removeTask(){
  console.log('d');

}

const tasks = [];
let exit = false;
while (!exit){
  var readlineSync = require('readline-sync'),
    options = ['add', 'list', 'check', 'remove'],
    index = readlineSync.keyInSelect(options, 'O que vc quer fazer? ');

  switch (options[index]){
    case "add" : addTask(); break;
    case "list" : listTasks(); break;
    case "check" : checkTask(); break;
    case "remove" : removeTask(); break;
    default : exit=true;
  }
}

