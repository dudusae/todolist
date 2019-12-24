const Grid = tui.Grid;
const deleteBtn = document.querySelector('.js-deleteBtn');

let saves = [];
const saved = { key: 'SAVED', array: saves };
const loadedSaved = localStorage.getItem(saved.key);
const parseSaved = JSON.parse(loadedSaved);

function loadSaved() {
  const loadedSaved = localStorage.getItem(saved.key);
  if (loadedSaved !== null) {
    const parsedSaved = JSON.parse(loadedSaved);

    parsedSaved.forEach(function(save) {
      saved.array.push(save);
    });
  }
}

function saveTasks(group) {
  localStorage.setItem(group.key, JSON.stringify(group.array));
}

function deleteTask(checkedId) {
  saved.array.length = 0;
  loadSaved();
  const cleanTasks = saved.array.filter(function(task) {
    return task.id !== parseInt(checkedId);
  });
  saved.array = cleanTasks;
  // saves와 saved.array가 왜 다른걸까
  saveTasks(saved);
}

function deleteRows() {
  const checkedRows = grid.getCheckedRows();
  const checkedTotal = checkedRows.length;
  const confirmMessage = `삭제하면 복구가 안돼요. ${checkedTotal}개의 업무내역을 삭제하실래요?`;

  if (confirm(confirmMessage)) {
    checkedRows.forEach(row => deleteTask(row.id));
    location.reload();
  }
}

function updateProject(ev) {
  const targetRow = ev.rowKey;
  const targetId = grid.getValue(targetRow, 'id', true);
  const targetIdx = saved.array.findIndex(save => save.id === targetId);
  saved.array[targetIdx].project = ev.value;
  saveTasks(saved);
}

function updateText(ev) {
  const targetRow = ev.rowKey;
  const targetId = grid.getValue(targetRow, 'id', true);
  const targetIdx = saved.array.findIndex(save => save.id === targetId);
  saved.array[targetIdx].text = ev.value;
  saveTasks(saved);
}

const options = {
  el: document.getElementById('grid'),
  width: 700,
  rowHeaders: [{ type: 'checkbox' }],
  columns: [
    { header: '아이디', name: 'id', align: 'center' },
    {
      header: '분류',
      name: 'project',
      editor: 'text',
      onAfterChange(ev) {
        updateProject(ev);
      },
      align: 'center',
    },
    {
      header: '업무내용',
      name: 'text',
      editor: 'text',
      onAfterChange(ev) {
        updateText(ev);
      },
      align: 'center',
    },
    {
      header: '날짜',
      name: 'endTime_String',
      align: 'center',
    },
    {
      header: '소요시간',
      name: 'elapsedTime_String',
      align: 'center',
    },
  ],
  data: parseSaved,
};

const grid = new Grid(options);

Grid.applyTheme('clean', {
  cell: {
    normal:{
      text: '#222',
      border: '#c9c9c9',
      background:'#fff',
      showVerticalBorder: false,
    },
    header:{
      text: '#767676',
      border: '#c9c9c9',
      background:'#fff',
      showVerticalBorder: false,
    },
    disabled: {
      text: '#999',
      align: 'center',
    },
  },
  row: {
    hover: {
      text: '#00c85e'
    },
  },
});

function init() {
  loadSaved();
  deleteBtn.addEventListener('click', deleteRows);
  grid.hideColumn('id');
}

init();
