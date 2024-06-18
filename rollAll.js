const {createCoin} = require("./coin");
 let {check,lossCount,roll,indexes,num_icons,balance,dataToBeSent,uid,
     username,Task,sendData,winEl,balanceEl,spinButton,spin}=require("./script");
function rollAll()  {
    check=false;
    const reelsList = document.querySelectorAll('.slots > .reel');

    let forcedValue = lossCount >= 3 ? Math.floor(Math.random() * num_icons) : null;
    check=false;
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
                winEl.classList.add('show');
                setTimeout(() => winEl.classList.remove('show'), 2000);
                balanceEl.innerText = balance;
            }
            // setTimeout(rollAll, 3000);
            if(spin===false)
            {spinButton.style.visibility = 'visible';}
            check= true;
        });
}
module.exports = {rollAll};