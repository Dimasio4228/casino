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
module.exports = {createCoin};