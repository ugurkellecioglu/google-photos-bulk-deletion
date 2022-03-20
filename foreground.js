let offset = 0
let prevLen = 0
let tmpArr = []
let i = 0
let sum = 0
let process

let photoNumber = 25
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
  console.log("sum is", sum)
  console.log("photoNumber is", photoNumber)
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
    console.log("stopping")
    stopProcess()
    sendResponse({ result: "stopped" })
  } else if (request?.photoNumber) {
    photoNumber = request.photoNumber
    document.querySelector("#photoNumber").innerText = photoNumber
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
      document.querySelector("#deletedPhotos").innerText = sum
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
        <ul>
          <li>
            Click the icon at the top right
          </li>
          <li>
            Select delete every ... photos
          </li>
          <li>
            Click <span id="startText">START</span> button
          </li>
        </ul>
      </div>
      <div class="ugr-content-body-footer">
        <span id="settingText">Settings</span>
        <hr />
        <div><p>Delete every <span id="photoNumber">25</span> photos.</p></div>
        <div><span id="deletedPhotos">0</span> photos deleted.</div>
      </div>
    </div>
  </div>
</div>

<style>
    .ugr-wrapper {
      position: absolute !important;
      bottom: 2% !important;
      right: 2% !important;
      z-index: 9999;
      background-color: rgba(70, 130, 244, 0.95)      ;
      position: fixed;
      width: 300px;
      height: 300px;
      border-radius: 20px;
      padding: 10px;
      color: #fff;
      font-family: sans-serif;
      font-size: 14px;
      font-weight: bold;
      text-align: center;

    }
    .ugr-content-body-inner ul {
      list-style: none;
      margin: 0;
      text-align: left;
    }
    .ugr-content-body-inner li {
      margin: 10px 0;
      font-size: 14px;
      font-weight: normal;
    }
    .ugr-content-body-footer {
      margin-top: 20px;
    }
    #settingText {
      cursor: pointer;
      font-size: 18px;
      font-weight: bold;
    }
    #startText {
      color: #fff;
      background-color: #2196f3;
      padding: 5px 10px;
      border-radius: 5px;
      cursor: pointer;
    }

</style>
`

const div = document.createElement("div")
div.innerHTML = html
document.body.appendChild(div)
