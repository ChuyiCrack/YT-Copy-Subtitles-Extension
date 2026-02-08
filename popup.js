const btn = document.getElementById("btn");
const Alert = document.getElementById("AnyAlert");
const copyAlert = document.getElementById("copiedAlert");


const port = chrome.runtime.connect({ name: "popup" });


chrome.tabs.query({active:true , currentWindow:true},(tabs) => {

  const tab = tabs[0];
  const url = tab.url;

  if(url && !url.includes("www.youtube.com/watch") ){
    notInYtVideo()
    return;
  }
  chrome.scripting.executeScript(
      {
        target: { tabId: tab.id },
        func: () => {
          const video = document.querySelector("video");
          if(video && !video.paused){
            video.pause();      
          }
        }
    });
  });

btn.addEventListener("click", () => {
  // 1. Get active tab
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tabId = tabs[0].id;
    
    // 2. Inject script into the page
    chrome.scripting.executeScript(
      {
        target: { tabId: tabId },
        func: () => {
         const currSubtitle = document.querySelectorAll('span.ytp-caption-segment');
         return Array.from(currSubtitle).map(span => span.textContent.trim());
        }
      },
      (results) => {
        // 4. Back in the POPUP
        const listSpansSubtitle = results[0].result;  // array of text
        if(!listSpansSubtitle || listSpansSubtitle.length === 0) {
          copyAlert.textContent = "Subtitle not found";
          copyAlert.style.color = "red";
          } 
        else {
          let allSubtitles = "";

          listSpansSubtitle.forEach(text => {
            allSubtitles += text + " ";
          });
          copyAlert.textContent = "Copied";
          copyClipBoard(allSubtitles.trim());         
          }
        });
      });
});

document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") {
    // Popup is being closed / hidden
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];

      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
          console.log("closing popup");
          const video = document.querySelector("video");
          if (video && video.paused) {
            video.play();
          }
        }
      });
    });
  }
});




function copyClipBoard(text){
  navigator.clipboard.writeText(text)
  .catch(err => {
    console.error("Failed to copy: ", err);
  });
}

function notInYtVideo(){
  Alert.innerText = "You are not in a YT Video";
  document.getElementById("MainContainer").style.display = "None";
}