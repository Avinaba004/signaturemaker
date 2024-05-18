document.addEventListener("DOMContentLoaded", function() {
    const colorPicker = document.getElementById("colorPicker");
    const canvasColor = document.getElementById("canvasColor");
    const canvas = document.getElementById("myCanvas");
    const clearButton = document.getElementById("clearButton");
    const downloadButton = document.getElementById("downloadButton");
    const lineWidthSlider = document.getElementById("lineWidthSlider");
    const lineWidthValue = document.getElementById('lineWidthValue');

    let isDrawing = false;
    let startX, startY; 
    let lastX, lastY; 
    const undoKey = 'z'; 
    const redoKey = 'y'; 
    const undoStack = []; 
    const redoStack = []; 
    const ctx = canvas.getContext('2d');
    
    canvas.width = 800;
    canvas.height = 500;
    ctx.fillStyle = canvasColor.value;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = colorPicker.value;
    ctx.lineWidth = lineWidthSlider.value;

    colorPicker.addEventListener('change', (event) => {
        ctx.strokeStyle = event.target.value;
    });

    canvasColor.addEventListener('change', (event) => {
        ctx.fillStyle = event.target.value;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    });

    lineWidthSlider.addEventListener('input', (event) => {
        const lineWidth = event.target.value;
        ctx.lineWidth = lineWidth; 
        lineWidthValue.textContent = lineWidth; 
    });

    canvas.addEventListener('mousedown', (event) => {
        if (event.button === 0) { 
            isDrawing = true;
            lastX = event.offsetX;
            lastY = event.offsetY;
            ctx.beginPath();
            ctx.moveTo(lastX, lastY);
        }
    });

    canvas.addEventListener('mousemove', (event) => {
        if (isDrawing) {
            ctx.lineTo(event.offsetX, event.offsetY);
            ctx.stroke();
            lastX = event.offsetX;
            lastY = event.offsetY;
        }
    });

    canvas.addEventListener('mouseup', () => {
        if (isDrawing) {
            isDrawing = false;
            undoStack.push(ctx.getImageData(0, 0, canvas.width, canvas.height)); 
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            isDrawing = false;
        } else if (event.key === undoKey && event.ctrlKey && undoStack.length > 0) {
            redoStack.push(undoStack.pop());
            if (undoStack.length > 0) {
                ctx.putImageData(undoStack[undoStack.length - 1], 0, 0);
            } else {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        } else if (event.key === redoKey && event.ctrlKey && redoStack.length > 0) {
            const redoImage = redoStack.pop();
            undoStack.push(redoImage);
            ctx.putImageData(redoImage, 0, 0);
        }
    });

    function clearCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = canvasColor.value;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    clearButton.addEventListener('click', () => {
        clearCanvas();
        undoStack.length = 0;
        redoStack.length = 0;
    });

    downloadButton.addEventListener('click', () => {
        const link = document.createElement('a');
        link.download = 'avinaba.png';
        link.href = canvas.toDataURL();
        link.click();
    });
});
