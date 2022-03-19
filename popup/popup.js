let start = false
window.addEventListener("DOMContentLoaded", (event) => {
  console.log("popup js")
  const btn = document.getElementById("deleteBtn")
  btn.onclick = function () {
    start = !start
    btn.innerText = start ? "Stop" : "Start"
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
  slctBox.value = Number(localStorage.getItem("photoNumber") || 100)
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
