// ============================================================
//  LISTA PADRÃO DE JOGOS — este é o único arquivo que você precisa
//  editar para mudar os jogos que já vêm no site.
//
//  Regras (as mesmas do "Modo texto"):
//   - use aspas duplas "..." nos nomes das chaves e nos textos;
//   - separe os itens com vírgula, mas NÃO coloque vírgula depois do último;
//   - "icon" pode ficar "" (o site busca o ícone sozinho);
//   - "color" é opcional (ex.: "#31a7df"); sem ele o site escolhe uma cor;
//   - "blocked" diz se o firewall bloqueia o site: true = bloqueado,
//     false = liberado (sem aspas). Se faltar, vale false.
//
//  Dica: no site, o botão "Modo texto" > "Copiar código" gera este mesmo
//  formato. Cole tudo aqui, substituindo o conteúdo do arquivo.
//  Depois de editar, clique em "Restaurar" no site para ver a nova lista.
// ============================================================
const DEFAULT_GAMES = [
  {
    "name": "Eaglercraft",
    "url": "https://eaglercraft.com/play?version=1.8.8",
    "icon": "https://cdn2.steamgriddb.com/icon/bfbe6b2f89c40bfc99a3c1183b7bdbf4/32/256x256.png",
    "color": "#289d46",
    "blocked": true
  },
  {
    "name": "GTA Vice City",
    "url": "https://gtavc.armdev.cn/",
    "icon": "https://cdn2.steamgriddb.com/icon/722caafb4825ef5d8670710fa29087cf/32/256x256.png",
    "color": "#f9a7b0",
    "blocked": false
  },
  {
    "name": "Dragon Knight",
    "url": "https://dragonknight.cul4s.com/",
    "icon": "",
    "color": "#9f0004",
    "blocked": false
  },
  {
    "name": "GeoGuessr",
    "url": "https://www.geoguessr.com/pt",
    "icon": "https://cdn2.steamgriddb.com/icon/02c1ffbf4378893da347eb8ec50b2456.png",
    "color": "#9fd8ff",
    "blocked": false
  },
  {
    "name": "Street Fighter EX2",
    "url": "https://archive.org/details/arcade_sfex2#",
    "icon": "",
    "color": "#b6e4b1",
    "blocked": false
  },
  {
    "name": "Messenger",
    "url": "https://messenger.abeto.co/",
    "icon": "https://upload.wikimedia.org/wikipedia/en/3/37/Messenger_game_cover.jpg?utm_source=en.wikipedia.org&utm_campaign=index&utm_content=thumbnail_unscaled&_=20251005010412",
    "color": "#b8fee0",
    "blocked": false
  },
  {
    "name": "Skull Hotel",
    "url": "https://skullhotel.io/",
    "icon": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSSHzzA_DSn599OnJkpAvPuAne3j6LnSKg9mNUEaBZy_v-SBRT-OkgbhRc&s=10",
    "color": "#ffbd85",
    "blocked": false
  },
  {
    "name": "Border War",
    "url": "https://borderwar.io/",
    "icon": "",
    "color": "#8ee1d2",
    "blocked": false
  },
  {
    "name": "SaboStack",
    "url": "https://sabostack.com/",
    "icon": "",
    "color": "#ffcfec",
    "blocked": false
  },
  {
    "name": "Attrition",
    "url": "https://attrition.world/",
    "icon": "",
    "color": "#c9e6a4",
    "blocked": false
  },
  {
    "name": "Hex Arena",
    "url": "https://hexarena.net/",
    "icon": "",
    "color": "#b6caff",
    "blocked": false
  },
  {
    "name": "Claybound",
    "url": "https://claybound-56949.web.app/",
    "icon": "",
    "color": "#ffb7a6",
    "blocked": false
  },
  {
    "name": "Badge Factory",
    "url": "https://hervestudio.github.io/badge-factory/",
    "icon": "",
    "color": "#f6e69a",
    "blocked": false
  },
  {
    "name": "SnookerSim",
    "url": "https://snookersim.com/",
    "icon": "",
    "color": "#ffd85a",
    "blocked": false
  },
  {
    "name": "Merci Michel",
    "url": "https://no.merci-michel.com/en/",
    "icon": "",
    "color": "#f9a7b0",
    "blocked": false
  },
  {
    "name": "Doodle Shooter",
    "url": "https://doodleshooter.vercel.app/",
    "icon": "",
    "color": "#9fd8ff",
    "blocked": false
  },
  {
    "name": "Whiteout",
    "url": "https://whiteout.plgb.chatgpt.site/",
    "icon": "",
    "color": "#b6e4b1",
    "blocked": false
  },
  {
    "name": "Great Taxi Assignment",
    "url": "https://great-taxi-assignment.netlify.app/",
    "icon": "",
    "color": "#c8b6ff",
    "blocked": false
  },
  {
    "name": "Tearable",
    "url": "https://pushmatrix.github.io/tearable/",
    "icon": "",
    "color": "#ffbd85",
    "blocked": false
  },
  {
    "name": "Tiny Skies",
    "url": "https://tinyskies.vercel.app/",
    "icon": "",
    "color": "#8ee1d2",
    "blocked": false
  },
  {
    "name": "Lacoste Experience",
    "url": "https://membersexperience-create.lacoste.com/gb/en/",
    "icon": "",
    "color": "#ffcfec",
    "blocked": false
  },
  {
    "name": "Paintbut",
    "url": "https://paintbut.netlify.app/",
    "icon": "",
    "color": "#c9e6a4",
    "blocked": false
  },
  {
    "name": "Larsberg",
    "url": "https://www.larsberg.net/",
    "icon": "",
    "color": "#b6caff",
    "blocked": false
  }
];