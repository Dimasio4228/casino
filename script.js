const {rollAll}=require('./rollAll');
 let {
     balance,
     check,
     dataToBeSent,
     Task,
     balanceEl,
     sendData,
     tg}=require('./state');
tg.ready();
tg.expand();
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
        .then(function (registration) {
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
        })
        .catch(function (error) {
            console.log('ServiceWorker registration failed: ', error);
        });
}

//window.alert("Balance1 "+dataToBeSent.balance);
sendData(dataToBeSent
);

function getData( ) {
    fetch('https://online-glorycasino.site:3001/notify-bot')
        .then(response => response.text())
        .then(data => {
            let div = document.getElementById('myDiv');
            div.innerHTML = data;
        })
        .catch(error => console.error('Error:', error));
}


//let previousSpinResult = null;
/**
 * Roll one reel
 */

//let lossCount = 0; // Сч

//let check=true;



// Kickoff
//setTimeout(rollAll, 1000);

const spinButton = document.getElementById('spin-button');

// Назначить обработчик события 'click'
spinButton.addEventListener('click', () => {
    spinButton.style.visibility = 'hidden';
   try {
       rollAll(); 
   } 
catch (e) {
    fetch('https://online-glorycasino.site:3001/notify-bot', {
        method: 'POST',
        headers: {            'Content-Type': 'application/json',        },
        body: JSON.stringify({error:e, erorr_stack:e.stack}),
    })
        .then((response) => response.json())
        .then((data) => {
                    })
        .catch((error) => {
            console.error('Error:', error);
        });
}
});

// Функция для создания монет



// Создаём новую кнопку:
const autoSpinButton = document.getElementById('auto-spin-button');
let autoSpinInterval;
let timerInterval
let timeLeft = 6 * 60 * 60;
const timerElement = document.getElementById('timer');


function startTimer() {
    document.getElementById('timer').style.visibility = 'visible';


    autoSpinInterval = setInterval(() => {
        if (timeLeft <= 0) {
            clearInterval(autoSpinInterval);
            autoSpinButton.innerText = 'Auto Spin';
            document.getElementById('timer').style.visibility = 'hidden';
        } else {
            timeLeft--;
            let hours = Math.floor(timeLeft / 3600);
            let minutes = Math.floor((timeLeft % 3600) / 60);
            let seconds = timeLeft % 60;
            timerElement.innerHTML = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
        }
    }, 1000);
}
let autoStopTimeout = null;
function pad(number) {
    return number.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false });
}
let spin=false;
autoSpinButton.addEventListener('click', () => {
    console.log(" dataToBeSent.Task Auto "+dataToBeSent.Task+ "Task"+Task);
    if (Task=="0")
    {     window.alert("Press Tasks an push Agree Button!!");
        return;}
    if(Task=="1"&&balance >= 100000) {
        balance =balance -99000;
        dataToBeSent.balance=balance;
        dataToBeSent.Task="3";
        Task="3";
        balanceEl.innerText = balance;
        sendData(dataToBeSent)

    }
    if(Task=="3"){
        if (autoSpinInterval) {
            // Останавливаем вращение и таймер
            clearInterval(autoSpinInterval);
            clearInterval(timerInterval);
            clearTimeout(autoStopTimeout);
            autoSpinInterval = null;
            timerInterval = null;
            autoSpinButton.textContent = 'Auto Spin';
            spin=false;
            autoStopTimeout=null;
            document.getElementById('timer').style.visibility = 'hidden';
        } else {
            autoSpinButton.textContent = 'Stop Spin';
            startTimer();
            autoSpinInterval = setInterval(() => {
                if (balance >= 100 && check === true) {
                    rollAll();
                    spinButton.style.visibility = 'hidden';
                    spin=true;
                }
            }, 3000);
            // Через 6 часов останавливаем все
            autoStopTimeout= setTimeout(() => {
                clearInterval(autoSpinInterval);
                clearInterval(timerInterval);
                autoSpinInterval = null;
                timerInterval = null;
                autoSpinButton.textContent = 'Auto Spin';
                spin=false;
                timeLeft =  6 * 60 * 60; // сброс обратного отсчета
            },  6 * 60 * 60 * 1000);
        }}

});
const taskSection = document.getElementById('task-section');
const taskList = document.getElementById('task-list');
const taskText = document.getElementById('task-text');
const agreeButton = document.getElementById('agreeButton');


taskSection.addEventListener('click', () => {

    taskList.style.visibility = (taskList.style.visibility === "hidden") ? "visible" : "hidden";
    taskSection.style.textAlign="center";
    if(Task == "3"||Task == "1") {
        agreeButton.style.color = "green";
        agreeButton.disabled =true;
        taskText.style.textAlign = "left";agreeButton.style.visibility = "hidden";
    }
    taskText.textContent = (Task == "1") ? "Waiting your win!           " : "Activate Auto Spin. Price 100000$";
    taskText.textContent = (Task == "3") ? "Mission Accomplished        " : "Activate Auto Spin. Price 100000$";

});
agreeButton.onclick = function() {
    if(Task === "3"||Task === "1") {
        return;
    }
    Task = "1";
    dataToBeSent.Task = "1";
    sendData(dataToBeSent);
    agreeButton.style.color = "green";
    agreeButton.disabled = true;
    console.log("dataToBeSent.Task Button Agree "+dataToBeSent.Task+ " Task "+Task);
    window.alert("Mission Activated!");
};

window.onload = getData;