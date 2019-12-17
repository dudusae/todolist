const Grid = tui.Grid;

let saves = [];
const saved = { key: 'SAVED', array: saves };

const loadedSaved = localStorage.getItem(saved.key);
const parseSaved = JSON.parse(loadedSaved);

function loadSaved() {
  const loadedSaved = localStorage.getItem(saved.key);
  if (loadedSaved !== null) {
    const parsedSaved = JSON.parse(loadedSaved);

    parsedSaved.forEach(function(save) {
      saves.push(save);
    });
  }
}

function saveTasks(group) {
  localStorage.setItem(group.key, JSON.stringify(group.array));
}

function updateSaved(ev) {
  const targetRow = ev.rowKey;
  const targetId = grid.getValue(targetRow, 'id', true);
  const targetIdx = saves.findIndex(save => save.id === targetId);
  saves[targetIdx].project = ev.value;
  saveTasks(saved);
}

const options = {
  el: document.getElementById('grid'),
  width: 700,
  rowHeaders : [{type: 'checkbox'}],
  columns: [
    { header: '아이디', name: 'id', align: 'center' },
    {
      header: '분류',
      name: 'project',
      editor: 'text',
      onAfterChange(ev) {
        updateSaved(ev);
      },
      align: 'center',
    },
    {
      header: '업무내용',
      name: 'text',
      editor: 'text',
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
  grid: {
    border: '#aaa',
    text: '#333',
  },
  cell: {
    disabled: {
      text: '#999',
      align: 'center',
    },
  },
  row: {
    hover: {
      background: '#f3ecfd',
    },
  },
});

function init() {
  loadSaved();
}

init();
