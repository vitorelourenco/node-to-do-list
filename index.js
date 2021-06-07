var fs = require('fs');

if (!fs.existsSync('./data.json')){
  fs.writeFileSync('./data.json', JSON.stringify({taskList:[]}))
}

var data = JSON.parse(fs.readFileSync('./data.json'));
const taskList = data.taskList; 

function addTask(){
  console.log("===========================");
  const answer = readlineSync.question('What do you want to do?');
  const task = {
    done: false,
    description: answer
  }
  taskList.push(task);
  fs.writeFileSync('./data.json', JSON.stringify({taskList}))
  console.log("===========================");
}

function listTasks(){
  console.log("===========================");
  if (taskList.length === 0){
    console.log("There are no tasks to list");
    console.log("===========================");
    return;
  } 
  console.log("===========================");
  taskList.forEach(task=>console.log(formatTask(task)));
  console.log("===========================");
}

function checkTask(){
  console.log("===========================");
  if (taskList.length === 0){
    console.log("There are no tasks to check");
    console.log("===========================");
    return;
  } 
  var readlineSync = require('readline-sync'),
    options = formatTaskList(taskList),
    index = readlineSync.keyInSelect(options, 'What do you want to check/uncheck? ');
  
  if (index===0) return;

  taskList[index].done = !taskList[index].done;
  console.log("===========================");
}

function removeTask(){
  console.log("===========================");
  if (taskList.length === 0){
    console.log("There are no tasks to remove");
    console.log("===========================");
    return;
  } 
  var readlineSync = require('readline-sync'),
    options = formatTaskList(taskList),
    index = readlineSync.keyInSelect(options, 'What do you want to remove? ');
  taskList.splice(index,1);
  console.log("===========================");
}

function formatTask(task){
  return(`${task.done?"🟢":"🔴"} ${task.description}`);
}

function formatTaskList(taskList){
  return(taskList.map(task=>formatTask(task)));
}

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

