let lastX,
  lastY,
  canvas,
  canvasCtx,
  mousePressed = !1,
  brushColor = "#000",
  brushSize = 5;
function initApp() {
  (canvas = document.getElementById("myCanvas")),
    (canvasCtx = canvas.getContext("2d")),
    canvasResize(),
    (window.onresize = canvasResize),
    canvas.addEventListener("mousedown", function (e) {
      (mousePressed = !0),
        console.log("this", $(this)),
        // console.log("chuj", e.pageX, $(this).offset().left),
        draw(e.pageX - $(this).offset().left, e.pageY - $(this).offset().top, !1);
    }),
    canvas.addEventListener("mousemove", function (e) {
      mousePressed && draw(e.pageX - $(this).offset().left, e.pageY - $(this).offset().top, !0);
    }),
    canvas.addEventListener("mouseup", function (e) {
      mousePressed = !1;
    }),
    canvas.addEventListener("mouseleave", function (e) {
      mousePressed = !1;
    }),
    canvas.addEventListener("touchstart", function (e) {
      mousePressed = !0;
      let n = e.touches[0],
        t = new MouseEvent("mousedown", { clientX: n.clientX, clientY: n.clientY });
      canvas.dispatchEvent(t);
    }),
    canvas.addEventListener("touchmove", function (e) {
      let n = e.touches[0],
        t = new MouseEvent("mousemove", { clientX: n.clientX, clientY: n.clientY });
      canvas.dispatchEvent(t);
    }),
    canvas.addEventListener(
      "touchend",
      function (e) {
        mousePressed = !1;
      },
      !1,
    ),
    canvas.addEventListener(
      "touchcancel",
      function (e) {
        mousePressed = !1;
      },
      !1,
    );
  let e = document.getElementById("clearBtn");
  e.addEventListener("click", clearArea),
    e.addEventListener("mouseover", (e) => {
      document.getElementById("my-clear-icon").classList.toggle("spin");
    }),
    e.addEventListener("mouseout", (e) => {
      document.getElementById("my-clear-icon").classList.toggle("spin");
    });
  let n = document.getElementById("saveBtn");
  n.addEventListener("mouseover", (e) => {
    document.getElementById("my-save-icon").classList.toggle("slide-down");
  }),
    n.addEventListener("mouseout", (e) => {
      document.getElementById("my-save-icon").classList.toggle("slide-down");
    }),
    n.addEventListener("blur", (e) => {
      document.getElementById("my-save-icon").classList.toggle("slide-down");
    }),
    n.addEventListener(
      "click",
      function (e) {
        (n.href = canvas.toDataURL("image/png")), (n.download = "image.png");
      },
      !1,
    ),
    document.getElementById("sliderRange").addEventListener("change", (e) => {
      document.getElementById("brushSize").innerHTML = e.target.value;
    });
}
function draw(e, n, t) {
  t &&
    ((canvasCtx.strokeStyle = brushColor),
    (canvasCtx.lineWidth = $("#sliderRange").val()),
    (canvasCtx.lineJoin = "round"),
    canvasCtx.beginPath(),
    canvasCtx.moveTo(lastX, lastY),
    canvasCtx.lineTo(e, n),
    canvasCtx.closePath(),
    canvasCtx.stroke()),
    (lastX = e),
    (lastY = n);
}
function setDisplays() {
  document.getElementById("appVersion").style = "display: block;";
  let e = document.getElementById("mousePos");
  (e.style = "display: block;"), (e.innerHTML = "brush position:\n0 / 0");
  let n = document.getElementById("viewport");
  (n.style = "display: block;"),
    (n.innerHTML = "viewport:\n" + window.innerHeight + "px / " + window.innerWidth + "px"),
    window.addEventListener("touchmove", (n) => {
      let t = "brush position:\n" + (n.touches[0].pageX + "").substr(0, 7) + " / " + (n.touches[0].pageY + "").substr(0, 7);
      e.innerHTML = t;
    }),
    window.addEventListener("mousemove", (n) => {
      let t = "brush position:\n" + n.pageX + " / " + n.pageY;
      e.innerHTML = t;
    });
}
function canvasResize() {
  window.screen.width <= 600
    ? ((canvas.width = window.innerWidth), (canvas.height = 0.65 * window.innerHeight))
    : ((canvas.width = window.innerWidth), (canvas.height = window.innerHeight / 1.2)),
    (document.getElementById("viewport").innerHTML = "viewport:\n" + window.innerHeight + "px / " + window.innerWidth + "px");
}
function canvasAddEvents() {}
function clearArea() {
  canvasCtx.setTransform(1, 0, 0, 1, 0, 0), canvasCtx.clearRect(0, 0, canvasCtx.canvas.width, canvasCtx.canvas.height);
}
function pickColor(e, n) {
  brushColor = e;
  let t = document.getElementsByClassName("color");
  $.each(t, (e, t) => {
    t.id === n.id
      ? document.getElementById(t.id).classList.add("color--picked")
      : document.getElementById(t.id).classList.remove("color--picked");
  });
}
