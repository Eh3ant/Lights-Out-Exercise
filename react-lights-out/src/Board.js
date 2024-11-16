import React, { useState } from "react";
import Cell from "./Cell";
import "./Board.css";

/** Game board of Lights out.
 *
 * Properties:
 *
 * - nrows: number of rows of board
 * - ncols: number of cols of board
 * - chanceLightStartsOn: float, chance any cell is lit at start of game
 *
 * State:
 *
 * - board: array-of-arrays of true/false
 *
 *    For this board:
 *       .  .  .
 *       O  O  .     (where . is off, and O is on)
 *       .  .  .
 *
 *    This would be: [[f, f, f], [t, t, f], [f, f, f]]
 *
 *  This should render an HTML table of individual <Cell /> components.
 *
 *  This doesn't handle any clicks --- clicks are on individual cells
 *
 **/

function Board({ nrows, ncols, chanceLightStartsOn }) {
  const [board, setBoard] = useState(createBoard());

  // Tracks if the game has started
  const [gameStarted, setGameStarted] = useState(false);

  /** create a board nrows high/ncols wide, each cell randomly lit or unlit */


  function createBoard() {
    let initialBoard;
    let allOff;

    do {
      initialBoard = [];
      allOff = true;

      for (let y = 0; y < nrows; y++) {
        let row = [];
        for (let x = 0; x < ncols; x++) {
          const isLit = Math.random() < chanceLightStartsOn;
          row.push(isLit);
          if (isLit) {
            allOff = false;
          }
        }
        initialBoard.push(row);
      }
    } while (allOff); // Regenerate the board if all cells are off
    return initialBoard;
  }


  function hasWon() {
    // TODO: check the board in state to determine whether the player has won.
    console.log("Checking win condition for board:", board);
    return board.every(row => row.every(cell => !cell));

  }

  function flipCellsAround(coord) {

    // Set gameStarted to true on the first click
    if (!gameStarted) setGameStarted(true);
    const flipCell = (y, x, boardCopy) => {
      // if this coord is actually on board, flip it

      if (x >= 0 && x < ncols && y >= 0 && y < nrows) {
        boardCopy[y][x] = !boardCopy[y][x];
      }
    };


    setBoard(oldBoard => {
      const [y, x] = coord.split("-").map(Number);


      // TODO: Make a (deep) copy of the oldBoard
      const boardCopy = oldBoard.map(row => [...row]);


      // TODO: in the copy, flip this cell and the cells around it
      flipCell(y, x, boardCopy);       // Current cell
      flipCell(y - 1, x, boardCopy);   // Cell above
      flipCell(y + 1, x, boardCopy);   // Cell below
      flipCell(y, x - 1, boardCopy);   // Cell left
      flipCell(y, x + 1, boardCopy);   // Cell right

      // TODO: return the copy
      return boardCopy;
    });


  }

  // if the game is won, just show a winning msg & render nothing else
  if (hasWon()) {
    return <div className="Board-winner">You Won!</div>;
  }

  return (
    <table className="Board">
      <tbody>
        {board.map((row, y) => (
          <tr key={y}>
            {row.map((cell, x) => (
              <Cell
                key={`${y}-${x}`}
                isLit={cell}
                flipCellsAroundMe={() => flipCellsAround(`${y}-${x}`)}
              />
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );

}

export default Board;
