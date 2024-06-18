
function sendDataToServer(userId, data) {
    fetch(`/api/timer-state`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, ...data }),
    });
}

// Восстановление состояния таймера при запуске приложения
function restoreTimerState() {
    fetch(`/api/timer-state/${userId}`)
        .then(response => response.json())
        .then(data => {
            if (data.state === 'running') {
                timeLeft = data.remainingTime;
                balance += data.earnedBalance;
                balanceEl.innerText = balance;
                startTimer();
            }
        });
}

module.exports = {
    restoreTimerState,
    sendDataToServer
};