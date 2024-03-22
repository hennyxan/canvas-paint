document.addEventListener('DOMContentLoaded', function () {
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');
    let isDrawing = false;
    let currentTool = 'pen';

    function startDrawing(e) {
        isDrawing = true;
        draw(e);
    }

    function stopDrawing() {
        isDrawing = false;
        context.beginPath();
    }

    function draw(e) {
        if (!isDrawing) return;

        const colorSelect = document.getElementById('colorSelect');
        const selectedColor = colorSelect.options[colorSelect.selectedIndex].value;
        const customColor = document.getElementById('color').value;
        const lineWidth = document.getElementById('lineWidth').value;

        context.lineWidth = lineWidth;
        context.lineCap = 'round';
        context.strokeStyle = customColor !== '#000000' ? customColor : selectedColor;

        if (currentTool === 'pen') {
            context.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
            context.stroke();
            context.beginPath();
            context.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
        } else if (currentTool === 'eraser') {
            context.clearRect(
                e.clientX - canvas.offsetLeft - 5,
                e.clientY - canvas.offsetTop - 5,
                10,
                10
            );
        } else if (currentTool === 'brush') {
            context.globalAlpha = 0.5;
            context.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
            context.stroke();
            context.beginPath();
            context.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
            context.globalAlpha = 1;
        } else if (currentTool === 'spray') {
            for (let i = 0; i < 10; i++) {
                const x = e.clientX - canvas.offsetLeft + Math.random() * 20 - 10;
                const y = e.clientY - canvas.offsetTop + Math.random() * 20 - 10;
                context.fillStyle = customColor !== '#000000' ? customColor : selectedColor;
                context.fillRect(x, y, 1, 1);
            }
        }
    }

    function clearCanvas() {
        context.clearRect(0, 0, canvas.width, canvas.height);
    }

    function saveCanvas() {
        const dataUrl = canvas.toDataURL();
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = 'canvas_image.png';
        link.click();
    }

    function resizeCanvas() {
        const canvasWidth = document.getElementById('canvasWidth').value;
        const canvasHeight = document.getElementById('canvasHeight').value;
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        clearCanvas();
    }

    function handleFileSelect(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const img = new Image();
                img.onload = function () {
                    context.drawImage(img, 0, 0, canvas.width, canvas.height);
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    }

    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);

    const clearButton = document.getElementById('clearButton');
    clearButton.addEventListener('click', clearCanvas);

    const saveButton = document.getElementById('saveButton');
    saveButton.addEventListener('click', saveCanvas);

    const resizeButton = document.getElementById('resizeButton');
    resizeButton.addEventListener('click', resizeCanvas);

    const fileInput = document.getElementById('fileInput');
    fileInput.addEventListener('change', handleFileSelect);

    const eraserButton = document.getElementById('eraserButton');
    eraserButton.addEventListener('click', function () {
        currentTool = 'eraser';
    });

    const brushButton = document.getElementById('brushButton');
    brushButton.addEventListener('click', function () {
        currentTool = 'brush';
    });

    const sprayButton = document.getElementById('sprayButton');
    sprayButton.addEventListener('click', function () {
        currentTool = 'spray';
    });

    const pencilButton = document.getElementById('pencilButton'); // Получаем кнопку "Pencil"
    pencilButton.addEventListener('click', function () { // Добавляем обработчик события
        currentTool = 'pen'; // Устанавливаем текущий инструмент обратно на карандаш
    });
});