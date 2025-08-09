// On sélectionne tous les éléments nécessaires
const timerDisplay = document.querySelector('.timer-display');
const timerProgress = document.querySelector('.timer-progress');
const toggleBtn = document.getElementById('toggle-btn');
const sequenceStatus = document.createElement('div'); // On crée un nouvel élément pour le statut
sequenceStatus.classList.add('sequence-status');
document.body.prepend(sequenceStatus); // On l'ajoute en haut de la page

let sequence = []; // Le tableau de notre séquence
let currentTimerIndex = 0; // L'index du minuteur en cours
let totalTime; // Durée totale du minuteur en cours
let timeRemaining; // Temps restant du minuteur en cours
let timerId = null;
let isPaused = false;
const circumference = 283;

// Fonctions de mise à jour de l'affichage (légèrement modifiées)
function updateTimerDisplay() {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');
    timerDisplay.textContent = `${formattedMinutes}:${formattedSeconds}`;
}

function updateTimerCircle() {
    const percentage = (timeRemaining / totalTime);
    const offset = circumference * (1 - percentage);
    timerProgress.style.strokeDashoffset = offset;
}

// Fonction pour passer au minuteur suivant
function nextTimer() {
    currentTimerIndex++;

    // Si on a parcouru tous les minuteurs
    if (currentTimerIndex >= sequence.length) {
        clearInterval(timerId);
        timerId = null;
        timerDisplay.textContent = "Séquence terminée !";
        toggleBtn.style.display = 'none';
        sequenceStatus.textContent = '';
        return;
    }

    // On initialise le minuteur suivant
    const nextTimer = sequence[currentTimerIndex];
    totalTime = nextTimer.duration;
    timeRemaining = totalTime;
    
    // On met à jour l'affichage
    updateTimerDisplay();
    updateTimerCircle();
    updateSequenceStatus();
    
    // On relance le minuteur
    startTimer();
}

// Fonction pour démarrer le minuteur en cours
function startTimer() {
    if (timerId !== null) {
        return;
    }
    
    timerId = setInterval(() => {
        timeRemaining--;
        updateTimerDisplay();
        updateTimerCircle();
        
        if (timeRemaining <= 0) {
            clearInterval(timerId);
            timerId = null;
            nextTimer(); // On passe au minuteur suivant
        }
    }, 1000);
}

// Fonction pour mettre en pause le minuteur
function pauseTimer() {
    clearInterval(timerId);
    timerId = null;
}

// Fonction pour gérer le bouton unique "Pause/Lecture"
function toggleTimer() {
    if (isPaused) {
        startTimer();
        isPaused = false;
        toggleBtn.textContent = "Pause";
        toggleBtn.classList.remove('play');
    } else {
        pauseTimer();
        isPaused = true;
        toggleBtn.textContent = "Lecture";
        toggleBtn.classList.add('play');
    }
}

// Fonction pour afficher le statut de la séquence
function updateSequenceStatus() {
  const currentTimer = sequence[currentTimerIndex];

    // Met à jour le label au-dessus du minuteur
    sequenceStatus.textContent = `${currentTimer.name} (${currentTimerIndex + 1}/${sequence.length})`;

    // Change la couleur du cercle selon le type de minuteur
    timerProgress.style.stroke = currentTimer.name === 'Repos' ? '#ff9800' : '#4CAF50';
}

// Gérer l'écouteur d'événement sur le bouton
toggleBtn.addEventListener('click', toggleTimer);

// Initialisation de l'application
function init() {
    // On récupère la séquence depuis le LocalStorage
    const storedSequence = localStorage.getItem('currentTimerSequence');
    if (storedSequence) {
        sequence = JSON.parse(storedSequence);
        if (sequence.length > 0) {
            // On initialise le premier minuteur de la séquence
            const firstTimer = sequence[currentTimerIndex];
            totalTime = firstTimer.duration;
            timeRemaining = totalTime;
            
            // On démarre la séquence
            updateTimerDisplay();
            updateTimerCircle();
            updateSequenceStatus();
            startTimer();
        }
    } else {
        // Pas de séquence, on affiche un message d'erreur
        timerDisplay.textContent = "Aucune séquence à charger.";
        toggleBtn.style.display = 'none';
    }
}

// On lance la fonction d'initialisation au chargement de la page
init();