// This script gets injected into any opened page
// whose URL matches the pattern defined in the manifest
// (see "content_script" key).
// Several foreground scripts can be declared
// and injected into the same or different pages.

console.log(
  "This prints to the console of the page (injected only if the page url matched)"
)

let offset = 0
let prevLen = 0
let tmpArr = []
let i = 0
let sum = 0
let process
const selection = async () => {
  let photos = Array.from(document.querySelectorAll(".ckGgle"))
  if (i !== 0) {
    photos = photos.filter((item) => tmpArr.every((item2) => item !== item2))
  }
  console.log(photos.length, prevLen)
  sum += photos.length
  if (prevLen === photos.length) offset++
  else offset = 0
  prevLen = photos.length
  photos.forEach((i) => {
    if (!i.getAttribute("isClicked")) {
      i.click()
      i.scrollIntoView()
      i.isClicked = true
    }
  })
  i++
  tmpArr = photos
  if (sum >= 500) {
    // click remove
    await deletePhotos()
  }
  if (offset === 5) clearInterval(process)
}
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log(
    sender.tab
      ? "from a content script:" + sender.tab.url
      : "from the extension"
  )
  if (request.operation === "START") {
    startProcess()
  } else if (request.operation === "STOP") {
    stopProcess()
  }
  if (request.greeting === "hello") sendResponse({ farewell: "goodbye" })
})

const startProcess = () => (process = setInterval(() => selection(), 1500))
const stopProcess = () => clearInterval(process)

const deletePhotos = () => {
  stopProcess()
  console.log("delete photos is called ")
  return new Promise((resolve, reject) => {
    console.log("deleting..")
    document.querySelector("[data-delete-origin] button").click()
    setTimeout(() => {
      document.querySelector("[data-id='EBS5u']:last-child").click()
    }, 1000)
    setTimeout(() => {
      console.log("deleted..")
      startProcess()
      sum = 0
      resolve("deleted")
    }, 3000)
  })
}
