/**
 * backgroundImageSwap - swaps the background image of two chess pieces
 * on all paths aside from the /play/computer path.
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
 * imgSrcSwap - swaps the image source (background image) of two chess
 * pieces on the /play/computer path.
 * @param {object} piece1 
 * @param {object} piece2 
 */
const imgSrcSwap = (piece1, piece2) => {
  temp = piece1.src;
  piece1.src = piece2.src;
  piece2.src = temp;
  return piece1, piece2;
}

/**
 * randomisePieces - randomises the background image of a sides pieces
 * by switching two randomly selected's pieces background images or sources,
 * depending on the url path.
 * @param {array} pieces 
 * @param {int} numberOfRandomisations 
 */
const randomisePieces = (pieces, numberOfRandomisations) => {
  let length = pieces.length;
  if(pieces == undefined || length < 2) return;
  while(numberOfRandomisations > 0) {
    
    let position1 = Math.floor(Math.random() * length);
    let position2 = Math.floor(Math.random() * length);

    while(position1 == position2 || pieces[position1].pieceId == pieces[position2].pieceId) {
      console.log(pieces[position2].pieceId);
      position2 = Math.floor(Math.random() * length);
    }
    
    if(location.pathname == "/play/computer") {
      pieces[position1], pieces[position2] = imgSrcSwap(pieces[position1], pieces[position2]);
    } else {
      pieces[position1], pieces[position2] = backgroundImageSwap(pieces[position1], pieces[position2]);
    }
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
 * getPieceId - gets the pieceId for all paths that aren't /play/computer
 * @param {int} id 
 */
const getPieceId = id => {
    
  switch(true) {
    case (id == 1 || id == 8 || id == 25 || id == 32):
      return 0;
    case (id == 2 || id == 7 || id == 26 || id == 31):
      return 1;
    case (id == 3 || id == 6 || id == 27 || id == 30):
      return 2;
    case id == 4 || id == 28:
      return 3;
    case id == 5 || id == 29:
      return 4;
    case (id > 8 && id < 25):
      return 5;
  }
}

/**
 * getPieceIdComputer - gets the pieceId for the /play/computer path
 * @param {String} id 
 */
const getPieceIdComputer = id => {
  switch(id) {
    case "r":
      return 0;
    case "n":
      return 1;
    case "b":
      return 2;
    case "q":
      return 3;
    case "k":
      return 4;
    case "p":
      return 5;
  }
}

/**
 * assignPieceInfo - assigns each piece its id in order to note what the actual piece is,
 * as well as assigning the colour it belongs to.
 * @param {array} pieces 
 */
const assignPieceInfo = pieces => {
  for(piece of pieces) {
    if(piece.id == "") {
      let info = piece.src.slice(-6);
      piece.colour = info.substring(0, 1) == "w" ? 0 : 1;
      piece.pieceId = getPieceIdComputer(info.substring(1, 2));
    } else {
      let id = parseInt(piece.id.substring(6));
      piece.colour = id < 17  ? 0 : 1;
      piece.pieceId = getPieceId(id);
    }
  }
  return pieces;
}

/**
 * splitPieces - splits the pieces into black and white sides
 * @param {array} pieces 
 */
const splitPieces = pieces => {
  const whitePieces = [];
  const blackPieces = [];

  for(piece of pieces) {
    piece.colour == 0 ? whitePieces.push(piece) : blackPieces.push(piece);
  }

  return [whitePieces, blackPieces];
}

/**
 * chessConfuser (Main Function) - visually scrambles the board to confuse the player.
 * @param {object} settings 
 */
const chessConfuser = (settings) => {
  let pieces;
  if(location.pathname == "/play/computer") {
    pieces = document.getElementsByClassName("chess_com_piece");
  } else {
    pieces = document.getElementsByClassName("piece");
  }

  pieces = assignPieceInfo(pieces);

  if(settings.whitePiecesToggle || settings.blackPiecesToggle) {
    pieces = splitPieces(pieces);
    const whitePieces = pieces[0];
    const blackPieces = pieces[1];

    //Randomise whites pieces
    if(settings.whitePiecesToggle) {
      randomisePieces(whitePieces, settings.numberOfRotations);
    }
  
    //Randomise blacks pieces
    if(settings.blackPiecesToggle) {
      randomisePieces(blackPieces, settings.numberOfRotations);
    }
  }


  if(!settings.moveHelper) {
    legalMovesOff();
  }
}

const getPieceLetter = id => {
  switch(id) {
    case 0:
      return "r";
    case 1:
      return "n";
    case 2:
      return "b";
    case 3:
      return "q";
    case 4:
      return "k";
    case 5:
      return "p";
  }
}

/**
 * Assigns the piece that is passed to the function its original image.
 * @param {object} piece 
 * @returns {object} piece
 */
const getOriginalImage = piece => {
  const pieceLetter = getPieceLetter(piece.pieceId);

  const colour = piece.colour == 0 ? "w" : "b";
  if(location.pathname == "/play/computer") {
    piece.src = `${piece.src.slice(0, -6)}${colour}${pieceLetter}.png`
  } else {
    piece.style.backgroundImage = 
      `${piece.style.backgroundImage.slice(0, -8)}${colour}${pieceLetter}.png")`;
  }
  
  return piece;
}

/**
 * Visually resets the board
 */
const reset = () => {
  let pieces;
  if(location.pathname == "/play/computer") {
    pieces = document.getElementsByClassName("chess_com_piece");
  } else {
    pieces = document.getElementsByClassName("piece");
  }

  for(piece of pieces) {
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