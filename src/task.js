const taskForm = document.querySelector('.js-taskForm'),
  taskInput = taskForm.querySelector('input'),
  todoList = document.querySelector('.js-todoList'),
  pendingList = document.querySelector('.js-pendingList'),
  finishedList = document.querySelector('.js-finishedList');

let todos = [],
  pendings = [],
  finishedes = [];

const todo = {
    ul: todoList,
    key: 'TODO',
    array: todos,
  },
  pending = {
    ul: pendingList,
    key: 'PENDING',
    array: pendings,
  },
  finished = {
    ul: finishedList,
    key: 'FINISHED',
    array: finishedes,
  };

function getId(id) {
  let newId = '';
  if (id === undefined) {
    newId = Date.now() + Math.ceil(Math.random() * 100);
  } else {
    return id;
  }
  return newId;
}

function saveTasks(group) {
  localStorage.setItem(group.key, JSON.stringify(group.array));
}

function deleteTask(e, group) {
  const btn = e.target;
  const li = btn.parentNode;
  const ul = group.ul;
  const cleanTasks = group.array.filter(function(task) {
    return task.id !== parseInt(li.id);
  });
  ul.removeChild(li);
  group.array = cleanTasks;
  saveTasks(group);
}

function paintTodo(text, id) {
  const newId = getId(id);
  const li = document.createElement('li');
  const delBtn = document.createElement('button');
  const startBtn = document.createElement('button');
  const span = document.createElement('span');

  delBtn.innerHTML = '❌';
  delBtn.addEventListener('click', e => deleteTask(e, todo));
  startBtn.innerHTML = '🔥';
  startBtn.addEventListener('click', todoToPending);
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
  saveTasks(todo);
}

function paintPending(text, id, timeStamp) {
  const newId = getId(id);
  const pendingLi = document.createElement('li');
  const pendingDelBtn = document.createElement('button');
  const finishBtn = document.createElement('button');
  const span = document.createElement('span');
  pendingDelBtn.innerHTML = '❌';
  pendingDelBtn.addEventListener('click', e => deleteTask(e, pending));
  finishBtn.innerHTML = '✅';
  finishBtn.addEventListener('click', moveToFinished);
  span.innerText = text;
  pendingLi.appendChild(span);
  pendingLi.appendChild(pendingDelBtn);
  pendingLi.appendChild(finishBtn);
  pendingLi.id = newId;
  pendingList.appendChild(pendingLi);

  const pendingObj = {
    text: text,
    timeStamp: timeStamp,
    id: newId,
  };
  pendings.push(pendingObj);
  saveTasks(pending);
}

function paintFinished(text, id, elapsedTime) {
  const newId = getId(id);
  const fnLi = document.createElement('li');
  const fnDelBtn = document.createElement('button');
  const fnCancelBtn = document.createElement('button');
  const fnSpan = document.createElement('span');

  fnDelBtn.innerHTML = '❌';
  fnDelBtn.addEventListener('click', e => deleteTask(e, finished));
  fnCancelBtn.innerHTML = '⛔';
  fnCancelBtn.addEventListener('click', finishedToPending);

  fnSpan.innerText = `${elapsedTime} ${text}`;
  fnLi.appendChild(fnSpan);
  fnLi.appendChild(fnDelBtn);
  fnLi.appendChild(fnCancelBtn);

  fnLi.id = newId;
  finishedList.appendChild(fnLi);
  const finishedObj = {
    text: text,
    elapsedTime: elapsedTime,
    id: newId,
  };
  finishedes.push(finishedObj);
  saveTasks(finished);
}

function moveToFinished(e) {
  const moveBtn = e.target;
  const moveLi = moveBtn.parentNode;
  const moveTasks = pendings.filter(function(task) {
    return task.id === parseInt(moveLi.id);
  });
  const text = moveTasks[0].text;
  const id = moveTasks[0].id;
  const startTimeStamp = moveTasks[0].timeStamp;
  const endTimeStamp = Date.now();
  const elapsedTimeObj = new Date(endTimeStamp - startTimeStamp - 32400000);
  const hours = elapsedTimeObj.getHours();
  const minutes = elapsedTimeObj.getMinutes();
  const seconds = elapsedTimeObj.getSeconds();
  const elapsedTime = `[${hours}시간 ${minutes}분 ${seconds}초]`;
  paintFinished(text, id, elapsedTime);
  deleteTask(e, pending);
}

function todoToPending(e) {
  const moveBtn = e.target;
  const moveLi = moveBtn.parentNode;
  const moveTasks = todos.filter(function(task) {
    return task.id === parseInt(moveLi.id);
  });
  const text = moveTasks[0].text;
  const id = moveTasks[0].id;
  const timeStamp = Date.now(); 
  paintPending(text, id, timeStamp);
  deleteTask(e, todo);
}

function finishedToPending(e) {
  const moveFnBtn = e.target;
  const moveFnLi = moveFnBtn.parentNode;
  const movefinishedes = finishedes.filter(function(task) {
    return task.id === parseInt(moveFnLi.id);
  });
  const moveFnText = movefinishedes[0].text;
  const moveFnId = movefinishedes[0].id;
  paintPending(moveFnText, moveFnId);
  deleteTask(e, finished);
}

function handleSubmit(e) {
  e.preventDefault();
  const currentValue = taskInput.value;
  paintTodo(currentValue);
  taskInput.value = '';
}

function loadTasks() {
  const loadedTodo = localStorage.getItem(todo.key);
  const loadedPending = localStorage.getItem(pending.key);
  const loadedFinished = localStorage.getItem(finished.key);
  if (loadedTodo !== null) {
    const parsedTodo = JSON.parse(loadedTodo);
    parsedTodo.forEach(function(todo) {
      paintTodo(todo.text, todo.id);
    });
  }
  if (loadedPending !== null) {
    const parsedPending = JSON.parse(loadedPending);
    parsedPending.forEach(function(pending) {
      paintPending(pending.text, pending.id, pending.timeStamp);
    });
  }
  if (loadedFinished !== null) {
    const parsedFinished = JSON.parse(loadedFinished);
    parsedFinished.forEach(function(finished) {
      paintFinished(finished.text, finished.id, finished.elapsedTime);
    });
  }
}

function init() {
  loadTasks();
  taskForm.addEventListener('submit', handleSubmit);
}

init();
