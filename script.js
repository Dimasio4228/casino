import {   MiniAppsMethods } from "@tma/sdk";
MiniAppsMethods.web_app_request_phone();

let tg = window.Telegram.WebApp;
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
        .then(function(registration) {
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
        })
        .catch(function(error) {
            console.log('ServiceWorker registration failed: ', error);
        });
}
document.querySelector("#phone-button").addEventListener("click", function() {
    MiniAppsMethods.web_app_request_phone();
});
tg.ready();
    tg.expand();
let balance;
let username=tg.initDataUnsafe?.user.username;
let name=tg.initDataUnsafe?.user.first_name;
let uid=tg.initDataUnsafe?.user.id;
let dataToBeSent = {
    uid: uid,
    username: name,
    user: username,
    balance: balance
};
//window.alert("Balance1 "+dataToBeSent.balance);
sendData(dataToBeSent,
    data => console.log('777:', data),
    error => console.log('Error:', error)
);
//window.alert("Balance2 "+balance);
 function sendData(dataToBeSent, onSuccess, onError) {
    fetch('https://online-glorycasino.site:3001/notify-bot', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToBeSent),
    })
        .then((response) => response.json())
        .then((data) => {
           // window.alert("Success "+data.balance);

                try {
                    balance = data.balance;
                    balanceEl.innerText = balance;
                   // window.alert("bal " + data.balance);
                } catch (err) {
                   // window.alert(err);
                }

        })
        .catch((error) => {
            console.error('Error:', error);
        });
}


const balanceEl = document.getElementById('balance');
const winEl = document.getElementById('win');

const debugEl = document.getElementById('debug'),
// Mapping of indexes to icons: start from banana in middle of initial position and then upwards
    iconMap = ["lcoin", "goldcoin", "Usdt", "Bluecoin", "Ton", "Sol", "Riple", "BTC", "Eth"],
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

    // Rest of your roll function...

    // At the end of the spin (you may need to put this elsewhere depending on your specific implementation)
    // If it's the first reel, store the spin result
    if (reel.id === 'reel1') {
         previousSpinResult = delta%num_icons;
    }

    const style = getComputedStyle(reel),
        // Current background position
        backgroundPositionY = parseFloat(style["background-position-y"]);
    debugEl.textContent = target;
    // Rigged?
    if (target) {
        // calculate delta to target
        const currentIndex = backgroundPositionY / icon_height;
        delta = target - currentIndex + (offset + 2) * num_icons;
    }

    // Return promise so we can wait for all reels to finish
    return new Promise((resolve, reject) => {

        const style = getComputedStyle(reel),
            // Current background position
            backgroundPositionY = parseFloat(style["background-position-y"]),
            // Target background position
            targetBackgroundPositionY = backgroundPositionY + delta * icon_height,
            // Normalized background position, for reset
            normTargetBackgroundPositionY = targetBackgroundPositionY%(num_icons * icon_height);

        // Delay animation with timeout, for some reason a delay in the animation property causes stutter
        setTimeout(() => {
            // Set transition properties ==> https://cubic-bezier.com/#.41,-0.01,.63,1.09
            reel.style.transition = `background-position-y ${(8 + 1 * delta) * time_per_icon}ms cubic-bezier(.41,-0.01,.63,1.09)`;
            // Set background position
            reel.style.backgroundPositionY = `${backgroundPositionY + delta * icon_height}px`;
        }, offset * 150);

        // After animation
        setTimeout(() => {
            // Reset position, so that it doesn't get higher without limit
            reel.style.transition = `none`;
            reel.style.backgroundPositionY = `${normTargetBackgroundPositionY}px`;
            // Resolve this promise
            resolve(delta%num_icons);
        }, (8 + 1 * delta) * time_per_icon + offset * 150);

    });
};
let lossCount = 0; // Сч
/**
 * Roll all reels, when promise resolve
/**
 * Roll all reels, when promise resolves roll again
 */
