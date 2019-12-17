const saved = localStorage.getItem('SAVED');
const parseSaved = JSON.parse(saved);

const Grid = tui.Grid;
const options = {
  el: document.getElementById('grid'),
  columns: [
    {
      header: '분류',
      name: 'project',
    },
    {
      header: '업무내용',
      name: 'text',
    },
    {
      header: '날짜',
      name: 'endTime_String',
    },
    {
      header: '소요시간',
      name: 'elapsedTime_String',
    },
  ],
  data: parseSaved,
};

const grid = new Grid(options); 
