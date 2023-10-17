class Minesweeper {
    static get SIZE()  { return 15; } 
    static get BOMB()  { return "B"; }
    static get EMPTY() { return "E"; }

    constructor(rows = Minesweeper.SIZE, columns = Minesweeper.SIZE, probability_chance = 0.1) {
        this.rows = rows;
        this.columns = columns;
        this.bombs = Math.floor(rows * columns * probability_chance);
        this.cells = Array.from({ length: rows }, () => Array(columns).fill(Minesweeper.EMPTY));
        // Place bombs
        let placedBombs = 0;
        while (placedBombs < this.bombs) {
            let x = Math.floor(Math.random() * this.rows);
            let y = Math.floor(Math.random() * this.columns);
            if (this.cells[x][y] !== Minesweeper.BOMB) {
                this.cells[x][y] = Minesweeper.BOMB;
                placedBombs++;
            }
        }
    }

    init_board() {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.columns; j++) {
                create_button(i, j, this);
                if (j === this.columns - 1) create_line_break();
            }
        }
    }

    flood_fill(x, y) {
        console.log(`Entering flood_fill for cell ${x},${y}`);
        
        // Check boundaries
        if (x < 0 || x >= this.rows || y < 0 || y >= this.columns) {
            console.log(`Exiting flood_fill for cell ${x},${y} due to boundary check.`);
            return;
        }
        
        const cell = document.getElementById(`${x}-${y}`);
        
        // Check to see if cell has been explored
        if (cell.getAttribute('data-explored') === 'true') {
            console.log(`Exiting flood_fill for cell ${x},${y} as it's already explored.`);
            return;
        }
        
        // Mark this cell as explored
        cell.setAttribute('data-explored', 'true');
        
        // Checks for bomb
        if(this.cells[x][y] === Minesweeper.BOMB) {
            console.log(`Exiting flood_fill for cell ${x},${y} due to bomb presence.`);
            return;
        }
    
        // Inlined countSurroundingBombs logic
        let count = 0;
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                if (i === 0 && j === 0) continue;
                if (this.cells[x + i] && this.cells[x + i][y + j] === Minesweeper.BOMB) count++;
            }
        }
        const surroundingBombs = count;
    
        if (surroundingBombs > 0) {
            cell.style.backgroundImage = `url('./assets/${surroundingBombs}.png')`; // inlined setCellImage logic
            return;
        } else {
            cell.style.backgroundImage = `url('./assets/0.png')`; // inlined setCellImage logic
        }
        
        // Recursive calls for neighboring cells
        this.flood_fill(x - 1, y);
        this.flood_fill(x + 1, y);
        this.flood_fill(x, y - 1);
        this.flood_fill(x, y + 1);
        this.flood_fill(x - 1, y - 1);
        this.flood_fill(x + 1, y + 1);
        this.flood_fill(x + 1, y - 1);
        this.flood_fill(x - 1, y + 1);
    }
    
    
    
    lock() {
        console.log("Locking the game board.");
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.columns; j++) {
                const cell = document.getElementById(`${i}-${j}`);
                cell.disabled = true;
            }
        }
    }

    unlock() {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.columns; j++) {
                const cell = document.getElementById(`${i}-${j}`);
                cell.disabled = false;
            }
        }
    }

    _open(x, y) {
        const cell = document.getElementById(`${x}-${y}`);
        if (this.cells[x][y] === Minesweeper.BOMB) {
            cell.style.backgroundImage = `url('./assets/bomb.png')`; // inlined setCellImage logic
            document.getElementById("game_over").style.display = "block";
            this.lock();
        } else {
            // Inlined countSurroundingBombs logic
            let count = 0;
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    if (i === 0 && j === 0) continue;
                    if (this.cells[x + i] && this.cells[x + i][y + j] === Minesweeper.BOMB) count++;
                }
            }
            const surroundingBombs = count;
    
            if (surroundingBombs > 0) {
                cell.style.backgroundImage = `url('./assets/${surroundingBombs}.png')`; // inlined setCellImage logic
            } else {
                cell.style.backgroundImage = `url('./assets/0.png')`; // inlined setCellImage logic
                this.flood_fill(x, y);
            }
    
            console.log(`State of cell (0,0) - Inner Text: ${document.getElementById("0-0").innerText}, Background Image: ${document.getElementById("0-0").style.backgroundImage}`);
            if (this.is_winning_choice()) {
                console.log("Player has won the game, displaying message.");
                document.getElementById("game_won").style.display = "block";
                this.lock();
            } else {
                console.log("Player hasn't won yet.");
            }
        }
    }
    
    

    
    _flag(event, x, y) {
        event.preventDefault();
        const cell = document.getElementById(`${x}-${y}`);
        
        if (cell.style.backgroundImage.includes('empty.png')) {
            cell.style.backgroundImage = "url('./assets/flag.png')";
        } else {
            cell.style.backgroundImage = "url('./assets/0.png')";
        }
        
        console.log(`State of cell (0,0) - Inner Text: ${document.getElementById("0-0").innerText}, Background Image: ${document.getElementById("0-0").style.backgroundImage}`);
        if (this.is_winning_choice()) {
            console.log("Player has won the game, displaying message.");
            document.getElementById("game_won").style.display = "block";
            this.lock();
        } else {
            console.log("Player hasn't won yet.");
        }
    }
    
    

    explore(x, y) {
        if (x < 0 || x >= this.rows || y < 0 || y >= this.columns) return;
        const cell = document.getElementById(`${x}-${y}`);
        if (cell.innerText) return; 
        let surroundingBombs = this.countSurroundingBombs(x, y);
        if (surroundingBombs > 0) {
            cell.innerText = surroundingBombs;
            return;
        }
        this.flood_fill(x - 1, y);
        this.flood_fill(x + 1, y);
        this.flood_fill(x, y - 1);
        this.flood_fill(x, y + 1);
    }


    is_winning_choice() {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.columns; j++) {
                const cellElement = document.getElementById(`${i}-${j}`);
                console.log(`Checking cell (${i},${j}). Inner Text: ${cellElement.innerText}, Background Image: ${cellElement.style.backgroundImage}`);
                
                if (this.cells[i][j] !== Minesweeper.BOMB) {
                    if (!cellElement.style.backgroundImage.includes('/assets/0.png') && 
                        !cellElement.style.backgroundImage.includes('/assets/1.png') && 
                        !cellElement.style.backgroundImage.includes('/assets/2.png') && 
                        !cellElement.style.backgroundImage.includes('/assets/3.png') && 
                        !cellElement.style.backgroundImage.includes('/assets/4.png') && 
                        !cellElement.style.backgroundImage.includes('/assets/5.png') && 
                        !cellElement.style.backgroundImage.includes('/assets/6.png') && 
                        !cellElement.style.backgroundImage.includes('/assets/7.png') && 
                        !cellElement.style.backgroundImage.includes('/assets/8.png') && 
                        !cellElement.innerText) {
                        console.log(`Cell at (${i},${j}) should be revealed but isn't.`);
                        return false;
                    }
                }
            }
        }
        return true;
    }
    
}