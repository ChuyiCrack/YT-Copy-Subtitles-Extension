const btn = document.getElementById("btn");
const Alert = document.getElementById("AnyAlert");
const copyAlert = document.getElementById("copiedAlert");




chrome.tabs.query({active:true , currentWindow:true},(tabs) => {

  const tab = tabs[0];
  const url = tab.url;

  if(url && !url.includes("www.youtube.com/watch") ){
    notInYtVideo()
    return;
  }
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
         const currSubtitle = document.querySelector('span.ytp-caption-segment');
         return currSubtitle ? currSubtitle.textContent.trim() : null;
        }
      },
      (results) => {
        // 4. Back in the POPUP
        const valuesFromPage = results[0].result;  // array of text
        if (valuesFromPage) {
          copyAlert.textContent = "Copied";
          console.log(valuesFromPage)
          copyClipBoard(valuesFromPage)
        } else {
          copyAlert.textContent = "Subtitle not found";
          copyAlert.style.color = "red";
        }
      }
    );
  });
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








