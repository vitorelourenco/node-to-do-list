import { existsSync, writeFileSync, readFileSync } from 'fs';
import readlineSync from 'readline-sync';
import chalk from 'chalk';
import {spawn} from 'child_process';

if (!existsSync('./data.json')){
  writeFileSync('./data.json', JSON.stringify({taskList:[]}))
}

console.log(chalk.greenBright("||==========||"));
console.log(chalk.greenBright("||=TERMINAL=||"))
console.log(
  chalk.greenBright("||"),
  chalk.magenta("T"),
  chalk.red("O"),
  chalk.yellow("D"),
  chalk.blue("O"),
  chalk.greenBright(" ||")
);
console.log(chalk.greenBright("||==========||"));


function addTask(taskList){
  const answer = readlineSync.question('What to-do would you like to add?');
  const exists = taskList.reduce((acc,elem)=>acc||elem.description===answer, false)
  if (exists){
    console.log('This to-do already exists');
    return;
  }
  const task = {
    done: false,
    description: answer,
    pomos: 0
  }
  if (answer === "") return;
  taskList.push(task);
  writeFileSync('./data.json', JSON.stringify({taskList}))
}

function listTasks(taskList){
  if (taskList.length === 0){
    console.log("There are no tasks to list");
    return;
  } 
  console.log("These are your to-dos:")
  taskList.forEach(task=>console.log(formatTask(task)));
}

function checkTask(taskList){
  if (taskList.length === 0){
    console.log("There are no tasks to check/uncheck");
    return;
  } 

  const options = formatTaskList(taskList);
  const index = readlineSync.keyInSelect(options, 'What do you want to check/uncheck? ');
  
  taskList[index].done = !taskList[index].done;
  writeFileSync('./data.json', JSON.stringify({taskList}));
}

function removeTask(taskList){
  if (taskList.length === 0){
    console.log("There are no tasks to remove");
    return;
  } 
  const options = formatTaskList(taskList);
  const index = readlineSync.keyInSelect(options, 'What do you want to remove? ');
  
  if (index>=0) taskList.splice(index,1);
  writeFileSync('./data.json', JSON.stringify({taskList}));
}

function pomoTask(taskList){
  if (taskList.length === 0){
    console.log("There are no tasks to add a pomodoro to");
    return;
  } 

  const options = formatTaskList(taskList);
  const index = readlineSync.keyInSelect(options, 'What to-do would you like to start a pomodoro for? ');

  console.log(`Pomodoro for ${taskList[index].description} is now running`);

  const child = spawn('node', ['pomo.js', `${taskList[index].description}`], {
    detached: true,
    stdio: "inherit"
  });

  child.unref();
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

  const data = JSON.parse(readFileSync('./data.json'));
  const taskList = data.taskList; 

  switch (options[index]){
    case "add" : addTask(taskList); break;
    case "list" : listTasks(taskList); break;
    case "check" : checkTask(taskList); break;
    case "remove" : removeTask(taskList); break;
    case "pomodoro": pomoTask(taskList); break;
    default : exit=true;
  }
}
