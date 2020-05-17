document.getElementById("toggleChessConfuser").addEventListener('change', event => {
  let value = document.getElementById("toggleChessConfuser").checked;

  chrome.storage.sync.set({"chessConfuser": value}, () => {
    console.log("Toggled chess confuser: " + value);
  });

  const params = {
    active: true,
    currentWindow: true
  }

  const payload = {
    chessConfuser: value
  }

  chrome.tabs.query(params, tabs => {
    chrome.tabs.sendMessage(tabs[0].id, payload);
  });

});