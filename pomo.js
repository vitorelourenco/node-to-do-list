import { writeFileSync, readFileSync } from 'fs';
import chalk from 'chalk';

const args = process.argv.slice(2);

setTimeout(()=>{
  const data = JSON.parse(readFileSync('./data.json'));
  const taskList = data.taskList; 
  taskList.forEach((task)=>{
    if (task.description === args[0]){
      task.pomos += 1;
      writeFileSync('./data.json', JSON.stringify({taskList}));
      console.log(chalk.red(`Pomodoro for ${task.description} is done. The program is still running`));
      console.log(":");
    }
  });

}, 25*60*1000);
