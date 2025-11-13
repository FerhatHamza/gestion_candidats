import { getCandidats, addCandidat } from './apiCondidates.js';

const saveBtn = document.getElementById('saveCandidateBtn');
const firstNameInput = document.getElementById('firstName');
const lastNameInput = document.getElementById('lastName');
const sexInput = document.getElementById('sex');
const birthDateInput = document.getElementById('birthDate');
const placeOfBirthInput = document.getElementById('placeOfBirth');
const addressLineInput = document.getElementById('addressLine');
const phoneInput = document.getElementById('phone');
const emailInput = document.getElementById('email');
const familySituationInput = document.getElementById('familySituation');
const numberOfChildrenInput = document.getElementById('numberOfChildren');
const tableBody = document.getElementById('candidatesTableBody');
// doc
const demande_ecrite = document.getElementById("demande_ecrite");
const copyOfID = document.getElementById("copyOfID");
const diplome = document.getElementById("diplome");
const releve_notes = document.getElementById("releve_notes");
const certificat_service = document.getElementById("certificat_service");
const photos = document.getElementById("photos");
const enveloppes = document.getElementById("enveloppes");
const attestations_travail = document.getElementById("attestations_travail");
const autres_pieces = document.getElementById("autres_pieces");


init();
function init() {
    getAllCandidats();
}


saveBtn.addEventListener('click', () => {
    var lastID = null;
    const s = sexInput.value == 'ذكر' ? 'man' : 'woman'
    const fs = familySituationInput.value == 'أعزب' ? 'single' : familySituationInput.value == 'متزوج' ? 'married' : familySituationInput.value == 'مطلق' ? 'divorced' : 'widowed';
    const candidateData = {
        firstName: firstNameInput.value.trim(),
        lastName: lastNameInput.value.trim(),
        sex: s,
        birthDate: birthDateInput.value.trim(),
        placeOfBirth: placeOfBirthInput.value.trim(),
        addressLine: addressLineInput.value.trim(),
        phone: phoneInput.value.trim(),
        email: emailInput.value.trim(),
        familySituation: fs,
        numberOfChildren: numberOfChildrenInput.value,
    };

    addCandidat(candidateData).then(response => {
        console.log("Candidat ajouté avec succès:", response);
        lastID = response.id;
        addDocuments({
            candidate_id: lastID,
            demande_ecrite: demande_ecrite.checked ? 1 : 0,
            copyOfID: demande_ecrite.checked ? 1 : 0,
            diplome: demande_ecrite.checked ? 1 : 0,
            releve_notes: demande_ecrite.checked ? 1 : 0,
            certificat_service: demande_ecrite.checked ? 1 : 0,
            photos: demande_ecrite.checked ? 1 : 0,
            enveloppes: demande_ecrite.checked ? 1 : 0,
            attestations_travail: demande_ecrite.checked ? 1 : 0,
            autres_pieces: autres_pieces.value.trim() || null
        }).then(() => {
            console.log("Document associé ajouté avec succès pour le candidat ID:", lastID)
        });
        // Optionally, refresh the candidate list or clear the form here
    }
    ).catch(error => {
        console.error("Erreur lors de l'ajout du candidat:", error);
    });

    console.log("Candidate Data:", candidateData);
});

function getAllCandidats() {
    getCandidats().then(candidates => {
        console.log("All Candidates:", candidates);
        fillTable(candidates);

    }).catch(err => {
        console.error("Error fetching candidates:", err);
    });
}

function fillTable(candidates) {

    tableBody.innerHTML = '';
    candidates.forEach(candidate => {
        const row = document.createElement('tr');
        row.classList.add('border-b', 'hover:bg-gray-50');
        row.innerHTML = `
            <td class="px-4 py-2">${candidate.firstName}</td>
            <td class="px-4 py-2">${candidate.lastName}</td>
            <td class="px-4 py-2">${candidate.sex}</td>
            <td class="px-4 py-2">${candidate.phone}</td>
            <td class="px-4 py-2 text-red-600 font-medium">OK</td>
            <td class="px-4 py-2 text-center space-x-3">
                <button class="text-green-600 hover:underline">
                  ✏️ Modifier
                </button>
                <button id="${candidate.id}" class="text-red-600 hover:underline">
                  🗑️ Supprimer
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}


function deleteCondidate(id) {
    console.log("Delete candidate with ID:", id);
}