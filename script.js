document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('gameBoard');
    const movesCounter = document.getElementById('moves');
    const timerDisplay = document.getElementById('timer');
    const restartButton = document.getElementById('restartButton');

    let moves = 0;
    let timer;
    let seconds = 0;
    let lockBoard = false;
    let firstCard, secondCard;

    const emojisArray = [
        '🐶', '🐶', '🐱', '🐱', '🐭', '🐭', '🐹', '🐹',
        '🐰', '🐰', '🦊', '🦊', '🐻', '🐻', '🐼', '🐼'
    ];

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function startGame() {
        shuffle(emojisArray);
        gameBoard.innerHTML = '';
        emojisArray.forEach((emoji) => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.dataset.value = emoji;
            card.innerHTML = `<span>${emoji}</span>`;
            card.querySelector('span').style.visibility = 'hidden';
            card.addEventListener('click', flipCard);
            gameBoard.appendChild(card);
        });

        moves = 0;
        movesCounter.textContent = `Movimentos: ${moves}`;
        seconds = 0;
        timerDisplay.textContent = `Tempo: ${seconds}s`;

        clearInterval(timer);
        timer = setInterval(() => {
            seconds++;
            timerDisplay.textContent = `Tempo: ${seconds}s`;
        }, 1000);
    }

    function flipCard() {
        if (lockBoard) return;
        if (this === firstCard) return;

        this.classList.add('flipped');
        this.querySelector('span').style.visibility = 'visible';

        if (!firstCard) {
            firstCard = this;
            return;
        }

        secondCard = this;
        lockBoard = true;

        moves++;
        movesCounter.textContent = `Movimentos: ${moves}`;

        checkForMatch();
    }

    function checkForMatch() {
        const isMatch = firstCard.dataset.value === secondCard.dataset.value;
        isMatch ? disableCards() : unflipCards();
    }

    function disableCards() {
        firstCard.classList.add('matched');
        secondCard.classList.add('matched');
        resetBoard();

        if (document.querySelectorAll('.card.matched').length === emojisArray.length) {
            clearInterval(timer);
            alert(`Parabéns! Você venceu em ${moves} movimentos e ${seconds} segundos.`);
        }
    }

    function unflipCards() {
        setTimeout(() => {
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
            firstCard.querySelector('span').style.visibility = 'hidden';
            secondCard.querySelector('span').style.visibility = 'hidden';
            resetBoard();
        }, 1000);
    }

    function resetBoard() {
        [firstCard, secondCard, lockBoard] = [null, null, false];
    }

    restartButton.addEventListener('click', startGame);

    startGame();
});