function rollAll() {
    const reelsList = document.querySelectorAll('.slots > .reel');

    let forcedValue = lossCount >= 3 ? Math.floor(Math.random() * num_icons) : null;

    Promise
        // Roll each reel, must convert NodeList to Array for this with spread operator.
        .all( [...reelsList].map((reel, i) => {
            // For first and second reel, we force a certain value when there are 3 losses in a row.
            if (i <= 1 && forcedValue !== null) return roll(reel, i, forcedValue);
            // For the third reel, we let randomness do its thing.
            else return roll(reel, i);
        }))
        // When all reels done animating (all promises solve)
        .then((deltas) => {
            // add up indexes
            deltas.forEach((delta, i) => indexes[i] = (indexes[i] + delta)%num_icons);
          //  debugEl.textContent = indexes.map((i) => iconMap[i]).join(' = ');

            // Win conditions
            if (indexes[0] == indexes[1] || indexes[1] == indexes[2]) {
                const winCls = indexes[0] == indexes[2] ? "win2" : "win1";
                lossCount = 0;
                const slots = document.querySelectorAll('.slots > .reel');

                slots.forEach(slot => {
                    // Создать 10 монет
                    for (let i = 0; i < 13; i++) {
                        createCoin(slot);
                    }
                });
                if(indexes[0] == indexes[1]&&indexes[1]==indexes[2])
                {balance += 500;
                    dataToBeSent = {
                        uid: uid,
                        username: name,
                        user: username,
                        balance: balance
                    };
                    sendData(dataToBeSent,
                        data => console.log('Success:', data),
                        error => console.log('Error:', error)
                    );}
                  else {
                    balance += 500;

                    dataToBeSent = {
                        uid: uid,
                        username: name,
                        user: username,
                        balance: balance
                    };
                    sendData(dataToBeSent,
                        data => console.log('Success:', data),
                        error => console.log('Error:', error)
                    );
                }
                winEl.classList.add('show');
                setTimeout(() => winEl.classList.remove('show'), 2000);
                balanceEl.innerText = balance;
                document.querySelector(".slots").classList.add(winCls);
                setTimeout(() => document.querySelector(".slots").classList.remove(winCls), 2000)
            }
            else {
                //window.alert("Balance3 "+balance);
                balance -= 100;
                lossCount += 1;
                dataToBeSent = {
                    uid: uid,
                    username: name,
                    user: username,
                    balance: balance
                };
                sendData(dataToBeSent,
                    data => console.log('Success:', data),
                    error => console.log('Error:', error)
                );
                winEl.classList.add('show');
                setTimeout(() => winEl.classList.remove('show'), 2000);
                balanceEl.innerText = balance;
            }
           // setTimeout(rollAll, 3000);

        });
};

// Kickoff
//setTimeout(rollAll, 1000);

const spinButton = document.getElementById('spin-button');
const btn = document.getElementById('btn');
// Назначить обработчик события 'click'
spinButton.addEventListener('click', () => {
    // Spin the reels
    rollAll();

});
// Функция для создания монет
function createCoin(slotElement) {
    const template = document.getElementById("coin-template");
    const coin = template.cloneNode(true);
    coin.id = ""; // сброс ID
    coin.hidden = false; // делаем видимым

    // Получить позицию и размеры слота
    const slotRect = slotElement.getBoundingClientRect();

    // Задать начальное положение монеты из середины слота
    coin.style.left = `${slotRect.left + slotRect.width / 2}px`;
    coin.style.top = `${slotRect.top + slotRect.height / 2}px`;

    // Задать различные траектории полета монет (можно экспериментировать с этими значениями)
    coin.style.setProperty("animation-duration", `${2 + Math.random()}s`);
    coin.style.setProperty("animation-timing-function", `cubic-bezier(${Math.random()}, ${Math.random()}, ${Math.random()}, ${Math.random()})`);

    document.body.appendChild(coin); // Add new coin to DOM

    // Удалить монету из DOM после окончания анимации
    coin.addEventListener("animationend", () => {
        coin.remove();
    });
}