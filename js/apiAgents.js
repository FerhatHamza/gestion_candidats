import { apiRequest } from './api.js';


export async function getAgensts() {
    return await apiRequest("/agents", "GET");
}


export async function getAgenstsById(id) {
    return await apiRequest(`/agents/${id}`, "GET");
}


export async function addAgensts(AgenstseData) {
    return await apiRequest("/agents", "POST", {
        nom: AgenstseData.nom,
        username: AgenstseData.username,
        password_hash: AgenstseData.password_hash,
        role: AgenstseData.role
    });
}



export async function updateAgensts(id, AgenstseData) {
    return await apiRequest(`/agents/${id}`, "PUT", {
        nom: AgenstseData.nom,
        username: AgenstseData.username,
        password_hash: AgenstseData.password_hash,
        role: AgenstseData.role
    });
}


export async function deleteAgensts(id) {
    return await apiRequest(`/agents/${id}`, "DELETE");
}

/* -------------------------
      🔐 Login Function
-------------------------- */

export async function loginAgent(username, password) {
    return await apiRequest("/login", "POST", {
        username: username,
        password: password
    });
}