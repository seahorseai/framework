import { spawn } from 'child_process';

// Function to execute a command and log the output in real-time
function executeCommand(command: string, args: string[]) {
  return new Promise<void>((resolve, reject) => {
    const childProcess = spawn(command, args, { stdio: 'inherit' });
    childProcess.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`${command} exited with code ${code}`));
      } else {
        resolve();
      }
    });
  });
}

// Main function to handle NestJS and Angular CLI commands
async function runCLI() {
  const args = process.argv.slice(2); // Get CLI arguments

  // Example use-case: `node cli.js new project-name` will run both Nest and Angular's "new" command
  if (args[0] === 'new' && args[1]) {
    const projectName = args[1];
    try {
      console.log(`Creating a new NestJS project: ${projectName}`);
      await executeCommand('nest', ['new', `${projectName}-backend`]);

      console.log(`Creating a new Angular project: ${projectName}`);
      await executeCommand('ng', ['new', `${projectName}-frontend`, '--no-standalone']);

      console.log('Both projects created successfully!');
    } catch (error) {
      console.error(`Error: ${error.message}`);
    }
  } else {
    console.log('Usage: node cli.js new <project-name>');
  }
}

// Run the CLI
runCLI();


