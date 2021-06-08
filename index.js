import { existsSync, writeFileSync, readFileSync } from 'fs';
import readlineSync from 'readline-sync';
import chalk from 'chalk';

if (!existsSync('./data.json')){
  writeFileSync('./data.json', JSON.stringify({taskList:[]}))
}

const data = JSON.parse(readFileSync('./data.json'));
const taskList = data.taskList; 
const pomoBuffer = [];

function addTask(){
  const answer = readlineSync.question('What to-do would you like to add?');
  const task = {
    done: false,
    description: answer,
    pomos: 0
  }
  if (answer === "") return;
  taskList.push(task);
  writeFileSync('./data.json', JSON.stringify({taskList}))
}

function listTasks(){
  if (taskList.length === 0){
    console.log("There are no tasks to list");
    return;
  } 
  console.log("These are your to-dos:")
  taskList.forEach(task=>console.log(formatTask(task)));
}

function checkTask(){
  if (taskList.length === 0){
    console.log("There are no tasks to check/uncheck");
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
  
  if (index>=0) taskList.splice(index,1);
  writeFileSync('./data.json', JSON.stringify({taskList}));
}

function pomoTask(){
  if (taskList.length === 0){
    console.log("There are no tasks to add a pomodoro to");
    return;
  } 

  const options = formatTaskList(taskList);
  const index = readlineSync.keyInSelect(options, 'What to-do would you like to start a pomodoro for? ');

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

const colors = {
  names:["red", "green", "yellow", "blue", "magenta"],
  i: 0,
  next(){
    if (this.i === this.names.length - 1){
      this.i = 0;
    } else {
      this.i = this.i+1;
    }
    return this.names[this.i];
  }
}


let exit = false;
while (!exit){
  console.log(chalk[colors.next()]("===================================="));
  const options = ['add', 'list', 'check', 'remove', 'pomodoro'];
  const index = readlineSync.keyInSelect(options, 'Pick an action from the list above');
  
  if (pomoBuffer.length > 0){
    const timeDif = Date.now() - pomoBuffer[0].timeStamp;
    if (timeDif > 1000){
      const ref = pomoBuffer.shift();
      ref.task.pomos+=1;
      console.log("Pomodoro for "+ref.task.description+" is done");
      writeFileSync('./data.json', JSON.stringify({taskList}));
    } else {
      for (let i=0; i<pomoBuffer.length; i++){
        console.log(`You have an active pomodoro timer for ${ref.task.description}
with ${timeDif/1000/60} minutes to go.`)
      }
    }
  }

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
