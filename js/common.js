document.addEventListener('DOMContentLoaded', () => {
    // 1. 햄버거 메뉴 토글 로직 (Header common logic)
    const header = document.querySelector('header');
    const hamMenu = document.querySelector('.hamMenu');

    if (hamMenu) {
        hamMenu.addEventListener('click', () => {
            header.classList.toggle('on');
        });
    }

    // 2. 스크롤 방향 감지 및 헤더 노출/숨김
    let lastScrollTop = 0;
    const delta = 10;

    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        // 미세한 이동은 무시
        if (Math.abs(lastScrollTop - scrollTop) <= delta) return;

        if (scrollTop > lastScrollTop && scrollTop > 110) {
            // 아래로 스크롤 시 숨김
            header.classList.add('hide_header');
        } else {
            // 위로 스크롤 시 나타남
            header.classList.remove('hide_header');
        }

        lastScrollTop = scrollTop;
    });
});//dom end