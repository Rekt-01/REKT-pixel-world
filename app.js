import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = 'https://ezzlxndxtduujngrqlmx.supabase.co';
const SUPABASE_ANON_KEY = 'Sb_publishable_3OhWxq4-FErEYXU360iyRg_NxK7hQPO';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function showError(msg) {
    const box = document.getElementById('error-box');
    if (box) {
        box.style.display = 'block';
        box.innerText += msg + '\n';
    }
}

window.addEventListener('error', (event) => {
    showError('JS Error: ' + event.message);
});

try {
    const gridSize = 10;
    const gridEl = document.getElementById('grid');
    let colorToPaint = '#' + Math.floor(Math.random()*16777215).toString(16);

    function createGrid() {
        for (let y = 0; y < gridSize; y++) {
            for (let x = 0; x < gridSize; x++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                cell.id = `cell-${x}-${y}`;
                cell.addEventListener('click', () => paintCell(x, y));
                gridEl.appendChild(cell);
            }
        }
    }

    async function loadGrid() {
        const { data, error } = await supabase.from('plots').select('*');
        if (error) {
            showError('Supabase Load Error: ' + JSON.stringify(error));
            return;
        }
        data.forEach(plot => {
            const cell = document.getElementById(`cell-${plot.x}-${plot.y}`);
            if (cell) cell.style.backgroundColor = plot.color;
        });
    }

    async function paintCell(x, y) {
        const cell = document.getElementById(`cell-${x}-${y}`);
        cell.style.backgroundColor = colorToPaint;
        const { error } = await supabase
            .from('plots')
            .upsert({ x: x, y: y, color: colorToPaint }, { onConflict: ['x', 'y'] });
        if (error) {
            showError('Supabase Save Error: ' + JSON.stringify(error));
        }
    }

    createGrid();
    loadGrid();

} catch (err) {
    showError('Init Error: ' + err.message);
}
