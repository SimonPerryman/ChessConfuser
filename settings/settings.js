/**
 * On page load, checks whether the user has the chess confuser
 * on or off, and changes the checkbox to reflect this.
 */
chrome.storage.sync.get(['chessConfuser'], result => {
  document.getElementById("chessConfuser").checked = result.chessConfuser;
});

/**
 * Sends a message to the content script
 * @param {int} payload 
 */
const sendMessage = payload => {

  const params = {
    active: true,
    currentWindow: true
  }

  chrome.tabs.query(params, tabs => {
    chrome.tabs.sendMessage(tabs[0].id, payload);
  });

}

/**
 * Adds an event listener to listen for when the chess confuser
 * checkbox has been ticked or unticked.
 */
document.getElementById("chessConfuser").addEventListener('change', event => {
  let value = document.getElementById("chessConfuser").checked;

  chrome.storage.sync.set({"chessConfuser": value}, () => {
    console.log("Toggled chess confuser: " + value == true ? "On" : "Off");
  });

  sendMessage(value == true ? null : 1);

});

/**
 * Adds an event listener to check if the uses clicks the scramble
 * button
 */
document.getElementById("scrambler").addEventListener('click', event => {
  sendMessage(0);
})

/**
 * Adds an event listener to check whether the move helper textbox
 * has been ticked or unticked.
 */
document.getElementById("moveHelper").addEventListener('change', event => {
  let value = document.getElementById("moveHelper").checked;

  chrome.storage.sync.set({"moveHelper": value}, () => {
    console.log("Toggled move helper: " + value == true ? "On" : "Off");
  });

  // sendMessage(2);
})