const taskForm = document.querySelector('.js-taskForm'),
  taskInput = taskForm.querySelector('input'),
  todoList = document.querySelector('.js-todoList'),
  pendingList = document.querySelector('.js-pendingList'),
  finishedList = document.querySelector('.js-finishedList');

const TODO_LS = 'TODO',
  PENDING_LS = 'PENDING',
  FINISHED_LS = 'FINISHED';

let todos = [],
  pendings = [],
  finishedes = [];

function getId() {
  const id = Date.now()+Math.ceil(Math.random()*100);
  return id;
}

function saveTasks(key, array) {
  localStorage.setItem(key, JSON.stringify(array));
}

function deleteTask(e, ul, key, array) {
    const btn = e.target;
    const li = btn.parentNode;
    const cleanTasks = array.filter(function(task) {
      return task.id !== parseInt(li.id);
    });
    
    ul.removeChild(li);
    array = cleanTasks;
    saveTasks(key, array);
  }

function paintTodo(text) {
  const newId = getId();
  const li = document.createElement('li');
  const delBtn = document.createElement('button');
  const startBtn = document.createElement('button');
  delBtn.innerHTML = '❌';
  delBtn.addEventListener('click', (e)=> deleteTask(e, todoList, TODO_LS, todos));
  startBtn.innerHTML = '🔥';
  startBtn.addEventListener('click', todoToPending);
  const span = document.createElement('span');
  span.innerText = text;
  li.appendChild(span);
  li.appendChild(delBtn);
  li.appendChild(startBtn);
  li.id = newId;
  todoList.appendChild(li);
  const todoObj = {
    text: text,
    id: newId,
  };
  todos.push(todoObj);
  saveTasks(TODO_LS, todos);
}

function paintPending(text) {
  const newId = getId();
  const pendingLi = document.createElement('li');
  const pendingDelBtn = document.createElement('button');
  const finishBtn = document.createElement('button');
  const span = document.createElement('span');
  pendingDelBtn.innerHTML = '❌';
  pendingDelBtn.addEventListener('click',  (e)=> deleteTask(e, pendingList, PENDING_LS, pendings));
  finishBtn.innerHTML = '✅';
  finishBtn.addEventListener('click', moveToFinish);
  span.innerText = text;
  pendingLi.appendChild(span);
  pendingLi.appendChild(pendingDelBtn);
  pendingLi.appendChild(finishBtn);
  pendingLi.id = newId;
  pendingList.appendChild(pendingLi);
  
  const taskObj = {
    text: text,
    timeStamp: Date.now(),
    id: newId,
  };
  pendings.push(taskObj);
  saveTasks(PENDING_LS, pendings);
}

function paintFinished(text, startTimeStamp) {
  const newId = getId();
  const fnLi = document.createElement('li');
  const fnDelBtn = document.createElement('button');
  const fnCancelBtn = document.createElement('button');
    const fnSpan = document.createElement('span');
    const endTimeStamp = Date.now();
    const elapsedTimeObj = new Date(endTimeStamp- startTimeStamp-32400000);
    const hours = elapsedTimeObj.getHours();
    const minutes = elapsedTimeObj.getMinutes();
    const seconds = elapsedTimeObj.getSeconds();
    const elapsedTime = `[${hours}시간 ${minutes}분 ${seconds}초]`;
    
  fnDelBtn.innerHTML = '❌';
  fnDelBtn.addEventListener('click',  (e)=> deleteTask(e, finishedList, FINISHED_LS, finishedes));
  fnCancelBtn.innerHTML = '⛔';
  fnCancelBtn.addEventListener('click', finishedToPending);

  fnSpan.innerText = `${elapsedTime} ${text}`;
  fnLi.appendChild(fnSpan);
  fnLi.appendChild(fnDelBtn);
  fnLi.appendChild(fnCancelBtn);

  fnLi.id = newId;
  finishedList.appendChild(fnLi);
  const fnObj = {
    text: text,
    elapsedTime:  elapsedTime,
    id: newId,
  };
  finishedes.push(fnObj);
  saveTasks(FINISHED_LS, finishedes);
}

function moveToFinish(e) {
  const moveBtn = e.target;
  const moveLi = moveBtn.parentNode;
  const moveTasks = pendings.filter(function(task) {
    return task.id === parseInt(moveLi.id);
  });
  const moveText = moveTasks[0].text;
  const startTimeStamp = moveTasks[0].timeStamp;
  paintFinished(moveText, startTimeStamp);
  deleteTask(e, pendingList, PENDING_LS, pendings);
}

function todoToPending(e) {
    const moveTdBtn = e.target;
    const moveTdLi = moveTdBtn.parentNode;
    const moveTdTasks = todos.filter(function(task) {
      return task.id === parseInt(moveTdLi.id);
    });
    const moveTdText = moveTdTasks[0].text;
    paintPending(moveTdText);
    deleteTask(e, todoList, TODO_LS, todos);
  }

function finishedToPending(e) {
  const moveFnBtn = e.target;
  const moveFnLi = moveFnBtn.parentNode;
  const movefinishedes = finishedes.filter(function(task) {
    return task.id === parseInt(moveFnLi.id);
  });
  const moveFnText = movefinishedes[0].text;
  paintPending(moveFnText);
  deleteTask(e, finishedList, FINISHED_LS, finishedes);
}

function handleSubmit(e) {
  e.preventDefault();
  const currentValue = taskInput.value;
  paintTodo(currentValue);
  taskInput.value = '';
}

function loadTasks() {
  const loadedTodo = localStorage.getItem(TODO_LS);
  const loadedPending = localStorage.getItem(PENDING_LS);
  const loadedFinished = localStorage.getItem(FINISHED_LS);
  if (loadedPending !== null) {
    const parsedPending = JSON.parse(loadedPending);
    parsedPending.forEach(function(task) {
      paintPending(task.text);
    });
  }
  if (loadedFinished !== null) {
    const parsedFinished = JSON.parse(loadedFinished);
    parsedFinished.forEach(function(finished) {
      paintFinished(finished.text);
    });
  }
  if (loadedTodo !== null) {
    const parsedTodo = JSON.parse(loadedTodo);
    parsedTodo.forEach(function(todo) {
      paintTodo(todo.text);
    });
  }
}
function init() {
  loadTasks();
  taskForm.addEventListener('submit', handleSubmit);
}

init();
