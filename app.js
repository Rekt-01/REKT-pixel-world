import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = 'https://ezzlxndxtduujngrqlmx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV6emx4bmR4dGR1dWpuZ3JxbG14Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkxNDM3NTgsImV4cCI6MjEwNDcxOTc1OH0.03WL8_5nusD6g-j-Meujrmf-kr1rGPW06WgpX35GVSA';

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
