class GuessingGame {
    constructor() {
        this.secretNumber = null;
        this.attempts = 0;
        this.maxAttempts = 10;
        this.guessHistory = [];
        this.bestScore = this.getStoredBestScore();
        this.difficulty = 'medium';
        this.range = { min: 1, max: 100 };
        
        this.initializeElements();
        this.setupEventListeners();
        this.newGame();
        this.updateBestScoreDisplay();
    }
    
    initializeElements() {
        this.guessInput = document.getElementById('guessInput');
        this.guessBtn = document.getElementById('guessBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.messageEl = document.getElementById('message');
        this.attemptsEl = document.getElementById('attempts');
        this.bestScoreEl = document.getElementById('bestScore');
        this.hintEl = document.getElementById('hint');
        this.historyListEl = document.getElementById('historyList');
        this.difficultyBtns = document.querySelectorAll('.difficulty-btn');
    }
    
    setupEventListeners() {
        if (this.guessBtn) {
            this.guessBtn.addEventListener('click', () => this.makeGuess());
        }
        if (this.resetBtn) {
            this.resetBtn.addEventListener('click', () => this.newGame());
        }
        if (this.guessInput) {
            this.guessInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') this.makeGuess();
            });
        }
        
        this.difficultyBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setDifficulty(e.target.dataset.diff);
            });
        });
    }
    
    setDifficulty(level) {
        this.difficulty = level;
        
        switch(level) {
            case 'easy':
                this.range = { min: 1, max: 50 };
                break;
            case 'medium':
                this.range = { min: 1, max: 100 };
                break;
            case 'hard':
                this.range = { min: 1, max: 200 };
                break;
        }
        
        this.difficultyBtns.forEach(btn => {
            btn.classList.remove('active');
            if(btn.dataset.diff === level) {
                btn.classList.add('active');
            }
        });
        
        this.newGame();
        this.showMessage(`Difficulty changed to ${level.toUpperCase()}! Range: ${this.range.min}-${this.range.max}`, 'info');
    }
    
    newGame() {
        this.secretNumber = Math.floor(Math.random() * (this.range.max - this.range.min + 1)) + this.range.min;
        this.attempts = 0;
        this.guessHistory = [];
        this.updateAttemptsDisplay();
        this.updateHistoryDisplay();
        this.showMessage(`🎮 New game started! Guess between ${this.range.min} and ${this.range.max}`, 'success');
        this.updateHint('');
        if (this.guessInput) {
            this.guessInput.value = '';
            this.guessInput.disabled = false;
            this.guessInput.focus();
        }
        if (this.guessBtn) {
            this.guessBtn.disabled = false;
        }
    }
    
    makeGuess() {
        if (!this.guessInput) {
            return;
        }

        const guess = parseInt(this.guessInput.value, 10);
        
        if (isNaN(guess)) {
            this.showMessage('❌ Please enter a valid number!', 'error');
            return;
        }
        
        if (guess < this.range.min || guess > this.range.max) {
            this.showMessage(`❌ Please guess between ${this.range.min} and ${this.range.max}!`, 'error');
            return;
        }
        
        if (this.guessHistory.includes(guess)) {
            this.showMessage('⚠️ You already guessed that number!', 'warning');
            return;
        }
        
        this.attempts++;
        this.guessHistory.push(guess);
        this.updateAttemptsDisplay();
        this.updateHistoryDisplay();
        
        if (guess === this.secretNumber) {
            this.handleWin();
        } else if (this.attempts >= this.maxAttempts) {
            this.handleLoss();
        } else {
            this.handleIncorrectGuess(guess);
        }
        
        if (this.guessInput) {
            this.guessInput.value = '';
            this.guessInput.focus();
        }
    }
    
    handleWin() {
        this.showMessage(`🎉 Congratulations! You guessed it in ${this.attempts} attempts! 🎉`, 'success');
        if (this.guessInput) {
            this.guessInput.disabled = true;
        }
        if (this.guessBtn) {
            this.guessBtn.disabled = true;
        }
        this.updateHint('🎯 Perfect guess!');
        
        if (!this.bestScore || this.attempts < this.bestScore) {
            this.bestScore = this.attempts;
            localStorage.setItem('bestScore', this.bestScore);
            this.updateBestScoreDisplay();
            this.showMessage(`🏆 New record! Best score: ${this.bestScore} attempts!`, 'success');
        }
    }
    
    handleLoss() {
        this.showMessage(`😔 Game Over! The number was ${this.secretNumber}.`, 'error');
        if (this.guessInput) {
            this.guessInput.disabled = true;
        }
        if (this.guessBtn) {
            this.guessBtn.disabled = true;
        }
        this.updateHint(`💡 The number was ${this.secretNumber}`);
    }
    
    handleIncorrectGuess(guess) {
        const difference = Math.abs(this.secretNumber - guess);
        let hint = '';
        let message = '';
        
        if (guess < this.secretNumber) {
            message = `📈 ${guess} is too low!`;
            hint = '📈 Go higher!';
        } else {
            message = `📉 ${guess} is too high!`;
            hint = '📉 Go lower!';
        }
        
        if (difference <= 5) {
            message += ' 🔥 Extremely close!';
            hint += ' 🔥 Burning hot!';
        } else if (difference <= 10) {
            message += ' 🎯 Very close!';
            hint += ' 🎯 Getting warmer!';
        } else if (difference <= 20) {
            message += ' 📍 Getting closer!';
            hint += ' 📍 Warm!';
        } else {
            message += ' ❄️ Too far!';
            hint += ' ❄️ Cold!';
        }
        
        message += ` (${this.maxAttempts - this.attempts} attempts left)`;
        
        this.showMessage(message, 'info');
        this.updateHint(hint);
    }
    
    showMessage(msg, type) {
        if (this.messageEl) {
            this.messageEl.textContent = msg;
            const colors = {
                success: '#48bb78',
                error: '#f56565',
                warning: '#ed8936',
                info: '#4299e1'
            };
            this.messageEl.style.color = colors[type] || '#4a5568';
        }
    }
    
    updateHint(hint) {
        if (this.hintEl) {
            this.hintEl.textContent = hint || '🤔';
        }
    }
    
    updateAttemptsDisplay() {
        if (this.attemptsEl) {
            this.attemptsEl.textContent = `${this.attempts}/${this.maxAttempts}`;
        }
    }
    
    updateBestScoreDisplay() {
        if (this.bestScoreEl) {
            this.bestScoreEl.textContent = this.bestScore !== null ? this.bestScore : '-';
        }
    }
    
    updateHistoryDisplay() {
        if (this.historyListEl) {
            this.historyListEl.innerHTML = '';
            this.guessHistory.forEach(guess => {
                const historyItem = document.createElement('span');
                historyItem.className = 'history-item';
                historyItem.textContent = guess;
                this.historyListEl.appendChild(historyItem);
            });
        }
    }

    getStoredBestScore() {
        const storedScore = localStorage.getItem('bestScore');
        if (storedScore === null) return null;

        const parsedScore = Number(storedScore);
        return Number.isFinite(parsedScore) ? parsedScore : null;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new GuessingGame();
});