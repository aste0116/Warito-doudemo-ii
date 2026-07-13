// 【設定】デフォルトの猫画像ファイル名
const DEFAULT_IMAGE_URL = 'cat.png'; 

const canvas = document.getElementById('preview-canvas');
const ctx = canvas.getContext('2d');
const textInput = document.getElementById('text-input');
const downloadBtn = document.getElementById('download-btn');
const resultWrap = document.getElementById('result-wrap');
const resultImg = document.getElementById('result-img');
const secretTrigger = document.getElementById('secret-trigger');
const adminUi = document.getElementById('admin-ui');
const imageInput = document.getElementById('image-input');
const resetBtn = document.getElementById('reset-btn');

const CANVAS_SIZE = 500;
canvas.width = CANVAS_SIZE;
canvas.height = CANVAS_SIZE;

let backgroundImage = null;

// 起動時にデフォルトの猫画像を自動読み込み
const defaultImg = new Image();
defaultImg.onload = () => {
    backgroundImage = defaultImg;
    draw();
};
defaultImg.onerror = () => {
    console.log("デフォルト画像が見つからないためテキストのみで描画します。");
    draw();
};
defaultImg.src = DEFAULT_IMAGE_URL;

// ★タイトルを【5回連続タップ】すると管理モードが切り替わる機能
let clickCount = 0;
let clickTimer = null;
secretTrigger.addEventListener('click', () => {
    clickCount++;
    clearTimeout(clickTimer);
    
    if (clickCount >= 5) {
        adminUi.classList.toggle('hidden');
        clickCount = 0; // カウントリセット
    } else {
        // 1秒間次のタップがなければカウントを0に戻す（連続タップ判定用）
        clickTimer = setTimeout(() => {
            clickCount = 0;
        }, 1000);
    }
});

// 管理モードで画像が選ばれたとき
imageInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
            backgroundImage = img;
            draw();
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
});

// クリアボタン
resetBtn.addEventListener('click', () => {
    imageInput.value = '';
    backgroundImage = defaultImg;
    draw();
});

textInput.addEventListener('input', draw);

// 描画処理
function draw() {
    // 1. 背景をダークグレーで塗りつぶし
    ctx.fillStyle = '#191919';
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    
    // 2. 猫画像を下部中央に接地させて描画
    if (backgroundImage) {
        const displayWidth = CANVAS_SIZE * 0.8;
        const scale = displayWidth / backgroundImage.width;
        const displayHeight = backgroundImage.height * scale;
        
        const x = (CANVAS_SIZE - displayWidth) / 2;
        const y = CANVAS_SIZE - displayHeight;
        
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(backgroundImage, x, y, displayWidth, displayHeight);
    }
    
    // 3. テキストの描画設定（2枚目のインパクトに合わせたサイズ）
    const lines = textInput.value.split('\n');
    const fontSize = 84; // 文字の大きさを大幅にアップ！
    ctx.font = `${fontSize}px 'DotGothic16', sans-serif`;
    
    // ★確実に「左上基準」で配置する設定
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    
    const lineHeight = fontSize * 1.1; // 行間
    const margin = 20; // 左上ギリギリの余白
    
    const strokeColor = '#31243b'; // 太い紫色の縁取り色
    const fillColor = '#a3f7bf';   // 文字の中身（ミントグリーン）
    const thickness = 8;           // ドット絵らしい分厚い縁の太さ
    
    // 4. 文字の縁取りをドット絵風（カクカク）に重ね描き
    // 上下左右斜めにずらして塗りつぶすことで、滑らかにせずギザギザの太いフチを作ります
    ctx.fillStyle = strokeColor;
    for (let dx = -thickness; dx <= thickness; dx += 2) {
        for (let dy = -thickness; dy <= thickness; dy += 2) {
            lines.forEach((line, index) => {
                const x = margin + dx;
                const y = margin + (index * lineHeight) + dy;
                ctx.fillText(line, x, y);
            });
        }
    }
    
    // 5. 文字の「中身」を上から描画
    ctx.fillStyle = fillColor;
    lines.forEach((line, index) => {
        const x = margin;
        const y = margin + (index * lineHeight);
        ctx.fillText(line, x, y);
    });
}

// 画像をつくるボタン
downloadBtn.addEventListener('click', () => {
    const dataUrl = canvas.toDataURL('image/png');
    resultImg.src = dataUrl;
    resultWrap.style.display = 'block';
    resultWrap.scrollIntoView({ behavior: 'smooth' });
});

document.fonts.ready.then(() => { draw(); });
draw();
