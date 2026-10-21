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
    "icon": "imglocal",
    "color": "#9f0004",
    "blocked": false
  },
  {
    "name": "20 Minutes Till Dawn",
    "url": "https://truffled.lol/unityframe.html?url=/games/20minutesbog/index.html",
    "icon": "https://cdn2.steamgriddb.com/grid/6077a04dd6e9a9544fe03634ed1365e7.png",
    "color": "#ed333b",
    "blocked": false
  },
  {
    "name": "The Simpsons: Hit & Run",
    "url": "https://shar-wasm.cjoseph.workers.dev/",
    "icon": "https://cdn2.steamgriddb.com/icon/61603780b437fb53aceb2563ccce02a4.png",
    "color": "#f9f06b",
    "blocked": false
  },
  {
    "name": "Mario Kart 64",
    "url": "https://truffled.lol/iframe.html?url=/games/mk64/index.html",
    "icon": "https://cdn2.steamgriddb.com/grid/e5494d23b18b5c822bcaa9fe8fd077bf.jpg",
    "color": "#f66151",
    "blocked": false
  },
  {
    "name": "PEAK",
    "url": "https://wasm.rip/files/peak/PEAK.html",
    "icon": "https://cdn2.steamgriddb.com/grid/912a54ae38d2a8f697ced133314a3b6c.png",
    "color": "#f6e69a",
    "blocked": false
  },
  {
    "name": "Halo",
    "url": "https://openhaloce.com/",
    "icon": "https://cdn2.steamgriddb.com/grid/44ffb6f94b5ec5366ba0f896f7f0f680.png",
    "color": "#57e389",
    "blocked": false
  },
  {
    "name": "Tiny Skies",
    "url": "https://tinyskies.vercel.app/",
    "icon": "imglocal",
    "color": "#06b9fd",
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
    "name": "Messenger",
    "url": "https://messenger.abeto.co/",
    "icon": "https://upload.wikimedia.org/wikipedia/en/3/37/Messenger_game_cover.jpg?utm_source=en.wikipedia.org&utm_campaign=index&utm_content=thumbnail_unscaled&_=20251005010412",
    "color": "#b8fee0",
    "blocked": false
  },
  {
    "name": "Border War",
    "url": "https://borderwar.io/",
    "icon": "imglocal",
    "color": "#000651",
    "blocked": false
  },
  {
    "name": "Street Fighter EX2",
    "url": "https://archive.org/details/arcade_sfex2#",
    "icon": "https://static.wikia.nocookie.net/streetfighter/images/a/ad/Street_Fighter_EX2_PlayStation_cover.jpg/revision/latest?cb=20081125224446",
    "color": "#fcb625",
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
    "name": "SaboStack",
    "url": "https://sabostack.com/",
    "icon": "",
    "color": "#ffcfec",
    "blocked": false
  },
  {
    "name": "Attrition",
    "url": "https://attrition.world/",
    "icon": "imglocal",
    "color": "#efe6d0",
    "blocked": false
  },
  {
    "name": "Claybound",
    "url": "https://claybound-56949.web.app/",
    "icon": "https://yt3.googleusercontent.com/4VwISl-lCE1teTi7Dk_xpp7qZPPvy7DAnefa4Le0vWMAdRaLGU8zpjrsMdRYclf1k33eErB7y4U=s900-c-k-c0x00ffffff-no-rj",
    "color": "#ffb7a6",
    "blocked": false
  },
  {
    "name": "Badge Factory",
    "url": "https://hervestudio.github.io/badge-factory/",
    "icon": "imglocal",
    "color": "#7801b8",
    "blocked": false
  },
  {
    "name": "SnookerSim",
    "url": "https://snookersim.com/",
    "icon": "imglocal",
    "color": "#ffd85a",
    "blocked": false
  },
  {
    "name": "No Merci Michel",
    "url": "https://no.merci-michel.com/en/",
    "icon": "imglocal",
    "color": "#a2fffb",
    "blocked": false
  },
  {
    "name": "Doodle Shooter",
    "url": "https://doodleshooter.vercel.app/",
    "icon": "imglocal",
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
    "name": "Lacoste Experience",
    "url": "https://membersexperience-create.lacoste.com/gb/en/",
    "icon": "",
    "color": "#ceffcf",
    "blocked": false
  }
];
