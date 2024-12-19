class Game {
    constructor() {
        this.player = document.getElementById('player');
        this.platformsContainer = document.getElementById('platforms');
        this.scoreElement = document.getElementById('score');
        this.score = 0;
        this.playerPosition = { x: 370, y: 530 };
        this.facingRight = true;
        this.platforms = [];
        this.currentPlatformIndex = 0;

        this.initializeVoiceRecognition();
        this.createInitialPlatform();
        this.updatePlayerPosition();
    }

    initializeVoiceRecognition() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = true;
        this.recognition.interimResults = false;

        this.recognition.onresult = (event) => {
            const command = event.results[event.results.length - 1][0].transcript.trim().toLowerCase();
            this.handleVoiceCommand(command);
        };

        this.recognition.start();
    }

    handleVoiceCommand(command) {
        if (command.includes('jingle')) {
            this.jump(false);
        } else if (command.includes('bells')) {
            this.jump(true);
        }
    }

    createPlatform(x, y) {
        const platform = document.createElement('div');
        platform.className = 'platform';
        platform.style.left = `${x}px`;
        platform.style.top = `${y}px`;
        this.platformsContainer.appendChild(platform);
        return { element: platform, x, y };
    }

    createInitialPlatform() {
        const platform = this.createPlatform(360, 570);
        this.platforms.push(platform);
        this.generateNextPlatform();
    }

    generateNextPlatform() {
        const lastPlatform = this.platforms[this.platforms.length - 1];
        const direction = Math.random() < 0.5 ? -1 : 1;
        const x = lastPlatform.x + (direction * 100);
        const y = lastPlatform.y - 100;
        
        const platform = this.createPlatform(x, y);
        this.platforms.push(platform);
    }

    updatePlayerPosition() {
        this.player.style.left = `${this.playerPosition.x}px`;
        this.player.style.top = `${this.playerPosition.y}px`;
        // Update rotation instead of scale
        this.player.style.transform = this.facingRight ? 'rotate(0deg)' : 'rotate(180deg)';
    }

    jump(turn) {
        const nextPlatform = this.platforms[this.currentPlatformIndex + 1];
        const currentPlatform = this.platforms[this.currentPlatformIndex];
        
        if (turn) {
            this.facingRight = !this.facingRight;
        }

        const isCorrectDirection = (nextPlatform.x > currentPlatform.x && this.facingRight) ||
                                 (nextPlatform.x < currentPlatform.x && !this.facingRight);

        if (isCorrectDirection) {
            this.playerPosition.x = nextPlatform.x;
            this.playerPosition.y = nextPlatform.y - 40;
            this.currentPlatformIndex++;
            this.score++;
            this.scoreElement.textContent = this.score;
            this.generateNextPlatform();
            this.updatePlayerPosition();
        } else {
            this.gameOver();
        }
    }

    gameOver() {
        alert(`Game Over! Final Score: ${this.score}`);
        location.reload();
    }
}

const game = new Game(); 