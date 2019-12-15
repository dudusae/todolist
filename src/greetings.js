const USER_LS = localStorage.getItem("user"),
  form = document.querySelector(".js-form"),
  input = form.querySelector("input"),
  greetings = document.querySelector(".greetings");

function init() {
  if (USER_LS === null) {
    form.classList.add("showing");
  } else {
    greetings.innerHTML = `Hello! ${USER_LS}`;
    form.classList.remove("showing");
    greetings.classList.add("showing");
  }
}

function handleForm(e) {
  const currentValue = input.value;
  localStorage.setItem("user", currentValue);
}

form.addEventListener("submit", handleForm);

init();
