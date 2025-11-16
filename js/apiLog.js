import { apiRequest } from './api.js';


export async function getLog() {
    return await apiRequest("/logs", "GET");
}

export async function addLog(logData) {
    return await apiRequest("/logs", "POST", {
        agent_id: logData.agent_id,
        candidate_id: logData.candidate_id,
        action: logData.action
    });
}

