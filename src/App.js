import React, { useState } from "react";
import { motion } from "framer-motion";
import "./App.css";

const Sudoku = () => {
  // 9x9 grid
  const [grid, setGrid] = useState(Array(9).fill(null).map(() => Array(9).fill("")));
  const [errors, setErrors] = useState(Array(9).fill(null).map(() => Array(9).fill(false)));

  // Check if value is valid in Sudoku rules
  const isValidMove = (grid, row, col, value) => {
    if (value === "") return true;

    // Check row
    for (let c = 0; c < 9; c++) {
      if (c !== col && grid[row][c] === value) return false;
    }

    // Check column
    for (let r = 0; r < 9; r++) {
      if (r !== row && grid[r][col] === value) return false;
    }

    // Check 3x3 box
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let r = startRow; r < startRow + 3; r++) {
      for (let c = startCol; c < startCol + 3; c++) {
        if ((r !== row || c !== col) && grid[r][c] === value) {
          return false;
        }
      }
    }

    return true;
  };

  // Handle typing (fix: replace number without needing backspace)
  const handleChange = (row, col, value) => {
    // Always take the last entered digit
    const newValue = value ? value[value.length - 1] : "";

    if (newValue === "" || /^[1-9]$/.test(newValue)) {
      const newGrid = grid.map(r => [...r]);
      const newErrors = errors.map(r => [...r]);

      newGrid[row][col] = newValue;

      // Validate current cell
      newErrors[row][col] = newValue !== "" && !isValidMove(newGrid, row, col, newValue);

      setGrid(newGrid);
      setErrors(newErrors);
    }
  };

  return (
    <div className="sudoku-container">
      <h1>Sudoku Game 🎮</h1>

      <div className="sudoku-grid">
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="sudoku-row">
            {row.map((cell, colIndex) => (
              <motion.input
                key={colIndex}
                className={`sudoku-cell ${errors[rowIndex][colIndex] ? "error" : ""}`}
                type="text"
                maxLength="2" // typing multiple digits, but we'll only take last one
                value={cell}
                onChange={(e) => handleChange(rowIndex, colIndex, e.target.value)}
                whileFocus={{ scale: 1.2, backgroundColor: "#e0f7fa" }}
                animate={
                  errors[rowIndex][colIndex]
                    ? { x: [0, -5, 5, -5, 5, 0] } // shake if invalid
                    : { scale: [1, 1.1, 1] } // pulse when valid
                }
                transition={{ duration: 0.3 }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sudoku;
