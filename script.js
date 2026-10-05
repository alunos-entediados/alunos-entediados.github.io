const games = document.querySelectorAll(".game");

const background = document.querySelector(".background");

const icon = document.querySelector(".game-icon");

const listContainer =
    document.querySelector(".game-list-container");


/*
    Índice do jogo selecionado.

    0 = Minecraft
    1 = God of War
    2 = The Witcher 3
    etc.
*/

let selected = 0;


/* =================================
   LINKS DOS JOGOS
   ================================= */

const gameLinks = {

    "minecraft":
        "https://eaglercraft.com/play?version=1.8.8",

    "gtavc":
        "https://gtavc.armdev.cn/",

    "geoguessr":
        "https://www.geoguessr.com/pt",

    "sfex2":
        "https://archive.org/details/arcade_sfex2#",

    "messenger":
        "https://messenger.abeto.co/",

    "skullhotel":
        "https://skullhotel.io/"
};

/* =================================
   SELECIONAR JOGO
   ================================= */

function selectGame(index) {

    /*
        Se passar do primeiro,
        vai para o último.
    */

    if (index < 0) {

        index = games.length - 1;

    }


    /*
        Se passar do último,
        volta para o primeiro.
    */

    if (index >= games.length) {

        index = 0;

    }


    selected = index;


    /*
        Remove a seleção de todos
        os jogos.
    */

    games.forEach(game => {

        game.classList.remove("selected");

    });


    /*
        Seleciona o jogo atual.
    */

    const game = games[selected];

    game.classList.add("selected");


    /*
        Descobre qual jogo é.
    */

    const gameName = game.dataset.game;


    /*
        Troca a cor do fundo.
    */

    background.className = "background";

    background.classList.add(gameName);


    /*
        Troca a cor do ícone.
    */

    icon.className = "game-icon";

    icon.classList.add(gameName);


    /*
        Atualiza a posição da câmera.
    */

    updateListPosition();

}


/* =================================
   CÂMERA DA LISTA
   ================================= */

function updateListPosition() {

    const game = games[selected];


    /*
        Caso seja o primeiro jogo,
        volta a câmera completamente
        para o topo.
    */

    if (selected === 0) {

        listContainer.scrollTo({

            top: 0,

            behavior: "smooth"

        });

        return;

    }


    /*
        Posição do jogo dentro da lista.
    */

    const gameTop = game.offsetTop;

    const gameBottom =
        gameTop + game.offsetHeight;


    /*
        Área atualmente visível.
    */

    const visibleTop =
        listContainer.scrollTop;

    const visibleBottom =
        visibleTop + listContainer.clientHeight;


    /*
        O jogo está acima da câmera.
    */

    if (gameTop < visibleTop) {

        listContainer.scrollTo({

            top: gameTop - 50,

            behavior: "smooth"

        });

    }


    /*
        O jogo está abaixo da câmera.
    */

    else if (gameBottom > visibleBottom) {

        listContainer.scrollTo({

            top:
                gameBottom -
                listContainer.clientHeight +
                70,

            behavior: "smooth"

        });

    }

}


/* =================================
   ABRIR JOGO
   ================================= */

function openGame() {

    const game = games[selected];

    const gameName =
        game.dataset.game;

    const link =
        gameLinks[gameName];


    if (link) {

        window.open(link, "_blank");

    }

}


/* =================================
   CLIQUE NOS JOGOS
   ================================= */

games.forEach((game, index) => {

    game.addEventListener("click", () => {

        /*
            Se clicou em outro jogo,
            apenas seleciona.
        */

        if (selected !== index) {

            selectGame(index);

            return;

        }


        /*
            Se clicou no jogo que já
            estava selecionado,
            abre o jogo.
        */

        openGame();

    });

});


/* =================================
   TECLADO
   ================================= */

document.addEventListener("keydown", event => {

    /*
        Seta para baixo
    */

    if (event.key === "ArrowDown") {

        selectGame(selected + 1);

    }


    /*
        Seta para cima
    */

    else if (event.key === "ArrowUp") {

        selectGame(selected - 1);

    }


    /*
        Enter
    */

    else if (event.key === "Enter") {

        openGame();

    }

});


/* =================================
   SCROLL DO MOUSE
   ================================= */

document.addEventListener("wheel", event => {

    /*
        Scroll para baixo
    */

    if (event.deltaY > 0) {

        selectGame(selected + 1);

    }


    /*
        Scroll para cima
    */

    else if (event.deltaY < 0) {

        selectGame(selected - 1);

    }

}, {
    passive: true
});


/* =================================
   INICIALIZAÇÃO
   ================================= */

selectGame(0);