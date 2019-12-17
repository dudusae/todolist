const saved = localStorage.getItem('SAVED');
const parseSaved = JSON.parse(saved);

const Grid = tui.Grid;
const options = {
  el: document.getElementById('grid'),
  columns: [
    {
      header: '시작',
      name: 'endTime',
    },
    {
        header: '분류',
      name: 'project',
    },
    {
        header: '업무내용',
      name: 'text',
    },
    {
      header: '소요시간',
      name: 'elapsedTime',
    },
  ],
  data: parseSaved,
};

const grid = new Grid(options); // 그리드 인스턴스 생성
