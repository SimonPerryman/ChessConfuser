console.log("Loaded chessConfuser");

const swap = (child1, child2) => {
  temp = child1.style.backgroundImage;
  child1.style.backgroundImage = child2.style.backgroundImage;
  child2.style.backgroundImage = temp;
  return child1, child2;
}

const randomisePieces = (pieces, numberOfRandomisations, colour) => {
  sideCorrection = colour == 1 ? 15 : 0; 
  while(numberOfRandomisations > 0) {
    let position1 = sideCorrection + Math.floor(Math.random() * 16);
    let position2 = sideCorrection + Math.floor(Math.random() * 16);

    pieces[position1], pieces[position2] = swap(pieces[position1], pieces[position2]);
    numberOfRandomisations--;
  }
}

const chessConfuser = () => {
  const children = pieces.children;
  let numberOfRandomisations = 15;

  //Randomise whites pieces
  randomisePieces(children, 15, 0);

  //Randomise blacks pieces
  randomisePieces(children, 15, 1);
}

const pieces = document.getElementsByClassName("pieces")[0];
if(pieces != undefined) {
  console.log("Chess board is here");
  chessConfuser();
}
