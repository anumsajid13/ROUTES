const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;


let tasks = [];
let users = [];


app.use(bodyParser.json());

app.post('/signupUser', (req, res) => {
    const { username, password } = req.body;

    const newUser = {
      id: users.length + 1,
      username,
      password,
    };
  
    users.push(newUser);
    res.status(201).json({ message: 'User created successfull'});
  });
 

  app.post('/signinUser', (req, res) => {
    const { username, password } = req.body;
  
    const user = users.find(u => u.username === username && u.password === password);
  
    if (user) {
      res.json({ message: 'Sign in successful', user });
    } else {
      res.status(401).json({ error: 'Sign in failed' });
    }
  });


app.post('/Addtasks', (req, res) => {
  const { title, description, dueDate, category, priority } = req.body;
  const newTask = {
    title,
    description,
    dueDate,
    category,
    priority,
    iscompleted: false,
    userId: req.user.id,
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
});


app.get('/Filtertasks', (req, res) => {

  const { filterBy } = req.query;
  let filteredTasks = tasks.filter(task => task.userId === req.user.id);

  if (filterBy) {
    filteredTasks = filteredTasks.filter(task => task.category === filterBy || task.priority === filterBy);
  }

  res.json(filteredTasks);
});


app.get('/tasks/:Id', (req, res) => {

  const taskId = parseInt(req.params.Id);
  const task = tasks.find(t => t.userId === req.user.id && t.id === taskId);

  if (task) {
    task.iscompleted = true;
    res.json(task);
  } else {
    res.status(404).json({ error: 'Task was not found' });
  }
});


app.put('/taskspriority/:taskId', (req, res) => {

  const taskId = parseInt(req.params.taskId);
  const { priority } = req.body;
  const task = tasks.find(t => t.userId === req.user.id && t.id === taskId);

  if (task) {
    task.priority = priority;
    res.json(task);
  } else {
    res.status(404).json({ error: 'Task not found' });
  }
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
