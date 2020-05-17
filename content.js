/**
 * backgroundImageSwap - swaps the background image of two chess pieces
 * @param {object} child1
 * @param {object} child2
 * @returns {object, object} child1, child2
 */
const backgroundImageSwap = (piece1, piece2) => {
  temp = piece1.style.backgroundImage;
  piece1.style.backgroundImage = piece2.style.backgroundImage;
  piece2.style.backgroundImage = temp;
  return piece1, piece2;
}

/**
 * randomisePieces - randomises the background image of a sides pieces
 * by switching two randomly selected's pieces background images.
 * @param {array} pieces 
 * @param {int} numberOfRandomisations 
 * @param {int} colour
 * @returns {void} 
 */
const randomisePieces = (pieces, numberOfRandomisations, colour) => {
  sideCorrection = colour == 1 ? 16 : 0;
  while(numberOfRandomisations > 0) {
    
    let position1 = sideCorrection + Math.floor(Math.random() * 16);
    let position2 = sideCorrection + Math.floor(Math.random() * 16);

    pieces[position1], pieces[position2] = backgroundImageSwap(pieces[position1], pieces[position2]);
    numberOfRandomisations--;
  }
}

/**
 * Adds a listener to listen for settings changes
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("Received message");
  console.log(request);
});

/**
 * Main function, checks whether chessConfuser is on, and if so,
 * scrambles the board. 
 */
const chessConfuser = () => {
  chrome.storage.sync.get('chessConfuser', result => {
    console.log("chessConfuser setting value currently is: ");
    console.log(result);
    if(result.chessConfuser) {
      const pieces = document.getElementsByClassName("pieces")[0];
      const children = pieces.children;
      let numberOfRandomisations = 15;
    
      //Randomise whites pieces
      randomisePieces(children, 15, 0);
    
      //Randomise blacks pieces
      randomisePieces(children, 15, 1);
    }
  });
}



console.log("Loaded chessConfuser");
chessConfuser();
