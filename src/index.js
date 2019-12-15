const clock = document.querySelector(".js-clock");

function setTwoDigit(num) {
  return num < 10 ? `0${num}` : num;
}

function getTime() {
  const date = new Date(),
    hour = date.getHours(),
    min = date.getMinutes(),
    sec = date.getSeconds();

  clock.innerHTML = `${setTwoDigit(hour)}:${setTwoDigit(min)}:${setTwoDigit(
    sec
  )}`;
}

function init() {
  getTime();
  setInterval(getTime, 1000);
}

init();
