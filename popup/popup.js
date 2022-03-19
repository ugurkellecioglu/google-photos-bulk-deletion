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
        { greeting: "hello", operation: start ? "START" : "STOP" },
        function (response) {
          console.log(response.farewell)
        }
      )
    })
  }
})
