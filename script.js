const questions = [
    {
        question: "When facing a difficult challenge, what's often the most helpful first step?",
        options: [
            "Take time to acknowledge your feelings",
            "Immediately look for solutions",
            "Avoid thinking about it",
            "Blame yourself for the situation"
        ],
        correctAnswer: "Take time to acknowledge your feelings"
    },
    {
        question: "What can help most when feeling overwhelmed by negative thoughts?",
        options: [
            "Practicing mindfulness and staying in the present",
            "Pushing the thoughts away completely",
            "Dwelling on them to understand them better",
            "Distracting yourself with social media"
        ],
        correctAnswer: "Practicing mindfulness and staying in the present"
    },
    {
        question: "Which approach to failure tends to lead to the most growth?",
        options: [
            "Viewing it as a learning opportunity",
            "Avoiding similar situations in the future",
            "Focusing on who's to blame",
            "Pretending it didn't happen"
        ],
        correctAnswer: "Viewing it as a learning opportunity"
    },
    {
        question: "When supporting a friend through hard times, what's usually most valuable?",
        options: [
            "Listening without judgment",
            "Offering immediate solutions",
            "Sharing similar experiences you've had",
            "Telling them things could be worse"
        ],
        correctAnswer: "Listening without judgment"
    },
    {
        question: "What often helps most when feeling disconnected from others?",
        options: [
            "Making a small effort to reach out, even when difficult",
            "Waiting for others to notice and reach out first",
            "Focusing on being completely self-sufficient",
            "Spending more time on social media"
        ],
        correctAnswer: "Making a small effort to reach out, even when difficult"
    },
    {
        question: "Which perspective on change tends to be most helpful?",
        options: [
            "Seeing it as an opportunity for growth, even when painful",
            "Resisting it whenever possible",
            "Rushing through it to get it over with",
            "Seeing it as something that happens to you, not with you"
        ],
        correctAnswer: "Seeing it as an opportunity for growth, even when painful"
    },
    {
        question: "What approach to self-care is typically most sustainable?",
        options: [
            "Small, consistent actions integrated into daily life",
            "Occasional intensive self-care days",
            "Pushing through until you absolutely need a break",
            "Focusing only on physical health"
        ],
        correctAnswer: "Small, consistent actions integrated into daily life"
    },
    {
        question: "When making a difficult decision, what approach often leads to the best outcome?",
        options: [
            "Balancing emotional wisdom with practical considerations",
            "Making decisions based purely on logic",
            "Following only your gut feeling",
            "Doing what others expect of you"
        ],
        correctAnswer: "Balancing emotional wisdom with practical considerations"
    },
    {
        question: "What perspective on personal growth tends to be most realistic?",
        options: [
            "It's a non-linear journey with ups and downs",
            "It should be steady and consistent progress",
            "Once you've grown in an area, you've mastered it",
            "It's something you achieve and then you're done"
        ],
        correctAnswer: "It's a non-linear journey with ups and downs"
    },
    {
        question: "Which approach to setting goals tends to be most effective?",
        options: [
            "Setting specific, achievable steps while being flexible",
            "Setting ambitious goals without clear steps",
            "Avoiding setting goals to prevent disappointment",
            "Setting goals based mainly on what others expect"
        ],
        correctAnswer: "Setting specific, achievable steps while being flexible"
    },
    {
        question: "What often helps most when dealing with regret?",
        options: [
            "Practicing self-compassion and learning from the experience",
            "Trying to forget about what happened",
            "Punishing yourself to make up for it",
            "Convincing yourself it wasn't your fault"
        ],
        correctAnswer: "Practicing self-compassion and learning from the experience"
    },
    {
        question: "What perspective on happiness tends to be most fulfilling?",
        options: [
            "Finding meaning and purpose alongside moments of joy",
            "Pursuing constant happiness as the ultimate goal",
            "Believing happiness comes mainly from external achievements",
            "Thinking some people are just naturally happy or unhappy"
        ],
        correctAnswer: "Finding meaning and purpose alongside moments of joy"
    }
];
// DOM Elements
const screens = {
    intro: document.getElementById('intro-screen'),
    mood: document.getElementById('mood-screen'),
    game: document.getElementById('game-screen'),
    results: document.getElementById('results-screen'),
    screenshot: document.getElementById('screenshot-container')
};

