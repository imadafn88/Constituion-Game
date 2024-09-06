const duties = [
    { name: "Duty A: Abide by the Constitution", description: "Description A: Respect the Constitution, National Flag, and National Anthem" },
    { name: "Duty B: Cherish Noble Ideals", description: "Description B: Follow the ideals of our national struggle for freedom" },
    { name: "Duty C: Protect Sovereignty", description: "Description C: Uphold the sovereignty, unity, and integrity of India" },
    { name: "Duty D: Defend the Country", description: "Description D: Defend the country and render national service" },
    { name: "Duty E: Promote Harmony", description: "Description E: Promote harmony and renounce practices derogatory to women" }
];

let cards = [];
let flippedCards = [];
let matchedCards = 0;
let timer = 0;
let interval;
let firstFlip = false;
let score = 0;
let swapInterval;
const emptyCards = 4;

function initGame() {
    duties.forEach((duty, index) => {
        cards.push({ type: 'name', value: duty.name, id: index });
        cards.push({ type: 'description', value: duty.description, id: index });
    });

    for (let i = 0; i < emptyCards; i++) {
        cards.push({ type: 'empty', value: 'Empty Card', id: `empty-${i}` });
    }

    cards = shuffle(cards);

    const gameBoard = document.getElementById('gameBoard');
    gameBoard.innerHTML = '';
    cards.forEach((card, index) => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.dataset.id = index;
        cardElement.dataset.type = card.type;
        cardElement.dataset.value = card.id;
        cardElement.innerText = card.type === 'empty' ? 'This card is Empty.' : card.value;
        cardElement.addEventListener('click', flipCard);
        gameBoard.appendChild(cardElement);
    });

    startSwapInterval();
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function flipCard() {
    if (!firstFlip) {
        startTimer();
        firstFlip = true;
    }

    if (flippedCards.length === 2) return;

    const card = this;
    if (card.classList.contains('flip') || card.dataset.type === 'empty') return;

    card.classList.add('flip');
    document.getElementById('flipSound').play();
    flippedCards.push(card);

    if (flippedCards.length === 2) {
        checkMatch();
    }
}

function checkMatch() {
    const [card1, card2] = flippedCards;

    if (card1.dataset.value === card2.dataset.value && card1.dataset.type !== card2.dataset.type) {
        card1.classList.add('match');
        card2.classList.add('match');
        document.getElementById('matchSound').play();
        matchedCards += 2;
        flippedCards = [];
        updateScore();
        if (matchedCards === cards.length - emptyCards) {
            clearInterval(interval);
            clearInterval(swapInterval);
            document.getElementById('message').innerText = `Congratulations! You matched all the cards in ${timer} seconds and scored ${score} points!`;
            playSound();
        }
    } else {
        card1.classList.add('no-match');
        card2.classList.add('no-match');
        document.getElementById('noMatchSound').play();
        setTimeout(() => {
            card1.classList.remove('flip', 'no-match');
            card2.classList.remove('flip', 'no-match');
            flippedCards = [];
        }, 1000);
    }
}

function startTimer() {
    interval = setInterval(() => {
        timer++;
        document.getElementById('timer').innerText = `Time: ${timer} seconds`;
    }, 1000);
}

function updateScore() {
    const timeFactor = 100 - timer; // The quicker the player, the higher the score
    score += Math.max(10, timeFactor); // Minimum score per match is 10
    document.getElementById('score').innerText = `Score: ${score}`;
}

function startSwapInterval() {
    swapInterval = setInterval(() => {
        swapCards();
    }, 10000);
}

function swapCards() {
    const nonFlippedNonEmptyCards = Array.from(document.querySelectorAll('.card:not(.flip):not(.match)'))
        .filter(card => card.dataset.type !== 'empty');
    if (nonFlippedNonEmptyCards.length === 0) return;

    const emptyCardElements = Array.from(document.querySelectorAll('.card[data-type="empty"]'));
    const randomEmptyCard = emptyCardElements[Math.floor(Math.random() * emptyCardElements.length)];
    const randomNonFlippedCard = nonFlippedNonEmptyCards[Math.floor(Math.random() * nonFlippedNonEmptyCards.length)];

    document.getElementById('swapMessage').innerText = "Both cards getting swapped";
    document.getElementById('swapMessage').style.display = "block";
    document.getElementById('swapSound').play();

    randomEmptyCard.classList.add('zoom-out');
    randomNonFlippedCard.classList.add('zoom-out');

    setTimeout(() => {
        const temp = {
            type: randomEmptyCard.dataset.type,
            value: randomEmptyCard.dataset.value,
            text: randomEmptyCard.innerText
        };

        randomEmptyCard.dataset.type = randomNonFlippedCard.dataset.type;
        randomEmptyCard.dataset.value = randomNonFlippedCard.dataset.value;
        randomEmptyCard.innerText = randomNonFlippedCard.innerText;

        randomNonFlippedCard.dataset.type = temp.type;
        randomNonFlippedCard.dataset.value = temp.value;
        randomNonFlippedCard.innerText = temp.text;

        randomEmptyCard.classList.remove('zoom-out');
        randomNonFlippedCard.classList.remove('zoom-out');
        document.getElementById('swapMessage').style.display = "none";
    }, 2000);
}

function playSound() {
    const audio = new Audio('congratulations.mp3');
    audio.play();
}

initGame();
