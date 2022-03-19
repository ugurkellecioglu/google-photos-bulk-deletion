let offset = 0
let prevLen = 0
let tmpArr = []
let i = 0
let sum = 0
let process

let photoNumber = 100
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
  if (sum >= photoNumber) {
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
  console.log(request)
  if (request?.operation === "START") {
    startProcess()
    sendResponse({ result: "started" })
  } else if (request?.operation === "STOP") {
    stopProcess()
    sendResponse({ result: "stopped" })
  } else if (request?.photoNumber) {
    photoNumber = request.photoNumber
    sendResponse({ result: `photoNumber changed to ${photoNumber} ` })
  }
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

const html = `
<div class="ugr-wrapper">
  <div class="ugr-header">
    <div class="ugr-header-title">
      <h1>
          <span class="ugr-header-title-text">
            Google Photos Auto Delete
          </span>
      </h1>
    </div>
  </div>
  <div class="ugr-content">
    <div class="ugr-content-body">
      <div class="ugr-content-body-inner">
        <p>Eklentiyi kullanmak için, eklenti simgesine tıklayın ve size uygun fotoğraf sayısını seçin</p>
      </div>
    </div>
  </div>
</div>

<style>
    .ugr-wrapper {
      position: absolute !important;
      top: 10% !important;
      right: 5% !important;
      z-index: 9999;
      background-color: #4682f4;
      position: fixed;
      width: 300px;
      height: 300px;
      border-radius: 10px;
      box-shadow: 0px 0px 3px #000000;
      padding: 10px;
      color: #fff;
      font-family: sans-serif;
      font-size: 14px;
      font-weight: bold;
      text-align: center;

    }
</style>
`

const div = document.createElement("div")
div.innerHTML = html
document.body.appendChild(div)