const elements = {
    startBtn: document.getElementById('start-btn'),
    moodBtns: document.querySelectorAll('.mood-btn'),
    questionText: document.getElementById('question-text'),
    optionsContainer: document.getElementById('options-container'),
    currentQuestionNum: document.getElementById('current-question'),
    hearts: document.querySelectorAll('.heart'),
    skipBtn: document.getElementById('skip-btn'),
    fiftyFiftyBtn: document.getElementById('fifty-fifty-btn'),
    skipsLeft: document.getElementById('skips-left'),
    fiftyFiftyLeft: document.getElementById('fifty-fifty-left'),
    finalScore: document.getElementById('final-score'),
    resultMessage: document.getElementById('result-message'),
    shareBtn: document.getElementById('share-btn'),
    playAgainBtn: document.getElementById('play-again-btn'),
    correctSound: document.getElementById('correct-sound'),
    screenshotScoreValue: document.getElementById('screenshot-score-value'),
    screenshotMessage: document.getElementById('screenshot-message')
};

// Game State
let gameState = {
    currentMood: '',
    currentQuestionIndex: 0,
    score: 0,
    lives: 5,
    skipsLeft: 1,
    fiftyFiftyLeft: 1,
    shuffledQuestions: [],
    removedOptions: []
};

// Initialize Game
function initGame() {
    // Shuffle questions and their options
    gameState.shuffledQuestions = [...questions].map(q => {
        return {
            ...q,
            options: shuffleArray([...q.options])
        };
    });

    // Reset game state
    gameState.currentQuestionIndex = 0;
    gameState.score = 0;
    gameState.lives = 5;
    gameState.skipsLeft = 1;
    gameState.fiftyFiftyLeft = 1;
    gameState.removedOptions = [];

    // Update UI
    updateLives();
    updateLifelines();
    loadQuestion();
}

// Navigation Functions
function showScreen(screenId) {
    Object.values(screens).forEach(screen => {
        screen.classList.remove('active');
    });
    screens[screenId].classList.add('active');
}

// Event Listeners
elements.startBtn.addEventListener('click', () => {
    showScreen('mood');
});

elements.moodBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        gameState.currentMood = btn.getAttribute('data-mood');
        showScreen('game');
        initGame();
    });
});

elements.skipBtn.addEventListener('click', handleSkip);
elements.fiftyFiftyBtn.addEventListener('click', handleFiftyFifty);
elements.shareBtn.addEventListener('click', prepareScreenshot);
elements.playAgainBtn.addEventListener('click', () => {
    showScreen('mood');
});

// Game Functions
function loadQuestion() {
    if (gameState.currentQuestionIndex >= gameState.shuffledQuestions.length) {
        endGame();
        return;
    }

    const question = gameState.shuffledQuestions[gameState.currentQuestionIndex];
    elements.questionText.textContent = question.question;
    elements.currentQuestionNum.textContent = gameState.currentQuestionIndex + 1;
    
    // Clear options container
    elements.optionsContainer.innerHTML = '';
    
    // Add options
    question.options.forEach((option, index) => {
        const optionBtn = document.createElement('button');
        optionBtn.classList.add('option-btn');
        optionBtn.textContent = option;
        optionBtn.dataset.index = index;
        
        // Skip if this option was removed by 50:50
        if (gameState.removedOptions.includes(index)) {
            return;
        }
        
        optionBtn.addEventListener('click', () => handleAnswer(option));
        elements.optionsContainer.appendChild(optionBtn);
    });
    
    // Reset removed options for next question
    gameState.removedOptions = [];
}

function handleAnswer(selectedOption) {
    const currentQuestion = gameState.shuffledQuestions[gameState.currentQuestionIndex];
    const isCorrect = selectedOption === currentQuestion.correctAnswer;
    
    // Disable all option buttons
    const optionBtns = document.querySelectorAll('.option-btn');
    optionBtns.forEach(btn => {
        btn.classList.add('disabled');
        btn.disabled = true;
        
        // Highlight correct answer
        if (btn.textContent === currentQuestion.correctAnswer) {
            btn.classList.add('correct');
        }
        
        // Highlight selected incorrect answer
        if (!isCorrect && btn.textContent === selectedOption) {
            btn.classList.add('incorrect');
        }
    });
    
    // Update game state
    if (isCorrect) {
        gameState.score++;
        // Play correct sound
        playCorrectSound();
    } else {
        gameState.lives--;
        updateLives();
        // Vibrate device
        if (navigator.vibrate) {
            navigator.vibrate(300);
        }
    }
    
    // Check if game should end
    if (gameState.lives <= 0) {
        setTimeout(endGame, 1500);
        return;
    }
    
    // Move to next question after delay
    setTimeout(() => {
        gameState.currentQuestionIndex++;
        loadQuestion();
    }, 1500);
}

