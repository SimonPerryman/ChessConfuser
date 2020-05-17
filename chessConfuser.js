console.log("Loaded chessConfuser");

const swap = (child1, child2) => {
  temp = child1.style.backgroundImage;
  child1.style.backgroundImage = child2.style.backgroundImage;
  child2.style.backgroundImage = temp;
  return child1, child2;
}

const chessConfuser = () => {
  const children = pieces.children;
  children[0], children[1] = swap(children[0], children[1]);
}

const pieces = document.getElementsByClassName("pieces")[0];
if(pieces != undefined) {
  console.log("Chess board is here");
  chessConfuser();
}
