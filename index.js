const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'tasks.json');

if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([]));
}

console.log("Welcome to Task Tracker CLI!");

const args = process.argv.slice(2); 
const command = args[0]; 

switch (command) {
  case 'add':
    const taskName = args.slice(1).join(' '); // Combine arguments after 'add' as the task name
    if (!taskName) {
        console.log("Error: Please provide a task name.");
        break;
    }
    const tasks = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    const newTask = {
        id: tasks.length + 1,
        name: taskName,
        status: 'not done', 
    };

    tasks.push(newTask);
    fs.writeFileSync(filePath, JSON.stringify(tasks, null, 2));
    console.log(`Task added: "${taskName}"`);
    break;


//listing
    case 'list':
      const filter = args[1];
      const allTasks = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      if (allTasks.length === 0) {
          console.log("No tasks found. Use 'add' to create a task.");
      } else if (!filter){
          console.log("Here are your tasks:");
          allTasks.forEach(task => {
              console.log(`${task.id}. [${task.status}] ${task.name}`);
          });
      }
      else if (["done","not done","in progress"].includes(filter)){
        const filteredtasks =allTasks.filter(task=> task.status === filter)
        if(filteredtasks.length===0){
          console.log(`no tasks found with filter '${filter}'` );
        }
        else{
          console.log(`here are you ${filter} tasks:`)
          filteredtasks.forEach(task=>{
            console.log(`${task.id}. [${task.status}] ${task.name}`);
          })
        }
      }
      else {        
        console.log("Invalid filter. Use 'done', 'not-done', or 'in-progress'.");
      }
      break;
      case 'update':
        const taskIdToUpdate = parseInt(args[1]);
        const newStatus = args[2];
    
        if (!taskIdToUpdate || !newStatus) {
            console.log("Error: Please provide both task ID and new status.");
            break;
        }
    
        if (!["done", "not done", "in progress"].includes(newStatus)) {
            console.log("Error: Invalid status. Use 'done', 'not done', or 'in progress'.");
            break;
        }
    
        const tasksToUpdate = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        const taskIndex = tasksToUpdate.findIndex(task => task.id === taskIdToUpdate);
    
        if (taskIndex === -1) {
            console.log(`Error: No task found with ID ${taskIdToUpdate}.`);
            break;
        }
    
        // Update the task's status
        tasksToUpdate[taskIndex].status = newStatus;
    
        // Save the updated tasks back to the file
        fs.writeFileSync(filePath, JSON.stringify(tasksToUpdate, null, 2));
        console.log(`Task ${taskIdToUpdate} updated to status: ${newStatus}`);
        break;
    
        case 'delete':
          const taskIdToDelete = parseInt(args[1]);
      
          if (!taskIdToDelete) {
              console.log("Error: Please provide a task ID.");
              break;
          }
      
          const tasksToDelete = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
          const taskIndexToDelete = tasksToDelete.findIndex(task => task.id === taskIdToDelete);
      
          if (taskIndexToDelete === -1) {
              console.log(`Error: No task found with ID ${taskIdToDelete}.`);
              break;
          }
      
          // Remove the task from the array
          tasksToDelete.splice(taskIndexToDelete, 1);
      
          // Save the updated tasks back to the file
          fs.writeFileSync(filePath, JSON.stringify(tasksToDelete, null, 2));
          console.log(`Task ${taskIdToDelete} has been deleted.`);
          break;
      
    default:
        console.log("Invalid command. Use 'add', 'list', or 'delete'.");
        break;
}
