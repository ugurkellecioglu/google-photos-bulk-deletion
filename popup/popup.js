let start = false
window.addEventListener("DOMContentLoaded", (event) => {
  const btn = document.getElementById("deleteBtn")
  btn.innerText =
    sessionStorage.getItem("process") === "false" ? "Stop" : "Start"
  btn.onclick = function () {
    start = !start
    btn.innerText = start ? "Stop" : "Start"
    sessionStorage.setItem("process", start === "Start")
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { operation: start ? "START" : "STOP" },
        function (response) {
          console.log(response)
        }
      )
    })
  }

  const slctBox = document.getElementById("photoNumber")
  slctBox.value = Number(localStorage.getItem("photoNumber") || 25)
  slctBox.onchange = function () {
    localStorage.setItem("photoNumber", slctBox.value)
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { photoNumber: slctBox.value },
        function (response) {
          console.log(response)
        }
      )
    })
  }
})
