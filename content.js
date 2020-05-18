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
 * legalMoveRemover - removes the legal move hints
 */
const legalMoveRemover = () => {
  let legalMoves = document.getElementsByClassName("legal-move-hint");
  let legalMovesLength = legalMoves.length;
  if(legalMoves && legalMovesLength > 0) {
    for(var i = 0; i < legalMovesLength; i++) {
      legalMoves[0].parentNode.removeChild(legalMoves[0]);
    }
  }
}

/**
 * Adds event listeners to check when a piece is clicked to remove
 * the legal move hints.
 */
const legalMovesOff = () => {
  document.getElementsByClassName("board")[0].addEventListener('mousedown', legalMoveRemover);
  document.getElementsByClassName("board")[0].addEventListener('click', legalMoveRemover);
}

/**
 * Removes event listeners to check when a piece is clicked, therefore
 * turning legal moves back on.
 */
const legalMovesOn = () => {
  document.getElementsByClassName("board")[0].removeEventListener('mousedown', legalMoveRemover);
  document.getElementsByClassName("board")[0].removeEventListener('click', legalMoveRemover);
}

/**
 * chessConfuser (Main Function) - visually scrambles the board to confuse the player.
 * @param {object} settings 
 */
const chessConfuser = (settings) => {
    const pieces = document.getElementsByClassName("pieces")[0];
    const children = pieces.children;
    let numberOfRandomisations = settings.amountOfRotations;
  
    //Randomise whites pieces
    if(settings.whitePiecesToggle) {
      randomisePieces(children, numberOfRandomisations, 0);
    }
  
    //Randomise blacks pieces
    if(settings.blackPiecesToggle) {
      randomisePieces(children, numberOfRandomisations, 1);
    }

    if(!settings.moveHelper) {
      legalMovesOff();
    }
}

/**
 * Assigns the piece that is passed to the function its original image.
 * @param {object} piece 
 * @returns {object} piece
 */
const getOriginalImage = piece => {
  let value = parseInt(piece.id.substring(6));
  let colour = "w";
  let pieceLetter = "r";
  if(value > 16) {
    colour = "b";
  }

  switch(true) {
    case (value == 2 || value == 7 || value == 26 || value == 31):
      pieceLetter = "n";
      break;
    case (value == 3 || value == 6 || value == 27 || value == 30):
      pieceLetter = "b";
      break;
    case value == 4 || value == 28:
      pieceLetter = "q";
      break;
    case value == 5 || value == 29:
      pieceLetter = "k";
      break;
    case (value > 8 && value < 25):
      pieceLetter = "p";
      break;
  }
  piece.style.backgroundImage = 
    `url("//images.chesscomfiles.com/chess-themes/pieces/neo/150/${colour}${pieceLetter}.png")`
  
  return piece;
}

/**
 * Visually resets the board
 */
const reset = () => {
  const pieces = document.getElementsByClassName("pieces")[0];
  for(piece of pieces.children) {
    piece = getOriginalImage(piece)
  }
}

/**
 * Checks if the user has the extension turned on, and if so,
 * visually scrambles the board.
 * @param {object} settings 
 */
const checkIfOn = storage => {
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
  if(settings.chessConfuser) {
    chessConfuser(settings);
  }
}

/**
 * Adds a listener to listen for settings changes
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch(request) {
    case 0:
      main();
      break;
    case 1:
      reset();
      break;
    case 2:
      legalMovesOn();
      break;
    case 3:
      legalMovesOff();
      break;
  }
});

/**
 * Gets settings then runs the main function
 */
const main = () => {
  chrome.storage.sync.get('settings', checkIfOn);
}

main();