/**
 * app.js — Premium AI Sentiment Analyser
 * Handles: AJAX analysis, 3D flip animations, keywords, percentages, and history
 */

// ========================
// DOM References
// ========================
const textInput      = document.getElementById('text-input');
const charCountEl    = document.getElementById('char-count');
const wordCountEl    = document.getElementById('word-count');
const readingTimeEl  = document.getElementById('reading-time');

const btnAnalyze     = document.getElementById('btn-analyze');
const btnReset       = document.getElementById('btn-reset');
const errorCard      = document.getElementById('error-message');

const flipContainer  = document.getElementById('flip-container');
const loadingDiv     = document.getElementById('loading-content');
const resultCard     = document.getElementById('result-card');

const resultEmoji        = document.getElementById('result-emoji');
const resultSentimentEl  = document.getElementById('result-sentiment');
const confidenceBadgeEl  = document.getElementById('confidence-badge');

const polarityValEl      = document.getElementById('polarity-value');
const subjectivityValEl  = document.getElementById('subjectivity-value');

const barPos = document.getElementById('bar-pos');
const barNeu = document.getElementById('bar-neu');
const barNeg = document.getElementById('bar-neg');

const pctPos = document.getElementById('pct-pos');
const pctNeu = document.getElementById('pct-neu');
const pctNeg = document.getElementById('pct-neg');

const keywordsContainer = document.getElementById('keywords-container');
const keywordChips      = document.getElementById('keyword-chips');

const historyList = document.getElementById('history-list');

// Canvas
const canvas  = document.getElementById('particle-canvas');
const ctx     = canvas.getContext('2d');

// New Flip Flow References
const btnResetFlip       = document.getElementById('btn-reset-flip');
const loadingProgressBar = document.getElementById('loading-progress-bar');
const loadingProgressText = document.getElementById('loading-progress-text');
const resultContent      = document.getElementById('result-content');

// ========================
// Constants
// ========================
const EXAMPLE_TEXTS = {
    positive: "I absolutely love this! The team did an incredible job and the results have been outstanding. Truly one of the best experiences I have ever had. Highly recommend this to everyone!",
    neutral:  "The report was submitted on Monday. It includes the data collected from last quarter. A follow-up meeting has been scheduled for next week.",
    negative: "This is absolutely terrible. The service was completely broken, no one responded to my messages, and the entire experience left me deeply frustrated and disappointed."
};

// ========================
// Particle System
// ========================
function resizeCanvas() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

let particles = [];
class Particle {
    constructor() {
        this.reset();
    }
    reset() {
        this.x     = Math.random() * canvas.width;
        this.y     = Math.random() * canvas.height;
        this.vx    = (Math.random() - 0.5) * 1.5;
        this.vy    = -(Math.random() * 2 + 0.5);
        this.size  = Math.random() * 3 + 1;
        this.alpha = Math.random();
        this.alphaV= Math.random() * 0.02 + 0.005;
        this.color = `hsl(${260 + Math.random() * 80}, 80%, 70%)`; // purple/pink theme
    }
    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= this.alphaV;
        if (this.alpha <= 0 || this.y < -20) return false;
        return true;
    }
    draw() {
        ctx.save();
        ctx.globalAlpha = Math.max(0, this.alpha);
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

let animFrameId = null;
function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if(Math.random() < 0.2) particles.push(new Particle()); // continuously add ambient particles
    
    particles = particles.filter(p => {
        const alive = p.update();
        if (alive) p.draw();
        return alive;
    });
    animFrameId = requestAnimationFrame(animateParticles);
}
// Start ambient background particles
animateParticles();


// ========================
// Text Statistics
// ========================
function updateTextStats() {
    const text   = textInput.value;
    const chars  = text.length;
    const words  = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
    const mins   = Math.max(1, Math.ceil(words / 200));

    charCountEl.textContent   = `${chars} chars`;
    wordCountEl.textContent   = `${words} words`;
    readingTimeEl.textContent = `${mins} min read`;
}

// ========================
// Error Handling
// ========================
function showError(msg) {
    errorCard.textContent = `⚠️  ${msg}`;
    errorCard.classList.remove('hidden');
}
function hideError() {
    errorCard.classList.add('hidden');
}