function handleSkip() {
    if (gameState.skipsLeft <= 0) return;
    
    gameState.skipsLeft--;
    updateLifelines();
    
    gameState.currentQuestionIndex++;
    loadQuestion();
}

function handleFiftyFifty() {
    if (gameState.fiftyFiftyLeft <= 0) return;
    
    gameState.fiftyFiftyLeft--;
    updateLifelines();
    
    const currentQuestion = gameState.shuffledQuestions[gameState.currentQuestionIndex];
    const correctAnswerIndex = currentQuestion.options.findIndex(
        option => option === currentQuestion.correctAnswer
    );
    
    // Get indices of incorrect options
    const incorrectIndices = currentQuestion.options
        .map((_, index) => index)
        .filter(index => index !== correctAnswerIndex);
    
    // Randomly select two incorrect options to remove
    const shuffledIncorrect = shuffleArray(incorrectIndices);
    const toRemove = shuffledIncorrect.slice(0, 2);
    
    gameState.removedOptions = toRemove;
    
    // Remove options from UI
    const optionBtns = document.querySelectorAll('.option-btn');
    toRemove.forEach(index => {
        optionBtns[index].style.display = 'none';
    });
}

function endGame() {
    elements.finalScore.textContent = `${gameState.score}/12`;
    elements.resultMessage.textContent = generateResultMessage();
    showScreen('results');
}

function updateLives() {
    elements.hearts.forEach((heart, index) => {
        if (index < gameState.lives) {
            heart.classList.add('active');
        } else {
            heart.classList.remove('active');
        }
    });
}

function updateLifelines() {
    elements.skipsLeft.textContent = gameState.skipsLeft;
    elements.fiftyFiftyLeft.textContent = gameState.fiftyFiftyLeft;
    
    if (gameState.skipsLeft <= 0) {
        elements.skipBtn.disabled = true;
    }
    
    if (gameState.fiftyFiftyLeft <= 0) {
        elements.fiftyFiftyBtn.disabled = true;
    }
}

function generateResultMessage() {
    if (gameState.score >= 10) {
        return "Amazing! Your thoughtful approach to life's challenges shows wisdom beyond your years. Keep nurturing that positive mindset!";
    } else if (gameState.score >= 7) {
        return "Great job! You have a healthy perspective on life's ups and downs. Your resilience will serve you well through challenges.";
    } else if (gameState.score >= 4) {
        return "Good effort! You're developing helpful perspectives on life. Remember that growth is a journey, not a destination.";
    } else {
        return "Thank you for playing! Remember that every day is a new opportunity to grow and find new perspectives on life's challenges.";
    }
}

function playCorrectSound() {
    elements.correctSound.currentTime = 0;
    elements.correctSound.play().catch(e => console.log("Audio play failed:", e));
}

// Screenshot functionality
function prepareScreenshot() {
    // Update screenshot content
    elements.screenshotScoreValue.textContent = `${gameState.score}/12`;
    elements.screenshotMessage.textContent = generateResultMessage();
    
    // Show screenshot container
    screens.screenshot.style.display = 'block';
    
    // Give time for the user to take a screenshot
    setTimeout(() => {
        alert("Take a screenshot now to share with your friends!");
        
        // Try to use native share if available
        if (navigator.share) {
            navigator.share({
                title: 'Life Reflection Game',
                text: `I scored ${gameState.score}/12 on the Life Reflection Game! How will you score? Take the quiz to find out!`,
                url: window.location.href
            }).catch(err => console.log('Error sharing:', err));
        }
        
        // Hide screenshot container after a delay
        setTimeout(() => {
            screens.screenshot.style.display = 'none';
        }, 5000);
    }, 500);
}

// Utility Functions
function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}
