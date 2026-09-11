const SUPABASE_URL = 'https://ezzlxndxtduujngrqlmx.supabase.co';
const SUPABASE_ANON_KEY = 'Sb_publishable_3OhWxq4-FErEYXU360iyRg_NxK7hQPO';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const gridSize = 10;
const gridEl = document.getElementById('grid');
let colorToPaint = '#' + Math.floor(Math.random()*16777215).toString(16);

// 1. Build the 10x10 grid on the screen
function createGrid() {
    for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.x = x;
            cell.dataset.y = y;
            cell.id = `cell-${x}-${y}`;
            
            // Support both click and touch interactions seamlessly
            cell.addEventListener('click', () => paintCell(x, y));
            gridEl.appendChild(cell);
        }
    }
}

// 2. Fetch existing data from Supabase and paint the board
async function loadGrid() {
    const { data, error } = await supabase.from('plots').select('*');
    if (error) {
        console.error('Error loading grid:', error);
        return;
    }

    data.forEach(plot => {
        const cell = document.getElementById(`cell-${plot.x}-${plot.y}`);
        if (cell) {
            cell.style.backgroundColor = plot.color;
        }
    });
}

// 3. Save a clicked tile to Supabase
async function paintCell(x, y) {
    const cell = document.getElementById(`cell-${x}-${y}`);
    cell.style.backgroundColor = colorToPaint;

    const { error } = await supabase
        .from('plots')
        .upsert({ x: x, y: y, color: colorToPaint }, { onConflict: ['x', 'y'] });

    if (error) {
        console.error('Error saving tile:', error);
    }
}

// Initialize
createGrid();
loadGrid();
