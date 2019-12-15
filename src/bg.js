function paintBg(randomNum) {
    const body = document.querySelector("body");
    const image = new Image();
    const color = ["#32326d", "#76cbff", "#76cbff","#f9ed32"];

    image.src = `src/images/${randomNum}.png`;
    image.classList.add("bgImage");
    body.appendChild(image);

    body.bgColor = color[randomNum-1];
}

function getRandom() {
    const randomNum = Math.ceil(Math.random()*4);
    paintBg(randomNum);
}
function init(){
    window.addEventListener("load", getRandom);

}
init();
