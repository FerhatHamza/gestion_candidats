import { getLog } from './apiLog.js';

const tbodyLog = document.getElementById('tbodyLog');

loadLogs();
export async function loadLogs() {
    try {
        const logs = await getLog();
        console.log("Logs loaded:", logs);
        renderLogs(logs);
        return logs;
    } catch (error) {
        console.error("Error loading logs:", error);
        return [];
    }
}


function renderLogs(logs) {
    tbodyLog.innerHTML = '';
    logs.forEach(log => {
        const tr = document.createElement('tr');
        tr.classList.add('border-b', 'hover:bg-gray-50');
        tr.innerHTML = `
            <td class="px-4 py-2">${new Date(log.timestamp).toLocaleString()}</td>
            <td class="px-4 py-2">${log.agent_name || 'Unknown'}</td>
            <td class="px-4 py-2">${log.candidate_id}</td>
            <td class="px-4 py-2">${log.action}</td>
        `;
        tbodyLog.appendChild(tr);
    });
}