// ========================
// AI Loading Sequence
// ========================
async function playLoadingSequence() {
    btnAnalyze.disabled = true;
    
    // Display loading state and hide old results first
    resultContent.classList.add('hidden');
    loadingDiv.classList.remove('hidden');

    // Trigger flip animation immediately
    flipContainer.classList.add('flipped');

    const steps = [
        document.getElementById('load-step-1'),
        document.getElementById('load-step-2'),
        document.getElementById('load-step-3'),
        document.getElementById('load-step-4')
    ];

    // Reset steps
    steps.forEach(s => {
        s.classList.remove('active');
        s.classList.remove('done');
    });
    
    // Reset progress bar
    loadingProgressBar.style.width = '0%';
    loadingProgressText.textContent = '0%';

    // Animate progress bar percentage count up
    let progress = 0;
    const progressInterval = setInterval(() => {
        progress += 4;
        if (progress > 100) progress = 100;
        loadingProgressBar.style.width = `${progress}%`;
        loadingProgressText.textContent = `${progress}%`;
        if (progress === 100) clearInterval(progressInterval);
    }, 60);
    
    for (let i = 0; i < steps.length; i++) {
        steps[i].classList.add('active');
        // Wait
        await new Promise(r => setTimeout(r, 450));
        steps[i].classList.remove('active');
        steps[i].classList.add('done');
    }

    clearInterval(progressInterval);
    loadingProgressBar.style.width = '100%';
    loadingProgressText.textContent = '100%';
}

// ========================
// Populate Result Card
// ========================
function populateResult(data) {
    // 1. Emoji & Label
    const emoji = data.sentiment === 'Positive' ? '😊'
                : data.sentiment === 'Negative' ? '😞' : '😐';
    resultEmoji.textContent = emoji;
    resultSentimentEl.textContent = data.sentiment;

    // 2. Confidence Badge
    const absP = Math.abs(data.polarity);
    let conf = 'Low Confidence';
    if (absP >= 0.6 && data.subjectivity >= 0.5) conf = 'Very Confident';
    else if (absP >= 0.3 && data.subjectivity >= 0.3) conf = 'Moderately Confident';
    else if (absP === 0 && data.subjectivity < 0.2) conf = 'Objective / Factual';
    confidenceBadgeEl.textContent = conf;

    // 3. Card State Colors
    resultCard.classList.remove('state-positive', 'state-negative', 'state-neutral');
    if (data.sentiment === 'Positive') resultCard.classList.add('state-positive');
    else if (data.sentiment === 'Negative') resultCard.classList.add('state-negative');
    else resultCard.classList.add('state-neutral');

    // 4. Metrics
    polarityValEl.textContent = data.polarity.toFixed(2);
    subjectivityValEl.textContent = data.subjectivity.toFixed(2);

    // 5. Percentages (Reset first, animate later)
    barPos.style.width = '0%';
    barNeu.style.width = '0%';
    barNeg.style.width = '0%';
    
    pctPos.textContent = `${data.percentages.positive}%`;
    pctNeu.textContent = `${data.percentages.neutral}%`;
    pctNeg.textContent = `${data.percentages.negative}%`;

    // 6. Keywords
    if (data.keywords && data.keywords.length > 0) {
        keywordsContainer.classList.remove('hidden');
        keywordChips.innerHTML = data.keywords.map(kw => `<div class="k-chip">${kw}</div>`).join('');
    } else {
        keywordsContainer.classList.add('hidden');
    }
}

function animateProgressBars(data) {
    // Trigger CSS transitions
    setTimeout(() => {
        barPos.style.width = `${data.percentages.positive}%`;
        barNeu.style.width = `${data.percentages.neutral}%`;
        barNeg.style.width = `${data.percentages.negative}%`;
    }, 200); // Wait for flip animation to partially complete
}

// ========================
// Perform Analysis
// ========================
async function performAnalysis() {
    const text = textInput.value.trim();
    if (!text) { showError('Please enter some text before analysing.'); return; }
    if (text.length > 5000) { showError('Text is too long.'); return; }

    hideError();

    // Start UI Sequence and API call simultaneously
    const sequencePromise = playLoadingSequence();
    
    let apiData = null;
    let apiError = null;

    try {
        const response = await fetch('/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Server error');
        apiData = data;
    } catch (err) {
        apiError = err;
    }

    // Wait for the loading sequence to finish completely
    await sequencePromise;

    if (apiError) {
        showError(apiError.message);
        btnAnalyze.disabled = false;
        
        // Unflip back to front if there's an error
        flipContainer.classList.remove('flipped');
        setTimeout(() => {
            loadingDiv.classList.add('hidden');
            resultContent.classList.remove('hidden');
        }, 600);
        return;
    }

    // Populate Back Card
    populateResult(apiData);
    
    // Hide loading content and show actual result content on the back card
    loadingDiv.classList.add('hidden');
    resultContent.classList.remove('hidden');
    
    // Animate progress bars on the back
    animateProgressBars(apiData);

    // Save history
    addToHistory(text, apiData);
    
    btnAnalyze.disabled = false;
}


