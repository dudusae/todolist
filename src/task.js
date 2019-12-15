const taskForm = document.querySelector('.js-taskForm'),
  taskInput = taskForm.querySelector('input'),
  taskList = document.querySelector('.js-pendingList'),
  finishedList = document.querySelector('.js-finishedList');

const PENDING_LS = 'PENDING',
  FINISHED_LS = 'FINISHED';

let tasks = [],
  fnTasks = [];

function getId() {
  const id = +new Date();
  return id;
}

function saveTasks() {
  localStorage.setItem(PENDING_LS, JSON.stringify(tasks));
}

function saveFnTasks() {
  localStorage.setItem(FINISHED_LS, JSON.stringify(fnTasks));
}

function paintTask(text) {
  const newId = getId();
  const li = document.createElement('li');
  const delBtn = document.createElement('button');
  const finishBtn = document.createElement('button');
  delBtn.innerHTML = '❌';
  delBtn.addEventListener('click', deleteTask);
  finishBtn.innerHTML = '🔥';
  finishBtn.addEventListener('click', moveToFinish);
  const span = document.createElement('span');
  span.innerText = text;
  li.appendChild(span);
  li.appendChild(delBtn);
  li.appendChild(finishBtn);
  li.id = newId;
  taskList.appendChild(li);
  const taskObj = {
    text: text,
    id: newId,
  };
  tasks.push(taskObj);
  saveTasks();
}

function paintFnTask(text) {
  const newId = getId();
  const fnLi = document.createElement('li');
  const fnDelBtn = document.createElement('button');
  const fnCancelBtn = document.createElement('button');
  const fnDoneBtn = document.createElement('button');
  const fnSpan = document.createElement('span');
  fnDelBtn.innerHTML = '❌';
  fnDelBtn.addEventListener('click', deleteFnTask);
  fnCancelBtn.innerHTML = '⛔';
  fnCancelBtn.addEventListener('click', moveToPending);
  fnDoneBtn.innerHTML = '✅';
  fnSpan.innerText = text;
  fnLi.appendChild(fnSpan);
  fnLi.appendChild(fnDelBtn);
  fnLi.appendChild(fnCancelBtn);
  fnLi.appendChild(fnDoneBtn);
  fnLi.id = newId;
  finishedList.appendChild(fnLi);
  const fnObj = {
    text: text,
    id: newId,
  };
  fnTasks.push(fnObj);
  saveFnTasks();
}

function moveToFinish(e) {
  const moveBtn = e.target;
  const moveLi = moveBtn.parentNode;
  const moveTasks = tasks.filter(function(task) {
    return task.id === parseInt(moveLi.id);
  });
  const moveText = moveTasks[0].text;
  paintFnTask(moveText);
  deleteTask(e);
}

function moveToPending(e) {
  const moveFnBtn = e.target;
  const moveFnLi = moveFnBtn.parentNode;
  const moveFnTasks = fnTasks.filter(function(task) {
    return task.id === parseInt(moveFnLi.id);
  });
  const moveFnText = moveFnTasks[0].text;
  paintTask(moveFnText);
  deleteFnTask(e);
}

function handleSubmit(e) {
  e.preventDefault();
  const currentValue = taskInput.value;
  paintTask(currentValue);
  taskInput.value = '';
}

function deleteTask(e) {
  const btn = e.target;
  const li = btn.parentNode;
  taskList.removeChild(li);

  const cleanTasks = tasks.filter(function(task) {
    console.log(li.id, task.id);
    return task.id !== parseInt(li.id);
  });
  tasks = cleanTasks;
  saveTasks();
}

function deleteFnTask(e) {
  const fnBtn = e.target;
  const fnDelLi = fnBtn.parentNode;
  finishedList.removeChild(fnDelLi);
  const cleanFnTasks = fnTasks.filter(function(task) {
    return task.id !== parseInt(fnDelLi.id);
  });
  fnTasks = cleanFnTasks;
  saveFnTasks();
}

function loadTasks() {
  const loadedTasks = localStorage.getItem(PENDING_LS);
  const loadedfnTasks = localStorage.getItem(FINISHED_LS);
  if (loadedTasks !== null) {
    const parsedTasks = JSON.parse(loadedTasks);
    parsedTasks.forEach(function(task) {
      paintTask(task.text);
    });
  }
  if (loadedfnTasks !== null) {
    const parsedFnTasks = JSON.parse(loadedfnTasks);
    parsedFnTasks.forEach(function(fnTask) {
      paintFnTask(fnTask.text);
    });
  }
}
function init() {
  loadTasks();
  taskForm.addEventListener('submit', handleSubmit);
}

init();
