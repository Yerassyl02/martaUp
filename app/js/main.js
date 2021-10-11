const menuBtn = document.querySelector('.menu-btn');
const navContact = document.querySelector('.nav_links-content')

let menuOpen = false;

menuBtn.addEventListener('click', () => {
    if (!menuOpen) {
        menuBtn.classList.add('menu_burger-open');
        navContact.classList.add('active');
        document.body.style.overflow = "hidden";
        menuOpen = true;
    } else {
        menuBtn.classList.remove('menu_burger-open');
        navContact.classList.remove('active');
        document.body.style.overflow = "visible";
        menuOpen = false;
    }
})