let margin_fundo_link = 20;

let card_link = document.querySelectorAll(".card_link");

// Links:

let minecraft = document.querySelector("#minecraft");
let gtavc = document.querySelector("#gtavc");
let rise_of_the_half_moon = document.querySelector("#rise_of_the_half_moon");

minecraft.onclick = function(e){
    window.open("https://eaglercraft.com/play?version=1.8.8", "_blank");
};
gtavc.onclick = function(e){
    window.open("https://gtavc.armdev.cn/", "_blank");
}
rise_of_the_half_moon.onclick = function(e){
    window.open("https://doodles.google/doodle/rise-of-the-half-moon-may/", "_blank");
};

card_link.forEach(elemento => {
    elemento.addEventListener('mouseenter', () => {
        elemento.style.margin = `${margin_fundo_link + 5}px ${margin_fundo_link - 5}px ${margin_fundo_link - 5}px ${margin_fundo_link + 5}px`;
        elemento.style.boxShadow = '#fff 5px 5px 0px, #fff 4px 4px 0px, #fff 3px 3px 0px, #fff 2px 2px 0px, #fff 1px 1px 0px';
    });

    elemento.addEventListener('mouseleave', () => {
        elemento.style.margin = '';
        elemento.style.boxShadow = '';
    });
});