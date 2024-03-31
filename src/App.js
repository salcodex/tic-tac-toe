import { useState } from "react";

const Square = ({ value, onSquareClick, isWinnerSquare }) => {
  return (
    <button
      className={isWinnerSquare ? "winner-square" : "square"}
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
};

function Board({ xIsNext, squares, onPlay, setCurrentSquareCoords }) {
  //const [squares, setSquares] = useState(Array(9).fill(null));
  //const [xIsNext, setXIsNext] = useState(true);

  function handleClick(i) {
    const nextSquares = squares.slice(); //clone squares

    //Check if the square is already filled
    //here calculateWinner(squares)[0] check for the first return value
    //because the function had to be forced to return [null,null] to work
    if (squares[i] || calculateWinner(squares)[0]) return;

    //Define the symbol
    nextSquares[i] = xIsNext ? "X" : "O";
    // console.log(`squares[${i}] = ${nextSquares[i]}`);
    // currentMoveCouple = [i, nextSquares[i]]
    onPlay(nextSquares);
  }

  const [winner, winnerSquares] = calculateWinner(squares);

  let status;

  if (winner) {
    status = "Winner: " + winner;
  } else if (!winner && !squares.includes(null)) {
    //EDIT: it's included in the 4th extra task
    //The game didn't check for this
    status = "No more moves left, DRAW GAME";
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  //To return the board with map inside map
  const boardStructure = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
  ];

  return (
    <>
      <div className="status">{status}</div>

      {
        //TASK-2: Rewrite Board to use two loops
        // to make the squares instead of hardcoding them.
        //Solution:
        //A map nested inside another map to
        //render the board dynamically
        boardStructure.map((row, rowIndex) => {
          return (
            <div key={rowIndex} className="board-row">
              {row.map((square, squareIndex) => {
                //TASK-4: Highlight the winner move
                //DONE
                if (winner && squares[square] === winner) {
                console.log(`row: ${rowIndex} square: ${squareIndex}`);
                  const squarePosition =
                    rowIndex === 2
                      ? squareIndex + 6
                      : rowIndex === 1
                      ? squareIndex + 3
                      : squareIndex;
                //HERE!!!!
                  if (winnerSquares.includes(squarePosition)) {
                    return (
                      <Square
                        key={squareIndex}
                        value={squares[square]}
                        onSquareClick={() => handleClick(square)}
                        isWinnerSquare={true}
                      />
                    );
                  } else {
                    return (
                      <Square
                        key={squareIndex}
                        value={squares[square]}
                        onSquareClick={() => handleClick(square)}
                        isWinnerSquare={false}
                      />
                    );
                  }
                } else {
                  return (
                    <Square
                      key={squareIndex}
                      value={squares[square]}
                      onSquareClick={() => handleClick(square)}
                      isWinnerSquare={false}
                    />
                  );
                }
              })}
            </div>
          );
        })
      }
    </>
  );
}

//TASK-3:
function ToggleMovesListOrder({ listOrder, setListOrder }) {
  //I chosed a self-contained event handler
  //and an external state, so the game is redrawn
  //after the checkbox changes the state contained
  //in the parent Game component
  const handleListOrder = (event) => {
    setListOrder(event.target.checked);
  };

  return (
    <label htmlFor="toggleListOrder">
      <input
        id="toggleListOrder"
        type="checkbox"
        onChange={handleListOrder}
        checked={listOrder}
      />
      Toggle list order
    </label>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [currentSquareCoordinates, setCurrentSquareCoordinates] = useState([]);

  //False for normal behaviour, true for ascending order
  const [listOrder, setListOrder] = useState(false);

  const currentSquares = history[currentMove];
  const xIsNext = currentMove % 2 === 0;

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    const intersection = nextSquares.filter((item)=> !history.includes(item) && item !== null);
    console.log(intersection);
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    //Let the user choose if the want the list in ascending
    //or descending order
    move = listOrder ? history.length - move - 1 : move;

    const isCurrentMove = move === currentMove;
    let description;

    if (move > 0 && !isCurrentMove) {
      description = "Go to move #" + move + `- row,col ${history[move]}`;
    } else if (isCurrentMove) {
      description = "You are at move #" + move;
    } else {
      description = "Go to game start";
    }

    //TASK-1: For the current move only, show
    //“You are at move #…” instead of a button.
    //Solution:
    if (move === currentMove) {
      return <li key={move}>{description}</li>;
    } else {
      return (
        <li key={move}>
          <button onClick={() => jumpTo(move)}>{description}</button>
        </li>
      );
    }
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board setCurrentSquareCoords={setCurrentSquareCoordinates} xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ToggleMovesListOrder
          listOrder={listOrder}
          setListOrder={setListOrder}
        />
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [squares[a], lines[i]];
    }
  }
  return [null, null];
}
