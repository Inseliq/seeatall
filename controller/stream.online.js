const body = document.body;
const streamBtn = document.getElementById("streamBtn");

function updateStreamBtn() {
  if (body.getAttribute("data-stream-online") === "true") {
    streamBtn.removeAttribute("disabled");
  } else {
    streamBtn.setAttribute("disabled", "true");
  }
}

// первый запуск при загрузке
updateStreamBtn();

// следим за изменением атрибута data-stream-online
const observer = new MutationObserver(updateStreamBtn);
observer.observe(body, { attributes: true, attributeFilter: ["data-stream-online"] });