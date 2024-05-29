let tg = window.Telegram.WebApp;

let user;
let queryId;
tg.ready();
    tg.expand();



user=tg.initData.name;
queryId=tg.initDataUnsafe.username
const data={user:'hello',q:'7777777777'};


tg.MainButton.text = "Changed Text"; //изменяем текст кнопки

tg.MainButton.textColor = "#F55353"; //изменяем цвет текста кнопки
tg.MainButton.color = "#143F6B"; //изменяем цвет бэкграунда кнопки
tg.MainButton.setParams({"color": "#143F6B"}); //так изменяются все параметры




const debugEl = document.getElementById('debug'),
// Mapping of indexes to icons: start from banana in middle of initial position and then upwards
    iconMap = ["banana", "seven", "cherry", "plum", "orange", "bell", "bar", "lemon", "melon"],
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


        const
            // Target background position
            targetBackgroundPositionY = backgroundPositionY + delta * icon_height,
            // Normalized background position, for reset
            normTargetBackgroundPositionY = targetBackgroundPositionY % (num_icons * icon_height);

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
            resolve(delta % num_icons);
        }, (8 + 1 * delta) * time_per_icon + offset * 150);

    });
};


/**
 * Roll all reels, when promise resolves roll again
 */
function rollAll() {

    const reelsList = document.querySelectorAll('.slots > .reel');

    // rig the outcome for every 3rd roll, if targets is set to null, the outcome will not get rigged by the roll function
    const targets = window.timesRolled && window.timesRolled % 2 ? [6, 6, 6] : null;
    if (!window.timesRolled) window.timesRolled = 0;
    window.timesRolled++;

    debugEl.textContent = user ? `User name: ${user}  ` : `No user data Query ${queryId}`;

    Promise

        // Activate each reel, must convert NodeList to Array for this with spread operator
        .all([...reelsList].map((reel, i) => roll(reel, i, targets ? targets[i] : null)))

        // When all reels done animating (all promises solve)
        .then(deltas => {
            // add up indexes
            deltas.forEach((delta, i) => indexes[i] = (indexes[i] + delta) % num_icons);
            debugEl.textContent = indexes.map(i => iconMap[i]).join(' - ');

            // Win conditions
            if (indexes[0] == indexes[1] || indexes[1] == indexes[2]) {
                const winCls = indexes[0] == indexes[2] ? "win2" : "win1";
                document.querySelector(".slots").classList.add(winCls);
                setTimeout(() => document.querySelector(".slots").classList.remove(winCls), 2000);
            }

            // Again!
            setTimeout(rollAll, 3000);
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
  try{  tg.sendData(data);}
    catch (e) {
        window.alert(`${e}`);
    }
    //при клике на основную кнопку отправляем данные в строковом виде
});
let usercard = document.getElementById("usercard"); //получаем блок usercard

let profName = document.createElement('p'); //создаем параграф
profName.innerText = `${tg.initDataUnsafe.user.first_name}
${tg.initDataUnsafe.user.last_name}
${tg.initDataUnsafe.user.username} (${tg.initDataUnsafe.user.language_code})`;
//выдем имя, "фамилию", через тире username и код языка
usercard.appendChild(profName); //добавляем

let userid = document.createElement('p'); //создаем еще параграф
userid.innerText = `${tg.initDataUnsafe.user.id}`; //показываем user_id
usercard.appendChild(userid); //добавляем