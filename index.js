function addTask(){
  const answer = readlineSync.question('What do you want to do?');
  const task = {
    done: false,
    description: answer
  }
  taskList.push(task);
}

function listTasks(){
  if (taskList.length === 0){
    console.log("There are no tasks to list");
    return;
  } 
  console.log("===========================");
  taskList.forEach(task=>console.log(formatTask(task)));
  console.log("===========================");
}

function checkTask(){
  if (taskList.length === 0){
    console.log("There are no tasks to check");
    return;
  } 
  var readlineSync = require('readline-sync'),
    options = formatTaskList(taskList),
    index = readlineSync.keyInSelect(options, 'What do you want to check/uncheck? ');
  taskList[index].done = !taskList[index].done;
}

function removeTask(){
  if (taskList.length === 0){
    console.log("There are no tasks to remove");
    return;
  } 
  var readlineSync = require('readline-sync'),
    options = formatTaskList(taskList),
    index = readlineSync.keyInSelect(options, 'What do you want to remove? ');
  taskList.splice(index,1);
}

function formatTask(task){
  return(`${task.done?"🟢":"🔴"} ${task.description}`);
}

function formatTaskList(taskList){
  return(taskList.map(task=>formatTask(task)));
}

const taskList = [];
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

