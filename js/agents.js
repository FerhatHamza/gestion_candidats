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

    if (tbodyAgents) {
        tbodyAgents.addEventListener('click', (e) => {
            const btn = e.target.closest('button');
            if (!btn) return;
            editAgentId = btn.dataset.id;
            if (btn.classList.contains('delete')) {
                console.log("Deleting agent with ID:", editAgentId);
                openAgentAddModal();
            } else if (btn.classList.contains('edit')) {
                console.log("editing agent with ID:", editAgentId);
                closeAgentAddModal();
            }
            init();
        });
    }
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
        await addAgensts(agentData);
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