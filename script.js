const API_BASE = 'http://localhost:5000/api';
let currentUserId = null;

// Tab functionality
function showTab(tabName) {
// Hide all tabs
document.querySelectorAll('.tab-content').forEach(tab => {
tab.classList.remove('active');
});
document.querySelectorAll('.tab-btn').forEach(btn => {
btn.classList.remove('active');
});

// Show selected tab
document.getElementById(tabName).classList.add('active');
event.target.classList.add('active');
}

// Message system
function showMessage(message, type = 'success') {
const messagesContainer = document.getElementById('messages');
const messageEl = document.createElement('div');
messageEl.className = `message ${type}`;
messageEl.innerHTML = `
<div style="display: flex; justify-content: space-between; align-items: center;">
<span>${message}</span>
<button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; color: white; cursor: pointer;

