import { existsSync, writeFileSync, readFileSync } from 'fs';
import readlineSync from 'readline-sync';

if (!existsSync('./data.json')){
  writeFileSync('./data.json', JSON.stringify({taskList:[]}))
}

const data = JSON.parse(readFileSync('./data.json'));
const taskList = data.taskList; 
const pomoBuffer = [];

function addTask(){
  const answer = readlineSync.question('What do you want to do?');
  const task = {
    done: false,
    description: answer,
    pomos: 0
  }
  taskList.push(task);
  writeFileSync('./data.json', JSON.stringify({taskList}))
}

function listTasks(){
  if (taskList.length === 0){
    console.log("There are no tasks to list");
    return;
  } 
  taskList.forEach(task=>console.log(formatTask(task)));
}

function checkTask(){
  if (taskList.length === 0){
    console.log("There are no tasks to check");
    return;
  } 

  const options = formatTaskList(taskList);
  const index = readlineSync.keyInSelect(options, 'What do you want to check/uncheck? ');
  taskList[index].done = !taskList[index].done;
  writeFileSync('./data.json', JSON.stringify({taskList}));
}

function removeTask(){
  if (taskList.length === 0){
    console.log("There are no tasks to remove");
    return;
  } 
  const options = formatTaskList(taskList);
  const index = readlineSync.keyInSelect(options, 'What do you want to remove? ');
  
  taskList.splice(index,1);
  writeFileSync('./data.json', JSON.stringify({taskList}))
}

function pomoTask(){
  if (taskList.length === 0){
    console.log("There are no tasks to add a pomodoro to");
    return;
  } 

  const options = formatTaskList(taskList);
  const index = readlineSync.keyInSelect(options, 'What todo do you want to have a pomodoro for? ');

  console.log(`Pomodoro for ${taskList[index].description} is now running`);
  pomoBuffer.push({task: taskList[index], timeStamp: Date.now() });
}

function formatTask(task){
  let pomoStr = "";
  for(let i=0; i<task.pomos; i++){
    pomoStr += "🍅";
  }
  return(`${task.done?"🟢":"🔴"} ${task.description} ${pomoStr}`);
}

function formatTaskList(taskList){
  return(taskList.map(task=>formatTask(task)));
}

let exit = false;
while (!exit){
  if (pomoBuffer.length > 0){
    if (Date.now() - pomoBuffer[0].timeStamp > 25*60*1000){
      const local = pomoBuffer.shift();
      local.task.pomos+=1;
      writeFileSync('./data.json', JSON.stringify({taskList}));
    }
  }
  const options = ['add', 'list', 'check', 'remove', 'pomodoro'];
  const index = readlineSync.keyInSelect(options, 'O que vc quer fazer? ');

  switch (options[index]){
    case "add" : addTask(); break;
    case "list" : listTasks(); break;
    case "check" : checkTask(); break;
    case "remove" : removeTask(); break;
    case "pomodoro": pomoTask(); break;
    default : {
      writeFileSync('./data.json', JSON.stringify({taskList}));
      exit=true;
    }
  }
}
