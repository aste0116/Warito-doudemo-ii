// 描画処理
function draw() {
    // Canvasをクリアして背景を黒にする
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    
    // 1. キャラクター（猫）を描画
    if (backgroundImage) {
        ctx.imageSmoothingEnabled = false;
        
        // 1361.pngの比率を維持して下部中央に配置
        const targetWidth = 340;
        const scale = targetWidth / backgroundImage.width;
        const targetHeight = backgroundImage.height * scale;
        
        const x = (CANVAS_SIZE - targetWidth) / 2;
        // ★ここを重要修正：Canvasの高さから画像の高さを引くことで、一番下に接地させます
        const y = CANVAS_SIZE - targetHeight; 
        
        ctx.drawImage(backgroundImage, x, y, targetWidth, targetHeight);
    }
    
    // 2. 文字を描画
    const lines = textInput.value.split('\n');
    const fontSize = 90;
    
    ctx.font = `bold ${fontSize}px 'DotGothic16', sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    
    const lineHeight = fontSize * 1.05;
    // ★ここを修正：文字が上に寄りすぎないよう、開始位置を少し下に下げて調整
    const startY = 60; 
    
    ctx.strokeStyle = '#31243b'; 
    ctx.lineWidth = 24;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.fillStyle = '#a3f7bf';
    
    lines.forEach((line, index) => {
        const x = CANVAS_SIZE / 2;
        const y = startY + (index * lineHeight);
        ctx.strokeText(line, x, y);
    });
    
    lines.forEach((line, index) => {
        const x = CANVAS_SIZE / 2;
        const y = startY + (index * lineHeight);
        ctx.fillText(line, x, y);
    });
}
