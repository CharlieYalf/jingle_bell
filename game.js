class Game {
    constructor() {
        this.player = document.getElementById('player');
        this.platformsContainer = document.getElementById('platforms');
        this.scoreElement = document.getElementById('score');
        this.score = 0;
        this.playerPosition = {
            x: window.innerWidth <= 850 ? 270 : 370,
            y: window.innerWidth <= 850 ? 330 : 530
        };
        this.facingRight = true;
        this.platforms = [];
        this.currentPlatformIndex = 0;
        this.gameWorld = document.querySelector('.game-world');
        this.gameContainer = document.querySelector('.game-container');
        this.cameraOffset = {
            x: this.gameContainer.offsetWidth / 2,
            y: this.gameContainer.offsetHeight / 2
        };

        this.platformGap = window.innerWidth <= 850 ? 80 : 120;
        this.platformHeight = window.innerWidth <= 850 ? 70 : 100;

        this.initializeVoiceRecognition();
        this.createInitialPlatform();
        this.updatePlayerPosition();

        window.addEventListener('resize', this.handleResize.bind(this));
    }

    handleResize() {
        this.platformGap = window.innerWidth <= 850 ? 80 : 120;
        this.platformHeight = window.innerWidth <= 850 ? 70 : 100;
        this.cameraOffset = {
            x: this.gameContainer.offsetWidth / 2,
            y: this.gameContainer.offsetHeight / 2
        };
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
        const direction = Math.random() < 0.28 ? -1 : 1;
        const x = lastPlatform.x + (direction * this.platformGap);
        const y = lastPlatform.y - this.platformHeight;
        
        const platform = this.createPlatform(x, y);
        this.platforms.push(platform);

        if (this.platforms.length > 10) {
            const oldPlatform = this.platforms.shift();
            oldPlatform.element.remove();
            this.currentPlatformIndex--;
        }
    }

    updatePlayerPosition() {
        this.player.style.left = `${this.playerPosition.x}px`;
        this.player.style.top = `${this.playerPosition.y}px`;
        this.player.style.transform = this.facingRight ? 'rotate(0deg)' : 'rotate(180deg)';
        this.updateCamera();
    }

    updateCamera() {
        const targetX = -this.playerPosition.x + this.cameraOffset.x;
        const targetY = -this.playerPosition.y + this.cameraOffset.y;
        
        this.gameWorld.style.transform = `translate(${targetX}px, ${targetY}px)`;
    }

    jump(turn) {
        const nextPlatform = this.platforms[this.currentPlatformIndex + 1];
        const currentPlatform = this.platforms[this.currentPlatformIndex];
        
        if (!nextPlatform) {
            this.gameOver();
            return;
        }

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