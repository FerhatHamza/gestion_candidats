import { loginAgent } from './apiAgents.js';


const username = document.getElementById('username');
const password = document.getElementById('password');
const loginBtn = document.getElementById('loginBtn');

init();
function init() {
    if (loginBtn) {
        loginBtn.addEventListener('click', login);
    }

}

async function login() {
    const user = username.value;
    const pass = password.value;
    try {
        const response = await loginAgent(user, pass);
        console.log('Login response:', response);
        if (response.success) {
            localStorage.setItem("username", response.agent.nom);
            localStorage.setItem("role", response.agent.role);
            localStorage.setItem("agent_id", response.agent.id);
            window.location.href = 'candidats.html';
        } else {
            alert('Login failed: ' + response.message);
        }
    } catch (error) {
        console.error('Error during login:', error);
        alert('An error occurred during login. Please try again later.');
    }
}