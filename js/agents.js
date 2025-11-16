import {
    getAgensts,
    getAgenstsById,
    addAgensts,
    updateAgensts,
    deleteAgensts
} from "./apiAgents.js";

// getIDS from html
const agentAddModal = document.getElementById("agentAddModal");
const agentNameInput = document.getElementById("agentName");
const agentUsernameInput = document.getElementById("agentUsername");
const agentPasswordInput = document.getElementById("agentPassword");
const agentRoleInput = document.getElementById("agentRole");
const closeAddAgent = document.getElementById("closeAddAgent");
const saveAgent = document.getElementById("saveAgent");
const tbodyAgents = document.getElementById("tbodyAgents");
const openModel = document.getElementById("openModel");
const deleteModal = document.getElementById("deleteModal");
const deleteBtn = document.getElementById("deleteBtn");
const closeDeleteModel = document.getElementById("closeDeleteModel");
const confirmText = document.getElementById("confirmText");

var editAgentId = null;

// initial load


init();
function init() {
    bindUI();
    loadAgents();

}

function bindUI() {
    // event listeners
    if (closeAddAgent) closeAddAgent.addEventListener("click", closeAgentAddModal);
    if (saveAgent) saveAgent.addEventListener("click", saveAgentData);
    if (openModel) openModel.addEventListener("click", openAgentAddModal);
    if (closeDeleteModel) closeDeleteModel.addEventListener("click", openDeleteModal);
    if (deleteBtn) deleteBtn.addEventListener("click", deleteAgent);
    if (confirmText) confirmText.addEventListener('input', () => {
        if (confirmText.value === 'DELETE') {
            deleteBtn.disabled = false;
            deleteBtn.classList.remove('opacity-50');
        } else {
            deleteBtn.disabled = true;
            deleteBtn.classList.add('opacity-50');
        }
    });

    if (tbodyAgents) {
        tbodyAgents.addEventListener('click', (e) => {
            const btn = e.target.closest('button');
            if (!btn) return;
            editAgentId = btn.dataset.id;
            if (btn.classList.contains('delete')) {
                // console.log("Deleting agent with ID:", editAgentId);
                openDeleteModal();
            } else if (btn.classList.contains('edit')) {
                // console.log("editing agent with ID:", editAgentId);
                fillEditModel(editAgentId);
            }
            init();
        });
    }
}

function deleteAgent() {
    console.log("Deleting agent");
    if (!editAgentId) return;
    console.log("Deleting agent with ID:", editAgentId);
    console.log("confirmText:", confirmText.value);
    if (confirmText.value !== 'DELETE') return;
    deleteAgensts(editAgentId).then(() => {
        closeDeleteModal();
        loadAgents();
        editAgentId = null;
    }).catch((error) => {
        console.error("Error deleting agent:", error);
    });
}

function fillEditModel(id) {
    getAgenstsById(id).then(agentData => {
        agentNameInput.value = agentData.nom;
        agentUsernameInput.value = agentData.username;
        agentPasswordInput.value = agentData.password_hash;
        agentRoleInput.value = agentData.role;
    });
    openAgentAddModal();
}

// Open modal
function openDeleteModal() {
    deleteModal.classList.remove("hidden");
}
// Close modal
function closeDeleteModal() {
    deleteModal.classList.add("hidden");
}
// Open modal
function openAgentAddModal() {
    agentAddModal.classList.remove("hidden");
}
// Close modal
function closeAgentAddModal() {
    agentAddModal.classList.add("hidden");
}


// save agent data
async function saveAgentData() {
    const agentData = {
        nom: agentNameInput.value,
        username: agentUsernameInput.value,
        password_hash: agentPasswordInput.value,
        role: agentRoleInput.value
    };
    try {
        if (editAgentId) {
            await updateAgensts(editAgentId, agentData);
            editAgentId = null; // reset after editing
        } else {
            await addAgensts(agentData);
        }
        closeAgentAddModal();
        loadAgents();
    } catch (error) {
        console.error("Error adding agent:", error);
    }

    // Optionally, refresh the agent list or give feedback to the user
}

// Load agents and populate the table
async function loadAgents() {
    try {
        const agents = await getAgensts();
        tbodyAgents.innerHTML = ""; // Clear existing rows
        agents.forEach((agent) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td class="border px-4 py-2">${agent.id}</td>
                <td class="border px-4 py-2">${agent.nom}</td>
                <td class="border px-4 py-2">${agent.username}</td>
                <td class="border px-4 py-2">${agent.role}</td>
                <td class="border px-4 py-2 text-center space-x-2">
                    <button data-id="${agent.id}" class="edit inline-block px-3 py-1 rounded hover:bg-gray-100">✏️ تعديل</button>
                    <button data-id="${agent.id}" class="delete inline-block px-3 py-1 rounded text-red-600 hover:bg-gray-100">🗑️ حذف</button>
                </td>
            `;
            tbodyAgents.appendChild(row);
        });
    } catch (error) {
        console.error("Error loading agents:", error);
    }
}