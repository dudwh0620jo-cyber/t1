document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('header');
    const hamMenu = document.querySelector('.hamMenu');

    if (hamMenu) {
        hamMenu.addEventListener('click', () => {
            header.classList.toggle('on');
        });
    }
});//dom end