const form = document.getElementById('timer-form');
const sequenceList = document.getElementById('sequence-list-items');
const sequenceNameInput = document.getElementById('sequence-name');
const saveSequenceBtn = document.getElementById('save-sequence-btn');
const startSequenceBtn = document.getElementById('start-sequence-btn');
const savedSequencesList = document.getElementById('saved-sequences-list');

let currentSequence = []; // Le tableau de la séquence en cours de création

// Fonction pour sauvegarder la séquence actuelle
function saveSequence() {
    const name = sequenceNameInput.value;
    if (name.trim() === '' || currentSequence.length === 0) {
        alert('Veuillez donner un nom à la séquence et ajouter des minuteurs.');
        return;
    }

    // On récupère toutes les séquences existantes
    const savedSequences = JSON.parse(localStorage.getItem('savedSequences')) || {};
    savedSequences[name] = currentSequence;

    // On met à jour le localStorage
    localStorage.setItem('savedSequences', JSON.stringify(savedSequences));

    // On réinitialise l'interface
    currentSequence = [];
    sequenceList.innerHTML = '';
    sequenceNameInput.value = '';
    
    // On met à jour l'affichage des séquences sauvegardées
    renderSavedSequences();
}

// Fonction pour afficher une séquence sauvegardée
function renderSavedSequences() {
    savedSequencesList.innerHTML = ''; // On vide la liste
    const savedSequences = JSON.parse(localStorage.getItem('savedSequences')) || {};
    
    for (const name in savedSequences) {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${name}</span>
            <div>
                <button class="load-btn" data-name="${name}">Charger</button>
                <button class="delete-btn-saved" data-name="${name}">Supprimer</button>
            </div>
        `;
        savedSequencesList.appendChild(li);
    }
}

// Fonction pour charger une séquence sauvegardée
function loadSequence(name) {
    const savedSequences = JSON.parse(localStorage.getItem('savedSequences')) || {};
    const sequenceToLoad = savedSequences[name];
    
    if (sequenceToLoad) {
        currentSequence = sequenceToLoad;
        sequenceList.innerHTML = '';
        sequenceToLoad.forEach(timer => {
            const li = document.createElement('li');
            li.innerHTML = `<span>${timer.name}: ${timer.duration}s</span>`;
            sequenceList.appendChild(li);
        });
        sequenceNameInput.value = name;
    }
}

// Fonction pour supprimer une séquence
function deleteSequence(name) {
    const savedSequences = JSON.parse(localStorage.getItem('savedSequences')) || {};
    delete savedSequences[name];
    localStorage.setItem('savedSequences', JSON.stringify(savedSequences));
    renderSavedSequences();
}

// Gérer la soumission du formulaire d'ajout de minuteur
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('timer-name').value;
    const duration = parseInt(document.getElementById('timer-duration').value, 10);
    
    currentSequence.push({ name: name, duration: duration });
    currentSequence.push({ name: 'Repos', duration: 5 }); // Ajout du minuteur de repos
    
    const li = document.createElement('li');
    li.innerHTML = `<span>${name}: ${duration}s</span>`;
    sequenceList.appendChild(li);
    
    const liRepos = document.createElement('li');
    liRepos.innerHTML = `<span>Repos: 5s</span>`;
    sequenceList.appendChild(liRepos);

    form.reset();
});

// Gérer le lancement de la séquence
startSequenceBtn.addEventListener('click', () => {
    if (currentSequence.length === 0) {
        alert('Veuillez d\'abord ajouter des minuteurs à la séquence.');
        return;
    }
    localStorage.setItem('currentTimerSequence', JSON.stringify(currentSequence));
    window.location.href = 'index.html';
});

// Gérer la sauvegarde de la séquence
saveSequenceBtn.addEventListener('click', saveSequence);

// Gérer le chargement et la suppression des séquences sauvegardées
savedSequencesList.addEventListener('click', (e) => {
    if (e.target.classList.contains('load-btn')) {
        loadSequence(e.target.dataset.name);
    }
    if (e.target.classList.contains('delete-btn-saved')) {
        deleteSequence(e.target.dataset.name);
    }
});

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', renderSavedSequences);