const taskForm = document.querySelector('.js-taskForm'),
  taskInput = taskForm.querySelector('input'),
  todoList = document.querySelector('.js-todoList'),
  pendingList = document.querySelector('.js-pendingList'),
  finishedList = document.querySelector('.js-finishedList');

const TODO_LS = 'TODO',
  PENDING_LS = 'PENDING',
  FINISHED_LS = 'FINISHED';

let todos = [],
  tasks = [],
  fnTasks = [];

function getId() {
  const id = Date.now()+Math.ceil(Math.random()*100);
  return id;
}

function saveTasks(key, array) {
  localStorage.setItem(key, JSON.stringify(array));
}

// function saveTasks() {
//   localStorage.setItem(PENDING_LS, JSON.stringify(tasks));
// }

// function saveFnTasks() {
//   localStorage.setItem(FINISHED_LS, JSON.stringify(fnTasks));
// }

function paintTodo(text) {
  const newId = getId();
  const li = document.createElement('li');
  const delBtn = document.createElement('button');
  const startBtn = document.createElement('button');
  delBtn.innerHTML = '❌';
  delBtn.addEventListener('click', deleteTodo);
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
  pendingDelBtn.addEventListener('click', deletePending);
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
  tasks.push(taskObj);
  saveTasks(PENDING_LS, tasks);
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
  fnDelBtn.addEventListener('click', deleteFinished);
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
  fnTasks.push(fnObj);
  saveTasks(FINISHED_LS, fnTasks);
}

function moveToFinish(e) {
  const moveBtn = e.target;
  const moveLi = moveBtn.parentNode;
  const moveTasks = tasks.filter(function(task) {
    return task.id === parseInt(moveLi.id);
  });
  const moveText = moveTasks[0].text;
  const startTimeStamp = moveTasks[0].timeStamp;
  paintFinished(moveText, startTimeStamp);
  deletePending(e);
}

function todoToPending(e) {
    const startTime = Date.now();
    const moveTdBtn = e.target;
    const moveTdLi = moveTdBtn.parentNode;
    const moveTdTasks = todos.filter(function(task) {
      return task.id === parseInt(moveTdLi.id);
    });
    const moveTdText = moveTdTasks[0].text;
    paintPending(moveTdText);
    deleteTodo(e);
  }

function finishedToPending(e) {
  const moveFnBtn = e.target;
  const moveFnLi = moveFnBtn.parentNode;
  const moveFnTasks = fnTasks.filter(function(task) {
    return task.id === parseInt(moveFnLi.id);
  });
  const moveFnText = moveFnTasks[0].text;
  paintPending(moveFnText);
  deleteFinished(e);
}

function handleSubmit(e) {
  e.preventDefault();
  const currentValue = taskInput.value;
  paintTodo(currentValue);
  taskInput.value = '';
}

function deleteTodo(e) {
  const btn = e.target;
  const li = btn.parentNode;
  todoList.removeChild(li);

  const cleanTodos = todos.filter(function(task) {
    return task.id !== parseInt(li.id);
  });
  todos = cleanTodos;
  saveTasks(TODO_LS, todos);
}

function deletePending(e) {
  const btn = e.target;
  const li = btn.parentNode;
  pendingList.removeChild(li);

  const cleanTasks = tasks.filter(function(task) {
    return task.id !== parseInt(li.id);
  });
  tasks = cleanTasks;
  saveTasks(PENDING_LS, tasks);
}

function deleteFinished(e) {
  const fnBtn = e.target;
  const fnDelLi = fnBtn.parentNode;
  finishedList.removeChild(fnDelLi);
  const cleanFnTasks = fnTasks.filter(function(task) {
    return task.id !== parseInt(fnDelLi.id);
  });
  fnTasks = cleanFnTasks;
  saveTasks(FINISHED_LS, fnTasks);
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
