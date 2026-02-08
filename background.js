chrome.runtime.onConnect.addListener((port) => {
  if (port.name === "popup") {
    console.log("Popup opened");

    port.onDisconnect.addListener(() => {
      console.log("Popup closed");

      //This ALWAYS runs when popup closes
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const tab = tabs[0];
        if (!tab) return;

        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: () => {
            const video = document.querySelector("video");
            if (video && video.paused) {
              video.play();
            }
          }
        });
      });
    });
  }
});