// ========================
// Reset App
// ========================
function resetApp() {
    textInput.value = '';
    updateTextStats();
    hideError();
    
    // Unflip card
    flipContainer.classList.remove('flipped');
    
    // Reset back side after flip finishes
    setTimeout(() => {
        loadingDiv.classList.add('hidden');
        resultContent.classList.remove('hidden');
        
        // Reset bars
        barPos.style.width = '0%';
        barNeu.style.width = '0%';
        barNeg.style.width = '0%';
    }, 600); // match css transition duration
}

// ========================
// History
// ========================
let history = JSON.parse(localStorage.getItem('sentimentHistory') || '[]');
renderHistory();

function addToHistory(text, data) {
    const snippet = text.length > 45 ? text.slice(0, 45) + '…' : text;
    history.unshift({
        text: snippet,
        sentiment: data.sentiment,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    if (history.length > 5) history.pop();
    localStorage.setItem('sentimentHistory', JSON.stringify(history));
    renderHistory();
}

function renderHistory() {
    if (history.length === 0) {
        historyList.innerHTML = `
            <div class="empty-history fade-in">
                <div class="empty-icon">📝</div>
                <p>No analyses yet.</p>
                <span>Start by entering some text.</span>
            </div>`;
        return;
    }

    historyList.innerHTML = '';
    history.forEach(item => {
        let bClass = 'badge-neu';
        if (item.sentiment === 'Positive') { bClass = 'badge-pos'; }
        if (item.sentiment === 'Negative') { bClass = 'badge-neg'; }

        // Dynamic inline style for badge since we removed old CSS classes
        let badgeStyle = "background: rgba(245,158,11,0.2); color: #f59e0b;";
        if (item.sentiment === 'Positive') badgeStyle = "background: rgba(34,197,94,0.2); color: #22c55e;";
        if (item.sentiment === 'Negative') badgeStyle = "background: rgba(239,68,68,0.2); color: #ef4444;";

        const div = document.createElement('div');
        div.className = 'history-item fade-in hover-lift';
        div.innerHTML = `
            <div class="history-text" title="${item.text}">${item.text}</div>
            <div class="history-meta" style="display:flex; align-items:center; gap:0.8rem;">
                <span class="history-badge" style="${badgeStyle}">${item.sentiment}</span>
                <span class="history-time" style="font-size:0.8rem; color:#cbd5e1;">${item.time}</span>
            </div>
        `;
        historyList.appendChild(div);
    });
}

// ========================
// Event Listeners
// ========================
textInput.addEventListener('input', updateTextStats);
btnAnalyze.addEventListener('click', performAnalysis);
btnReset.addEventListener('click', resetApp);
if (btnResetFlip) {
    btnResetFlip.addEventListener('click', resetApp);
}
const btnResultBack = document.getElementById('btn-result-back');
if (btnResultBack) {
    btnResultBack.addEventListener('click', resetApp);
}

document.getElementById('btn-example-pos').addEventListener('click', () => { textInput.value = EXAMPLE_TEXTS.positive; updateTextStats(); });
document.getElementById('btn-example-neu').addEventListener('click', () => { textInput.value = EXAMPLE_TEXTS.neutral; updateTextStats(); });
document.getElementById('btn-example-neg').addEventListener('click', () => { textInput.value = EXAMPLE_TEXTS.negative; updateTextStats(); });

textInput.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'Enter') performAnalysis();
});

// ========================
// Dynamic Height Adjustment
// ========================
const flipScene = document.querySelector('.flip-scene');
const inputCard = document.querySelector('.input-card');

function adjustHeight() {
    if (!flipScene) return;
    const isFlipped = flipContainer.classList.contains('flipped');
    const activeCard = isFlipped ? resultCard : inputCard;
    if (activeCard) {
        const height = activeCard.offsetHeight;
        if (height > 0) {
            flipScene.style.height = `${height}px`;
        }
    }
}

if (window.ResizeObserver) {
    const resizeObserver = new ResizeObserver(() => adjustHeight());
    if (inputCard) resizeObserver.observe(inputCard);
    if (resultCard) resizeObserver.observe(resultCard);
}

const mutationObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
            adjustHeight();
        }
    });
});
if (flipContainer) {
    mutationObserver.observe(flipContainer, { attributes: true });
}

// Init
updateTextStats();
// Allow layout to render then adjust height
setTimeout(adjustHeight, 50);
