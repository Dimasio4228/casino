let tg = window.Telegram.WebApp;

let check=true;
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


let refEl = document.getElementById('ref');
let balanceEl = document.getElementById('balance');
let winEl = document.getElementById('win');
module.exports = {
    check,

    balance,
    dataToBeSent,
    uid,
    username,
    Task,

    winEl,
    balanceEl,
    sendData,
    tg
};