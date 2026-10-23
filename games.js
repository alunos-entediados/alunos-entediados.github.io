const DEFAULT_GAMES = [
  {
    "name": "Dragon Knight",
    "url": "https://dragonknight.cul4s.com/",
    "icon": "",
    "color": "#9f0004",
    "blocked": false
  },
  {
    "name": "Minecraft",
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
    "name": "FEZ",
    "url": "https://wasm.rip/files/FEZ/fez.html",
    "icon": "https://cdn2.steamgriddb.com/grid/58f6b0ad4ae7e7461308483257048e0c.jpg",
    "color": "#9fd8ff",
    "blocked": true
  },
  {
    "name": "Buckshot Roulette",
    "url": "https://truffled.lol/iframe.html?url=/games/buckshot/index.html",
    "icon": "https://cdn2.steamgriddb.com/grid/9fe8eeda7642391f8de12f2227709b13.png",
    "color": "#6c1500",
    "blocked": true
  },
  {
    "name": "That's Not My Neighbor",
    "url": "https://fivenightsatfreddysgame.io/thats-not-my-neighbor",
    "icon": "https://cdn2.steamgriddb.com/grid/f2004df26a9d6df8feaad81863ac4e57.png",
    "color": "#b9ab00",
    "blocked": true
  },
  {
    "name": "Plague Inc.",
    "url": "https://wasm.rip/files/plauge/index.html",
    "icon": "https://cdn2.steamgriddb.com/icon/e3a72c791a69f87b05ea7742e04430ed.png",
    "color": "#ad0105",
    "blocked": true
  },
  {
    "name": "20 Minutes Till Dawn",
    "url": "https://truffled.lol/unityframe.html?url=/games/20minutesbog/index.html",
    "icon": "https://cdn2.steamgriddb.com/grid/6077a04dd6e9a9544fe03634ed1365e7.png",
    "color": "#ed333b",
    "blocked": true
  },
  {
    "name": "Border War",
    "url": "https://borderwar.io/",
    "icon": "",
    "color": "#000651",
    "blocked": false
  },
  {
    "name": "Clustertruck",
    "url": "https://wasm.rip/files/ClusterTruck/clustertruck.html",
    "icon": "https://cdn2.steamgriddb.com/grid/4e50f5b05032a0170ffaede9775f2de2.jpg",
    "color": "#f6e69a",
    "blocked": true
  },
  {
    "name": "Messenger",
    "url": "https://messenger.abeto.co/",
    "icon": "https://upload.wikimedia.org/wikipedia/en/3/37/Messenger_game_cover.jpg?utm_source=en.wikipedia.org&utm_campaign=index&utm_content=thumbnail_unscaled&_=20251005010412",
    "color": "#b8fee0",
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
    "name": "The Simpsons: Hit & Run",
    "url": "https://shar-wasm.cjoseph.workers.dev/",
    "icon": "https://cdn2.steamgriddb.com/icon/61603780b437fb53aceb2563ccce02a4.png",
    "color": "#f9f06b",
    "blocked": true
  },
  {
    "name": "Halo",
    "url": "https://openhaloce.com/",
    "icon": "https://cdn2.steamgriddb.com/grid/44ffb6f94b5ec5366ba0f896f7f0f680.png",
    "color": "#57e389",
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
    "name": "Mario Kart 64",
    "url": "https://truffled.lol/iframe.html?url=/games/mk64/index.html",
    "icon": "https://cdn2.steamgriddb.com/grid/e5494d23b18b5c822bcaa9fe8fd077bf.jpg",
    "color": "#f66151",
    "blocked": true
  },
  {
    "name": "Raft",
    "url": "https://www.lemon-web.net/applications/lemon-web-games#raft",
    "icon": "https://cdn2.steamgriddb.com/grid/bebc7316421091b68a5fb3c0747e9bf1.jpg",
    "color": "#41b0b4",
    "blocked": false
  },
  {
    "name": "PEAK",
    "url": "https://wasm.rip/files/peak/PEAK.html",
    "icon": "https://cdn2.steamgriddb.com/grid/912a54ae38d2a8f697ced133314a3b6c.png",
    "color": "#f6e69a",
    "blocked": true
  },
  {
    "name": "SnookerSim",
    "url": "https://snookersim.com/",
    "icon": "",
    "color": "#ffd85a",
    "blocked": false
  },
  {
    "name": "Tiny Skies",
    "url": "https://tinyskies.vercel.app/",
    "icon": "",
    "color": "#06b9fd",
    "blocked": false
  },
  {
    "name": "Wosu!",
    "url": "https://wosu.dino.icu/",
    "icon": "https://cdn2.steamgriddb.com/grid/794aa3d6dd83aa2df37e8fc623470177.png",
    "color": "#f9a7b0",
    "blocked": false
  },
  {
    "name": "Five Nights at Freddy's",
    "url": "https://fivenightsatfreddysgame.io/",
    "icon": "https://cdn2.steamgriddb.com/grid/3eb92e736181f9e2cb674aaf79614c5f.png",
    "color": "#7d1a00",
    "blocked": true
  },
  {
    "name": "Five Nights at Freddy's 2",
    "url": "https://fivenightsatfreddysgame.io/five-nights-at-freddys-2",
    "icon": "https://cdn2.steamgriddb.com/grid/ccb726e81229032af69601ddf48bdad3.jpg",
    "color": "#710000",
    "blocked": true
  },
  {
    "name": "Five Nights at Freddy's 3",
    "url": "https://fivenightsatfreddysgame.io/five-nights-at-freddys-3",
    "icon": "https://cdn2.steamgriddb.com/grid/d19ca8cf12fdc7e0632e3d2123384c97.png",
    "color": "#015003",
    "blocked": true
  },
  {
    "name": "Five Nights at Freddy's 4",
    "url": "https://fivenightsatfreddysgame.io/five-nights-at-freddys-4",
    "icon": "https://cdn2.steamgriddb.com/grid/1dd446dfeb12f3392bd5abc346c8d42a.png",
    "color": "#7d0000",
    "blocked": true
  },
  {
    "name": "FNaF World",
    "url": "https://fivenightsatfreddysgame.io/fnaf-world",
    "icon": "https://cdn2.steamgriddb.com/grid/8f026d259700fde24f10dd8a151750a5.png",
    "color": "#9fd8ff",
    "blocked": true
  },
  {
    "name": "Five Nights at Freddy's: Sister Location",
    "url": "https://fivenightsatfreddysgame.io/fnaf-sister-location",
    "icon": "https://cdn2.steamgriddb.com/grid/a28388ab4de3107161c5ca0152da126d.png",
    "color": "#0b0d6c",
    "blocked": true
  },
  {
    "name": "Freddy Fazbear's Pizzeria Simulator",
    "url": "https://fivenightsatfreddysgame.io/fnaf-pizzeria-simulator",
    "icon": "https://cdn2.steamgriddb.com/grid/989659c71cf8e92bca17e0cbd87a8f66.png",
    "color": "#c8b6ff",
    "blocked": true
  },
  {
    "name": "Ultimate Custom Night",
    "url": "https://fivenightsatfreddysgame.io/fnaf-ultimate-custom-night",
    "icon": "https://cdn2.steamgriddb.com/grid/f6b46437b49f253fa857a676f624c0b3.png",
    "color": "#970000",
    "blocked": true
  },
  {
    "name": "Five Nights at Candy's",
    "url": "https://fivenightsatfreddysgame.io/five-nights-at-candys",
    "icon": "https://cdn2.steamgriddb.com/icon/914504d6a7f15be15048fdb72ddd71a7.png",
    "color": "#393c8a",
    "blocked": true
  },
  {
    "name": "Five Nights at Candy's 2",
    "url": "https://fivenightsatfreddysgame.io/five-nights-at-candys-2",
    "icon": "https://cdn2.steamgriddb.com/grid/8923abd60232525b3f3598ef0b0afd3c.jpg",
    "color": "#061035",
    "blocked": true
  },
  {
    "name": "Five Nights at Candy's 3",
    "url": "https://fivenightsatfreddysgame.io/five-nights-at-candys-3",
    "icon": "https://cdn2.steamgriddb.com/icon/cca1984970cb6fe586716e732df9fb0d.png",
    "color": "#5f0572",
    "blocked": true
  },
  {
    "name": "Cave Story",
    "url": "https://midzer.de/wasm/cavestory/",
    "icon": "https://cdn2.steamgriddb.com/grid/d9fba8fa96a45bbc4d2be83e164bb012.png",
    "color": "#2293aa",
    "blocked": false
  },
  {
    "name": "No Merci Michel",
    "url": "https://no.merci-michel.com/en/",
    "icon": "",
    "color": "#a2fffb",
    "blocked": false
  },
  {
    "name": "Attrition",
    "url": "https://attrition.world/",
    "icon": "",
    "color": "#efe6d0",
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
    "name": "SaboStack",
    "url": "https://sabostack.com/",
    "icon": "",
    "color": "#ffcfec",
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
    "name": "Skull Hotel",
    "url": "https://skullhotel.io/",
    "icon": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSSHzzA_DSn599OnJkpAvPuAne3j6LnSKg9mNUEaBZy_v-SBRT-OkgbhRc&s=10",
    "color": "#ffbd85",
    "blocked": false
  },
  {
    "name": "Great Taxi Assignment",
    "url": "https://great-taxi-assignment.netlify.app/",
    "icon": "https://great-taxi-assignment.netlify.app/assets/logos/game_logo.png",
    "color": "#e8bcfa",
    "blocked": false
  }
];
