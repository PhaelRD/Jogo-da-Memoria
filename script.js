document.addEventListener('DOMContentLoaded', () => {
    let playerName = prompt("Por favor, digite seu nome:");

    // Verificar se o nome foi inserido e não está vazio
    if (!playerName) {
        playerName = "Jogador"; // Nome padrão caso nenhum nome seja inserido
    }

    const playerNameDisplay = document.getElementById('playerName');
    const editNameButton = document.getElementById('editNameButton');
    const leaderboardDisplay = document.getElementById('leaderboard');

    function updatePlayerName(newName) {
        playerName = newName || playerName; // Use o novo nome se fornecido, caso contrário, mantenha o nome atual
        playerNameDisplay.textContent = playerName;
    }

    updatePlayerName(); // Exibir o nome do jogador inicial

    editNameButton.addEventListener('click', () => {
        const newName = prompt("Por favor, digite um novo nome:", playerName);
        updatePlayerName(newName);
    });

    // Carregar os registros do armazenamento local
    let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];

    function updateLeaderboard() {
        // Ordenar os registros por tempo e, em seguida, por movimentos
        leaderboard.sort((a, b) => {
            if (a.time === b.time) {
                return a.moves - b.moves;
            }
            return a.time - b.time;
        });

        // Limitar a exibição a apenas os 10 melhores registros
        leaderboard = leaderboard.slice(0, 10);

        // Exibir os registros no leaderboardDisplay
        leaderboardDisplay.innerHTML = '<h2>Top 10 Jogadores</h2>';
        leaderboard.forEach((record, index) => {
            leaderboardDisplay.innerHTML += `<p>${index + 1}. ${record.name} - ${record.moves} movimentos em ${record.time} segundos</p>`;
        });
    }

    function addRecordToLeaderboard(moves, time) {
        leaderboard.push({ name: playerName, moves, time });
        localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
        updateLeaderboard();
    }

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
            addRecordToLeaderboard(moves, seconds);
            alert(`Parabéns, ${playerName}! Você venceu em ${moves} movimentos e ${seconds} segundos.`);
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

    updateLeaderboard(); // Exibir o leaderboard ao iniciar o jogo

    startGame();
});
