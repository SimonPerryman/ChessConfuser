/**
 * On page load, loads the user's settings and sets the options
 * to reflect this
 */
chrome.storage.sync.get(['settings'], storage => {
  let settings = storage.settings;

  //Check if this is the first time loading the extension, and if so set
  // the default settings
  if(Object.keys(storage).length === 0 && storage.constructor === Object) {
    settings = {
        "chessConfuser": true,
        "amountOfRotations": 15,
        "whitePiecesToggle": true,
        "blackPiecesToggle": true,
        "moveHelper": true,
        "sneakyMode": false,
        "constantRotations": false,
        "kingAndQueen": false
    }

    chrome.storage.sync.set({'settings': settings}, () => {
      console.log("No settings found, used and saved default settings");
    });
  }

  document.getElementById("chessConfuser").checked = settings.chessConfuser;
  document.getElementById("amountOfRotationsSlider").value = settings.amountOfRotations;
  document.getElementById("amountOfRotations").innerHTML = settings.amountOfRotations;
  document.getElementById("whitePiecesToggle").checked = settings.whitePiecesToggle;
  document.getElementById("blackPiecesToggle").checked = settings.blackPiecesToggle;
  document.getElementById("moveHelper").checked = settings.moveHelper;
  document.getElementById("sneakyMode").checked = settings.sneakyMode;
  document.getElementById("constantRotations").checked = settings.constantRotations;
  document.getElementById("kingAndQueen").checked = settings.kingAndQueen;
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
 * Listener to dynamically update the amount of rotations slider
 */
document.getElementById("amountOfRotationsSlider").addEventListener('input', event => {
  document.getElementById("amountOfRotations").innerHTML =
    document.getElementById("amountOfRotationsSlider").value;
})

/**
 * Adds an event listener to check for a change in user settings
 */
document.getElementById("settingsMenu").addEventListener('change', event => {
  const settings = {
    "chessConfuser": document.getElementById("chessConfuser").checked,
    "amountOfRotations": document.getElementById("amountOfRotationsSlider").value,
    "whitePiecesToggle": document.getElementById("whitePiecesToggle").checked,
    "blackPiecesToggle": document.getElementById("blackPiecesToggle").checked,
    "moveHelper": document.getElementById("moveHelper").checked,
    "sneakyMode": document.getElementById("sneakyMode").checked,
    "constantRotations": document.getElementById("constantRotations").checked,
    "kingAndQueen": document.getElementById("kingAndQueen").checked
  }

  chrome.storage.sync.set({'settings': settings}, () => {
    console.log("Updated user settings");
    console.log(settings);
  })
});

/**
 * Adds an event listener to listen for when the chess confuser
 * checkbox has been ticked or unticked.
 */
document.getElementById("chessConfuser").addEventListener('change', event => {
  let value = document.getElementById("chessConfuser").checked;

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
 * Adds an event listener to check if the uses clicks the reset
 * button
 */
document.getElementById("reset").addEventListener('click', event => {
  sendMessage(1);
})

/**
 * Adds an event listener to check whether the move helper textbox
 * has been ticked or unticked.
 */
document.getElementById("moveHelper").addEventListener('change', event => {
  let value = document.getElementById("moveHelper").checked;

  sendMessage(value == true ? 2 : 3);
})
