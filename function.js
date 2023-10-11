function create_line_break() {
    const br = document.createElement('br');
    document.getElementById("board").appendChild(br);
}

function create_button(x, y, minesweeper) {
    const btn = document.createElement('button');
    btn.id = `${x}-${y}`;
    btn.className = 'minesweeper-cell';  // Add this line to assign the class
    btn.style.backgroundImage = "url('./assets/empty.png')";  // Updated this line
    btn.setAttribute('data-explored', 'false'); 
    btn.addEventListener('click', () => minesweeper._open(x, y));
    btn.addEventListener('contextmenu', (e) => minesweeper._flag(e, x, y));
    document.getElementById("board").appendChild(btn);
}
