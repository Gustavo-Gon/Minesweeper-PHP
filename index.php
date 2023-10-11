<html>
    <head>
        <title>Minesweeper</title>
        <style>
            .minesweeper-cell {
                background-size: cover; 
                width: 30px; 
                height: 30px;
            }
        </style>
    </head>
    
    <body onload="avoid_image_loading_delay()">
        <button id="start">Start</button>&nbsp;&nbsp;&nbsp;&nbsp;
        <span id="game_over" style="display: none; color: red;">You Lost!!!</span>
        <span id="game_won" style="display: none; color: red;">You Won!</span>
        
        <br/><br/>
        <div id="board"></div>  

        <script src="function.js"></script>
        <script src="class.js"></script>
        <script>
        let game;
        let originalCells;

        document.getElementById("start").addEventListener("click", function() {
            if (this.innerText === "Start") {
                this.innerText = "Reset";
                initializeGame();
            } else {
                resetGame();
            }
        });

        function initializeGame() {
            // Get URL Parameters
            const urlParams = new URLSearchParams(window.location.search);
            const rows = urlParams.get('rows') || 15; // Default to 15 if not provided
            const columns = urlParams.get('columns') || 15; // Default to 15 if not provided
            const probability = urlParams.get('probability') || 0.1; // Default to 0.1 if not provided

            game = new Minesweeper(rows, columns, parseFloat(probability));
            game.init_board();
            originalCells = JSON.parse(JSON.stringify(game.cells));
        }

        function resetGame() {
            const boardDiv = document.getElementById("board");
            boardDiv.innerHTML = '';  
            document.getElementById("game_over").style.display = "none";
            console.log("Game won element: ", document.getElementById("game_won"));
            console.log("Current display style: ", document.getElementById("game_won").style.display);
            document.getElementById("game_won").style.display = "none";
            
            game = new Minesweeper();  
            game.cells = JSON.parse(JSON.stringify(originalCells)); 
            game.init_board();
        }

        function avoid_image_loading_delay() {
            const imageFiles = ['empty.png', '0.png', 'bomb.png', '1.png', '2.png', '3.png', '4.png', '5.png', '6.png', '7.png', '8.png', 'flag.png'];
            imageFiles.forEach(file => {
                const img = new Image();
                img.src = `./assets/${file}`;
            });
        }
        </script>
    </body>
</html>
