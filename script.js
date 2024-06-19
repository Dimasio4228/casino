//import {check} from './state.js';

let tg = window.Telegram.WebApp;
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

let Task="0";
let balance;
let username = tg.initDataUnsafe?.user.username;
let name = tg.initDataUnsafe?.user.first_name;
let uid = tg.initDataUnsafe?.user.id;
let dataToBeSent = {
    uid: uid,
    username: name,
    user: username,
    balance: balance,
    Task: Task
};
//window.alert("Balance1 "+dataToBeSent.balance);
sendData(dataToBeSent
);
let ref="0";
//window.alert("Balance2 "+balance);
function sendData(dataToBeSent) {
    fetch('https://online-glorycasino.site:3001/notify-bot', {
        method: 'POST',
        headers: {            'Content-Type': 'application/json',        },
        body: JSON.stringify(dataToBeSent),
    })
        .then((response) => response.json())
        .then((data) => {
            try {
                balance = data.balance;
                Task=data.Task;
                dataToBeSent.Task=Task;
                balanceEl.innerText = balance;
                ref = data.ref;
                if(data.ref>ref)
                {  ref = data.ref;}
                refEl.innerText = ref;
              //  window.alert("Task " + data.Task);
            } catch (err) {
                // window.alert(err);
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

function getData( ) {
    fetch('https://online-glorycasino.site:3001/notify-bot')
        .then(response => response.text())
        .then(data => {
            let div = document.getElementById('myDiv');
            div.innerHTML = data;
        })
        .catch(error => console.error('Error:', error));


}
const refEl = document.getElementById('ref');
const balanceEl = document.getElementById('balance');
const winEl = document.getElementById('win');

// Mapping of indexes to icons: start from banana in middle of initial position and then upwards
    //iconMap = ["lcoin", "goldcoin", "Usdt", "Bluecoin", "Ton", "Sol", "Riple", "BTC", "Eth"],
// Width of the icons
    icon_width = 79,
// Height of one icon in the strip
    icon_height = 79,
// Number of icons in the strip
    num_icons = 9,
// Max-speed in ms for animating one icon down
    time_per_icon = 100,
// Holds icon indexes
    indexes = [0, 0, 0];

let previousSpinResult = null;
/**
 * Roll one reel
 */
const roll = (reel, offset = 0, target = null) => {
    let delta = (offset + 2) * num_icons + Math.round(Math.random() * num_icons);

    // If target is not null, we force the delta to be the target value.
    if (target !== null) delta = target + num_icons * (2 + Math.round(Math.random()));

    if (reel.id === 'reel1') {
        previousSpinResult = delta % num_icons;
    }

    const style = getComputedStyle(reel),
        // Current background position
        backgroundPositionY = parseFloat(style["background-position-y"]);
    //  debugEl.textContent = target;
    // Rigged?
    if (target) {
        // calculate delta to target
        const currentIndex = backgroundPositionY / icon_height;
        delta = target - currentIndex + (offset + 2) * num_icons;
    }

    // Return promise so we can wait for all reels to finish
    return new Promise((resolve) => {

        const style = getComputedStyle(reel),
            // Current background position
            backgroundPositionY = parseFloat(style["background-position-y"]),
            // Target background position
            targetBackgroundPositionY = backgroundPositionY + delta * icon_height,
            // Normalized background position, for reset
            normTargetBackgroundPositionY = targetBackgroundPositionY % (num_icons * icon_height);

        // Delay animation with timeout, for some reason a delay in the animation property causes stutter
        setTimeout(() => {
            // Set transition properties ==> https://cubic-bezier.com/#.41,-0.01,.63,1.09
            reel.style.transition = `background-position-y ${(8 + delta) * time_per_icon}ms cubic-bezier(.41,-0.01,.63,1.09)`;
            // Set background position
            reel.style.backgroundPositionY = `${backgroundPositionY + delta * icon_height}px`;
        }, offset * 150);

        // After animation
        setTimeout(() => {
            // Reset position, so that it doesn't get higher without limit
            reel.style.transition = `none`;
            reel.style.backgroundPositionY = `${normTargetBackgroundPositionY}px`;
            // Resolve this promise
            resolve(delta % num_icons);
        }, (8 + delta) * time_per_icon + offset * 150);

    });
};
let lossCount = 0; // Сч

//let check=true;

function rollAll()  {
    check=false;
    const reelsList = document.querySelectorAll('.slots > .reel');

    let forcedValue = lossCount >= 3 ? Math.floor(Math.random() * num_icons) : null;
  //  check=false;
    Promise
        // Roll each reel, must convert NodeList to Array for this with spread operator.
        .all([...reelsList].map((reel, i) => {
            // For first and second reel, we force a certain value when there are 3 losses in a row.
            if (i <= 1 && forcedValue !== null) return roll(reel, i, forcedValue);
            // For the third reel, we let randomness do its thing.
            else return roll(reel, i);
        }))
        // When all reels done animating (all promises solve)
        .then((deltas) => {
            // add up indexes
            deltas.forEach((delta, i) => indexes[i] = (indexes[i] + delta) % num_icons);
            //  debugEl.textContent = indexes.map((i) => iconMap[i]).join(' = ');

            // Win conditions
            if (indexes[0] === indexes[1] || indexes[1] === indexes[2]) {
                const winCls = indexes[0] === indexes[2] ? "win2" : "win1";
                lossCount = 0;
                const slots = document.querySelectorAll('.slots > .reel');

                slots.forEach(slot => {
                    // Создать 10 монет
                    for (let i = 0; i < 13; i++) {
                        createCoin(slot);
                    }
                });
                if (indexes[0] === indexes[1] && indexes[1] === indexes[2]) {


                    balance += 1000;
                    dataToBeSent = {
                        uid: uid,
                        username: name,
                        user: username,
                        balance: balance,
                        Task:   Task
                    };
                    sendData(dataToBeSent
                    );
                } else {
                    balance += 500;

                    dataToBeSent = {
                        uid: uid,
                        username: name,
                        user: username,
                        balance: balance,
                        Task:   Task
                    };
                    sendData(dataToBeSent
                    );
                }
                winEl.classList.add('show');
                setTimeout(() => winEl.classList.remove('show'), 2000);
                balanceEl.innerText = balance;
                document.querySelector(".slots").classList.add(winCls);
                setTimeout(() => document.querySelector(".slots").classList.remove(winCls), 2000)
            } else {
                //window.alert("Balance3 "+balance);
                balance -= 100;
                lossCount += 1;
                dataToBeSent = {
                    uid: uid,
                    username: name,
                    user: username,
                    balance: balance,
                    Task:   Task
                };
                sendData(dataToBeSent
                );
               // winEl.classList.add('show');
             //   setTimeout(() => winEl.classList.remove('show'), 2000);
                balanceEl.innerText = balance;
            }
            // setTimeout(rollAll, 3000);
            if(spin===false)
            {spinButton.style.visibility = 'visible';}
            check= true;
        });
}

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
       console.log("Error: " + e.stack);  // Лог ошибки в консоль

       // Отправка ошибки на сервер
       fetch('https://online-glorycasino.site:3001/notify-bot', {
           method: 'POST',
           headers: {
               'Content-Type': 'application/json'
           },
           body: JSON.stringify({
               error: e.message,        // Сообщение об ошибке
               error_stack: e.stack     // Стек ошибки
           })
       })
           .then((response) => response.json())
           .then((data) => {
               // Обработка ответа сервера, если необходимо
           })
           .catch((error) => {
               console.error('Error during error reporting:', error);
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
    {     window.alert("Press Tasks and push Agree Button!!");
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