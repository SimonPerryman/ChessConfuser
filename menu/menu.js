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
        "numberOfRotations": 15,
        "whitePiecesToggle": true,
        "blackPiecesToggle": true,
        "moveHelper": true,
        "sneakyMode": false,
        "constantRotations": false,
        "kingAndQueen": false,
        "distractions": false
    }

    chrome.storage.sync.set({'settings': settings}, () => {
      console.log("No settings found, used and saved default settings");
    });
  }

  document.getElementById("chessConfuser").checked = settings.chessConfuser;
  document.getElementById("numberOfRotationsSlider").value = settings.numberOfRotations;
  document.getElementById("numberOfRotations").innerHTML = settings.numberOfRotations;
  document.getElementById("whitePiecesToggle").checked = settings.whitePiecesToggle;
  document.getElementById("blackPiecesToggle").checked = settings.blackPiecesToggle;
  document.getElementById("moveHelper").checked = settings.moveHelper;
  document.getElementById("sneakyMode").checked = settings.sneakyMode;
  document.getElementById("constantRotations").checked = settings.constantRotations;
  document.getElementById("kingAndQueen").checked = settings.kingAndQueen;
  document.getElementById("bongcloud").checked = settings.bongcloud;
  document.getElementById("distractions").checked = settings.distractions;
});

/**
 * getSettingsValues - returns all the values for each setting on the settings menu.
 */
const getSettingsValues = () => {
  return {
    "chessConfuser": document.getElementById("chessConfuser").checked,
    "numberOfRotations": document.getElementById("numberOfRotationsSlider").value,
    "whitePiecesToggle": document.getElementById("whitePiecesToggle").checked,
    "blackPiecesToggle": document.getElementById("blackPiecesToggle").checked,
    "moveHelper": document.getElementById("moveHelper").checked,
    "sneakyMode": document.getElementById("sneakyMode").checked,
    "constantRotations": document.getElementById("constantRotations").checked,
    "kingAndQueen": document.getElementById("kingAndQueen").checked,
    "bongcloud": document.getElementById("bongcloud").checked,
    "distractions": document.getElementById("distractions").checked
  }
}

/**
 * setGamemode - turns all game modes off, then sets the game mode (that
 * is passed through) to be on.
 * @param {Element} gameMode 
 */
const setGameMode = gameMode => {
  document.getElementById("sneakyMode").checked = false;
  document.getElementById("constantRotations").checked = false;
  document.getElementById("kingAndQueen").checked = false;
  document.getElementById("bongcloud").checked = false;
  document.getElementById("distractions").checked = false;

  gameMode.checked = true;
}

/**
 * isGameMode - checks if an element has the id of a gamemode.
 * @param {Element} element 
 */
const isGameMode = element => {
  const gameModes = [
    "sneakyMode",
    "constantRotations",
    "kingAndQueen",
    "bongcloud",
    "distractions"
  ];

  return gameModes.includes(element.id);
}

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
 * Listener to dynamically update the number of rotations slider
 */
document.getElementById("numberOfRotationsSlider").addEventListener('input', event => {
  document.getElementById("numberOfRotations").innerHTML =
    document.getElementById("numberOfRotationsSlider").value;
})

/**
 * Adds an event listener to check for a change in user settings
 */
document.getElementById("settingsMenu").addEventListener('change', event => {
  if(isGameMode(event.target) && event.target.checked) {
    setGameMode(event.target);
  }

  const settings = getSettingsValues();

  chrome.storage.sync.set({'settings': settings}, () => {
    console.log("Updated user settings");
  })
});

/**
 * Adds an event listener to listen for when the chess confuser
 * checkbox has been ticked or unticked.
 */
document.getElementById("chessConfuser").addEventListener('change', event => {
  let value = document.getElementById("chessConfuser").checked;

  if(!value) {
    sendMessage(1);
  }
});

/**
 * Adds an event listener to check if the uses clicks the scramble
 * button
 */
document.getElementById("scrambler").addEventListener('click', event => {
  sendMessage(0);
});

/**
 * Adds an event listener to check if the uses clicks the reset
 * button
 */
document.getElementById("reset").addEventListener('click', event => {
  sendMessage(1);
});

/**
 * Adds an event listener to check whether the move helper textbox
 * has been ticked or unticked.
 */
document.getElementById("moveHelper").addEventListener('change', event => {
  let value = document.getElementById("moveHelper").checked;

  sendMessage(value == true ? 2 : 3);
});