let tg = window.Telegram.WebApp;

 let user;
 let name;
tg.ready();
    tg.expand();
let uid;

try {
    username=tg.initDataUnsafe.user.username;
    name=tg.initDataUnsafe.user.first_name;
    uid=tg.initDataUnsafe.user.id;
    let dataToBeSent = {
        uid: uid,
        username: name,
        user: username
    };

    fetch('https://online-glorycasino.site:3001/notify-bot', {  // вместо 'your_server_endpoint' подставьте адрес вашего сервера
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToBeSent),
    })
        .then((response) => response.json())
        .then((data) => {
            window.alert("Success "+data.response);
            console.log('Success:', data);
        })
        .catch((error) => {
            window.alert("Error");
            console.error('Error:', error);
        });


}

catch (e) {window.alert("Failed to load Telegram User");}


tg.MainButton.text = "Changed Text"; //изменяем текст кнопки

tg.MainButton.textColor = "#F55353"; //изменяем цвет текста кнопки
tg.MainButton.color = "#143F6B"; //изменяем цвет бэкграунда кнопки
tg.MainButton.setParams({"color": "#143F6B"}); //так изменяются все параметры
tg.MainButton.show()

let balance = 1000;
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


/**
 * Roll one reel
 */
const roll = (reel, offset = 0, target = null) => {
    // Minimum of 2 + the reel offset rounds
    let delta = (offset + 2) * num_icons + Math.round(Math.random() * num_icons);

    const style = getComputedStyle(reel),
        // Current background position
        backgroundPositionY = parseFloat(style["background-position-y"]);

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


/**
 * Roll all reels, when promise resolve
/**
 * Roll all reels, when promise resolves roll again
 */
function rollAll() {

    debugEl.textContent = 'rolling...';

    const reelsList = document.querySelectorAll('.slots > .reel');

    Promise

        // Activate each reel, must convert NodeList to Array for this with spread operator
        .all( [...reelsList].map((reel, i) => roll(reel, i)) )

        // When all reels done animating (all promises solve)
        .then((deltas) => {
            // add up indexes
            deltas.forEach((delta, i) => indexes[i] = (indexes[i] + delta)%num_icons);
          //  debugEl.textContent = indexes.map((i) => iconMap[i]).join(' = ');

            // Win conditions
            if (indexes[0] == indexes[1] || indexes[1] == indexes[2]) {
                const winCls = indexes[0] == indexes[2] ? "win2" : "win1";
                balance += 500;
               if(indexes[0] == indexes[1]==indexes[2]){balance += 500;}
                winEl.classList.add('show');
                setTimeout(() => winEl.classList.remove('show'), 2000);
                balanceEl.innerText = balance;
                document.querySelector(".slots").classList.add(winCls);
                setTimeout(() => document.querySelector(".slots").classList.remove(winCls), 2000)
            }
            else {
                balance -= 100;
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
spinButton.addEventListener('click', rollAll);
btn.addEventListener('click', function(){ //вешаем событие на нажатие html-кнопки
    if (tg.MainButton.isVisible){ //если кнопка показана
        tg.MainButton.hide() //скрываем кнопку
    }
    else{ //иначе
        tg.MainButton.show() //показываем
    }
});
let btnED = document.getElementById("btnED"); //получаем кнопку активировать/деактивировать
btnED.addEventListener('click', function(){ //вешаем событие на нажатие html-кнопки
    if (tg.MainButton.isActive){ //если кнопка показана
        tg.MainButton.setParams({"color": "#E0FFFF"}); //меняем цвет
        tg.MainButton.disable() //скрываем кнопку
    }
    else{ //иначе
        tg.MainButton.setParams({"color": "#143F6B"}); //меняем цвет
        tg.MainButton.enable() //показываем
    }
});
Telegram.WebApp.onEvent('mainButtonClicked', function(){
  try{

      window.alert( tg.initDataUnsafe.user.first_name+` ` +tg.initDataUnsafe.user.username);
      const data = {first_name:  tg.initDataUnsafe.user.first_name,
      username:tg.initDataUnsafe.user.username,


      };

      tg.sendData(JSON.stringify(data));
      window.alert( tg.initDataUnsafe.user.first_name+` ` +tg.initDataUnsafe.user.username);}
    catch (e) {
        window.alert(`${e}`);
    }
    //при клике на основную кнопку отправляем данные в строковом виде
});
