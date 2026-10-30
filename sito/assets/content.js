/* =========================================================
   ENRICA FALCIDIA — CONTENUTI DEL SITO
   Questo è l'unico file da toccare per aggiungere o cambiare
   progetti, foto e testi. Le immagini stanno nella cartella /img.
   [larghezza, altezza] serve solo per tenere le proporzioni.
   ========================================================= */

window.SITE = {
  /* HOME: "torch" = foto a tutto schermo al buio, il mouse e una luce; "classic" = la prima versione */
  home: "torch",
  /* CURSORE: scegli uno tra "freccia-1", "freccia-2", "fiore", "dischetto", "stella", "brillo"
     trail: true = scia di brillantini dietro al mouse, false = niente scia
     (i file stanno in img/cursors/<nome>/) */
  cursor: "brillo",
  trail: true,

  name: "Enrica Falcidia",
  tagline: "Creative direction, branding and photography.",
  email: "enricafalcidia4@gmail.com",
  contacts: [
    { label: "Email", href: "mailto:enricafalcidia4@gmail.com" },
    { label: "Instagram", href: "https://www.instagram.com/by.enrica/" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/enrica-falcidia-158594235" },
  ],

  /* Le poche immagini che "lampeggiano" nella home, in quest'ordine */
  flash: [
    /* le foto della prima versione */
    "badbling/poster-3", "silk/veiled", "punk/03", "travel/jp-window-1",
  ],
  /* punto da tenere al centro quando la foto riempie tutto lo schermo */
  /* tutte le foto della home: intere, al centro, con i bordi che sfumano nel nero */
  flashFocus: {},
  /* seconda selezione, da riprovare in futuro:
     "badbling/detail", "nightlife/x05", "nightlife/x4502", "silk/veiled", "punk/03", "nightlife/x03", "nightlife/x01" */

  /* ---------------- PROGETTI ---------------- */
  projects: [
    {
      slug: "badbling",
      title: "Badbling",
      kind: "Individual brand concept",
      cover: "badbling/poster-1",
      hero: "badbling/poster-3-clean", heroFit: "contain",
      intro: "Bad Bling is a branding concept and photo campaign for an imaginary jewelry brand I developed with an alternative edge.",
      blocks: [
        { type: "split", img: "badbling/poster-1", text: [
          "Inspired by the freedom and versatility of costume jewelry, the project explores how style and expression don't need to come with a high price tag.",
          "I imagined a bold, self-ironic brand that plays with the concept of \u201cshining\u201d without the weight of traditional luxury: the jewelry shines so much it looks real, so real-looking it provokes the desire to be stolen.",
        ]},
        { type: "quote", text: "She steals attention. She steals the show." },
        { type: "split", side: "left", img: "badbling/poster-2", text: [
          "At the heart of the brand is the figure of the chic thief: not your typical burglar, but a fashion antiheroine. She doesn't lurk in shadows. She owns the spotlight.",
          "Over-the-top, provocative and fully aware of her beauty, she reclaims the act of stealing as a metaphor: not about crime, but about reclaiming power through style, identity and confidence.",
        ]},
        { type: "split", img: "badbling/poster-3", text: [
          "Bad Bling celebrates a new kind of luxury, one that's accessible, expressive and fearless. The project blends ironic storytelling, punk-glam aesthetics and a reflection on the democratization of luxury: with dazzling, stylish costume jewelry, anyone can shine without spending a fortune.",
        ]},
        { type: "strip", caption: "Out of home", imgs: ["badbling/mock-bus", "badbling/mock-street", "badbling/mock-metro"] },
      ],
    },
    {
      slug: "in-a-world-of-denim",
      title: "In a World of Denim",
      kind: "Group brand campaign for Levi\u2019s",
      cover: "denim/hero",
      hero: "denim/hero", heroPos: "50% 50%",
      intro: "A campaign concept that repositions Levi's as a global pioneer for digitally savvy 18\u201327-year-olds.",
      blocks: [
        { type: "columns", text: [
          "The campaign uses AI-generated backgrounds to create a visual identity that speaks to the audience's desire for authenticity and self-expression. As Creative Director of this group project, I led the conceptual development and visual direction.",
          "Denim becomes more than clothing: a companion for those who move through the world with intention and fluidity. We framed Levi's as a brand that doesn't just follow trends but leads a lifestyle shift.",
        ]},
        { type: "quote", text: "Experience over stability. Autonomy over convention." },
        { type: "strip", caption: "Out of home", imgs: ["denim/mock-billboard", "denim/mock-metro", "denim/mock-bus"] },
        { type: "text", text: [
          "Through storytelling rooted in movement, hybridity and reinvention, we aligned Levi's with the values of the remote-working, borderless generation. The result was a brand vision that expands Levi's legacy: from symbol of exploration and youth culture to a driving force in shaping the future of work, travel and identity.",
        ]},
      ],
    },
    {
      slug: "a-punks-odyssey",
      title: "A Punk\u2019s Odyssey in a Sea of Suits",
      kind: "Individual photography project",
      cover: "punk/01",
      hero: "punk/01", heroPos: "50% 45%",
      intro: "Visual storytelling through photography: one character, one office, a handful of frames.",
      blocks: [
        { type: "text", text: [
          "An unfiltered glimpse into the life of a punk navigating corporate culture. With gum popping, feet on the table and a bad attitude, our subject challenges the status quo. Entangled in the ties that bound her, she rises to reclaim her autonomy, then uses her newfound strength to turn the roles around.",
        ]},
        { type: "sequence", imgs: ["punk/01", "punk/02", "punk/03", "punk/04", "punk/05", "punk/07", "punk/08", "punk/09"] },
        { type: "quote", text: "A complete story in no more than ten photographs." },
        { type: "text", text: [
          "The narrative had to unfold through composition, sequencing, emotion and atmosphere alone. From concept to final edit, every frame had to earn its place.",
        ]},
      ],
    },
    {
      slug: "silk-cage",
      title: "Silk Cage",
      kind: "Individual photography concept",
      cover: "silk/veiled",
      hero: "silk/veiled", heroPos: "50% 55%",
      intro: "The foulard symbolizes the comfort zone: a familiar and seemingly safe space that can also become limiting.",
      blocks: [
        { type: "duo", imgs: ["silk/sideways", "silk/blindfold"] },
        { type: "text", text: [
          "Its vibrant color appears reassuring, yet hides a more complex reality. The subject interacts with the scarf naturally, unaware of its growing presence. As it tangles and envelops them, it becomes a visual metaphor for how familiarity, when never questioned, can transform into an invisible cage.",
        ]},
        { type: "frames", imgs: ["silk/veiled", "silk/wing", "silk/diagonal"] },
        { type: "quote", text: "What feels beautiful and secure can slowly turn suffocating." },
        { type: "duo", imgs: ["silk/run", "silk/above"] },
        { type: "text", text: [
          "Ultimately, the work reflects on how what we perceive as safe and beautiful is not always beneficial, but can quietly hold us back.",
        ]},
        { type: "full", img: "silk/final" },
      ],
    },
  ],

  /* ---------------- VISUALS ---------------- */
  visuals: [
    { title: "Cosmic Cuts", kind: "Editorial concept", img: "visuals/cosmic-cuts", size: "tall-l" },
    { title: "Rave Shoes", kind: "Concept campaign", img: "visuals/rave-shoes", size: "wide-r" },
    { title: "Make Some Noise", kind: "Concept campaign for Pas de Mer", img: "visuals/make-some-noise", size: "center" },
    { title: "Anyone Can Be an Artist", kind: "Posca brand ambassador", size: "strip",
      imgs: ["visuals/posca-2","visuals/posca-5","visuals/posca-4","visuals/posca-6","visuals/posca-1","visuals/posca-3","visuals/posca-7"] },
    { title: "Traveler", kind: "Event invitation for Hotel Cond\u00e9 Nast Traveler", img: "visuals/traveler", size: "tall-left" },
    { title: "Right on Time", kind: "Concept campaign for Metro de Madrid", img: "visuals/right-on-time", size: "wide-right" },
  ],

  /* ---------------- FOTO & VIDEO (menu laterale) ---------------- */
  photo: [
    { slug: "nightlife", title: "Nightlife", layout: "palette", note: "Club nights and events in Madrid, sorted by the colour of the light.",
    chapters: [
      { title: "Amber", imgs: ["nightlife/n8276", "nightlife/n9587", "nightlife/n9595", "nightlife/n9589", "nightlife/x04-1", "nightlife/x09", "nightlife/x03", "nightlife/n8462", "nightlife/x4538", "nightlife/x07", "nightlife/x04", "nightlife/x5171", "nightlife/x5178"] },
      { title: "Red", imgs: ["nightlife/x010", "nightlife/n7570", "nightlife/n8244", "nightlife/x01", "nightlife/n8130", "nightlife/x016", "nightlife/x02", "nightlife/x4005", "nightlife/x4375", "nightlife/x4537", "nightlife/n8482", "nightlife/x4354", "nightlife/x4579", "nightlife/x4643", "nightlife/x7", "nightlife/x014", "nightlife/n7664", "nightlife/n8106", "nightlife/x011", "nightlife/x06b", "nightlife/n7667", "nightlife/n7638", "nightlife/x06", "nightlife/x4501"] },
      { title: "Blue", imgs: ["nightlife/n7512", "nightlife/x04b", "nightlife/x08", "nightlife/x4502", "nightlife/n8258", "nightlife/x5218"] },
      { title: "Low light", imgs: ["nightlife/x6", "nightlife/x05", "nightlife/x9", "nightlife/x5", "nightlife/n8442", "nightlife/n8655"] },
    ] },
    { slug: "gallery", title: "Gallery", layout: "countries", note: "",
      intro: "Street photography from the places I pass through: everyday rituals, strangers, and the light of each city.",
      /* paesi uno sotto l'altro. Ogni [ ] e una riga: 1 foto = grande da sola, 2-3 = affiancate */
      countries: [
        { name: "Japan", place: "Kyoto, Nara, Tokyo", rows: [
          ["travel/jp-kimono"],
          ["travel/jp-selfie", "travel/jp-deer"],
          ["travel/jp-incense"],
          ["travel/jp-taxi", "travel/jp-station"],
          ["travel/jp-crossing", "travel/jp-lantern", "travel/jp-fans"],
          ["travel/jp-gardener"],
          ["travel/jp-river", "travel/jp-garden"],
          ["travel/jp-torii", "travel/jp-board"],
          ["travel/jp-bamboo"],
          ["travel/jp-golden", "travel/jp-pine"],
          ["travel/jp-window-1", "travel/jp-window-2"],
        ] },
        { name: "Morocco", place: "Rabat", rows: [
          ["travel/ma-shore"],
          ["travel/ma-flag", "travel/ma-medina"],
          ["travel/ma-rooftops", "travel/ma-tower"],
          ["travel/ma-guard", "travel/ma-family", "travel/ma-beach"],
          ["travel/ma-checkers"],
        ] },
        { name: "Italy", place: "Catania, Sicily", rows: [
          ["travel/ct-procession"],
          ["travel/ct-fishing-1", "travel/ct-fishing-2"],
          ["travel/ct-fishing-4", "travel/ct-fishing-3"],
          ["travel/ct-tiamo", "travel/ct-street", "travel/ct-harbour"],
          ["travel/ct-pillar"],
        ] },
      ] },
    { slug: "video", title: "Video", layout: "tv", note: "Event teasers and campaigns.", imgs: [],
      channels: [
        { title: "Fjaka", kind: "Event teaser", src: "video/fjaka.mp4", loop: "video/fjaka-tv.mp4", poster: "video/fjaka.webp" },
        { title: "Chess One vs All", kind: "Event teaser", src: "video/chess.mp4", loop: "video/chess-tv.mp4", poster: "video/chess.webp" },
        { title: "Smart Eyes", kind: "Group adv", src: "video/smart-eyes.mp4", loop: "video/smart-eyes-tv.mp4", poster: "video/smart-eyes.webp" },
      ] },
  ],

  /* Foto del backstage: si sfogliano nella fotocamera digitale dell'About */
  backstage: ["backstage/bs01","backstage/bs22","backstage/bs12","backstage/bs04","backstage/bs10","backstage/bs14","backstage/bs23","backstage/bs24","backstage/bs02","backstage/bs08","backstage/bs09","backstage/bs25","backstage/bs07","backstage/bs17","backstage/bs18","backstage/bs26","backstage/bs16","backstage/bs06","backstage/bs13","backstage/bs19","backstage/bs21","backstage/bs15","backstage/bs11","backstage/bs05"],

  /* punto da tenere al centro quando la foto viene ritagliata nello schermo della fotocamera */
  backstageFocus: { "backstage/bs01": "50% 62%", "backstage/bs03": "50% 30%", "backstage/bs04": "55% 50%",
                    "backstage/bs06": "45% 42%", "backstage/bs07": "50% 45%", "backstage/bs09": "50% 62%" },

  about: [
    "I'm an Italian creative based in Madrid. My work lives at the intersection of visual storytelling, branding and photography. I'm deeply passionate about translating concepts into strong, emotional visuals.",
    "Whether it's an experimental shoot, a bold campaign or a carefully built brand identity, I aim to create work that resonates, provokes and sticks. I believe in the power of aesthetics as communication, and in how visuals can transmit what words can't.",
    "With a background in behavioral sciences and creative direction, I enjoy blending strategy and creativity: understanding people first, then designing visuals that speak to them. I'm inspired by culture, movement and real human energy.",
    "Currently open to collaborations, projects and conversations.",
  ],
};

/* proporzioni delle immagini (generate automaticamente) */
window.SIZES = {"travel/jp-pine":[6000,4000],"travel/jp-selfie":[6000,4000],"travel/ct-procession":[6000,4000],"travel/ct-fishing-3":[6000,4000],"travel/ct-fishing-4":[6000,4000],"badbling/detail":[1312,1144],"travel/jp-incense":[6000,4000],"travel/ma-family":[4608,3456],"travel/ma-flag":[4608,3456],"travel/ct-harbour":[6000,4000],"travel/ct-street":[6000,4000],"travel/ma-guard":[2400,1792],"travel/ct-fishing-1":[6000,4000],"travel/ct-pillar":[6000,4000],"travel/ct-tiamo":[6000,4000],"travel/ct-fishing-2":[6000,4000],"travel/jp-golden":[5898,3932],"travel/jp-bamboo":[6000,4000],"travel/jp-taxi":[6000,4000],"travel/jp-river":[5418,3540],"travel/jp-window-1":[5923,3949],"travel/jp-window-2":[6000,4000],"travel/jp-board":[4608,3456],"travel/jp-kimono":[6000,4000],"travel/jp-torii":[5722,3815],"travel/jp-fans":[4608,3456],"travel/jp-lantern":[4487,3365],"travel/jp-garden":[6000,4000],"travel/jp-gardener":[6000,4000],"travel/jp-deer":[6000,4000],"travel/jp-station":[6000,4000],"travel/jp-crossing":[6000,4000],"travel/ma-rooftops":[4435,3456],"travel/ma-medina":[4608,3456],"travel/ma-tower":[4422,3418],"travel/ma-checkers":[4608,3456],"travel/ma-beach":[4608,3456],"travel/ma-shore":[4479,3358],"visuals/traveler":[1587,2245],"visuals/make-some-noise":[2089,1470],"visuals/rave-shoes":[1920,1274],"visuals/right-on-time":[2048,1279],"visuals/posca-1":[6000,4000],"visuals/posca-2":[6000,4000],"visuals/posca-3":[6000,4000],"visuals/posca-4":[6000,4000],"visuals/posca-5":[2048,1365],"visuals/posca-6":[6000,4000],"visuals/posca-7":[6000,4000],"silk/veiled":[5911,4000],"silk/diagonal":[5922,3948],"silk/wing":[5757,4000],"silk/blindfold":[6000,3813],"silk/sideways":[3464,5589],"silk/run":[6000,4000],"silk/above":[6000,4000],"nightlife/x01":[6000,4000],"nightlife/x010":[6000,4000],"nightlife/x011":[6000,4000],"nightlife/x014":[6000,4000],"nightlife/x016":[6000,4000],"nightlife/x02":[6000,4000],"nightlife/x03":[6000,4000],"nightlife/x04b":[6000,4000],"nightlife/x04-1":[1536,1024],"nightlife/x04":[6000,4000],"nightlife/x05":[1536,1024],"nightlife/x06b":[6000,4000],"nightlife/x06":[6000,4000],"nightlife/x07":[6000,4000],"nightlife/x08":[6000,4000],"nightlife/x09":[6000,4000],"nightlife/x5":[1536,1024],"nightlife/x6":[1536,1024],"nightlife/x7":[1536,1024],"nightlife/x9":[1264,848],"nightlife/x4005":[6000,4000],"nightlife/x4354":[6000,4000],"nightlife/x4375":[6000,4000],"nightlife/x4501":[6000,4000],"nightlife/x4502":[6000,4000],"nightlife/x4537":[6000,4000],"nightlife/x4538":[1536,1024],"nightlife/x4579":[6000,4000],"nightlife/x4643":[6000,4000],"nightlife/x5171":[1536,1024],"nightlife/x5178":[2528,1696],"nightlife/x5218":[1536,1024],"backstage/bs01":[1200,1600],"backstage/bs02":[4608,3456],"backstage/bs03":[1200,1600],"backstage/bs04":[1200,1600],"backstage/bs05":[4028,2809],"backstage/bs06":[1200,1600],"backstage/bs07":[960,1280],"backstage/bs08":[4608,3456],"backstage/bs09":[1200,1600],"backstage/bs10":[1599,1066],"punk/01":[5787,3393],"punk/02":[5732,3337],"punk/03":[4813,3007],"punk/05":[6000,4000],"punk/07":[5868,4000],"punk/08":[5716,3636],"punk/09":[5671,3335],"badbling/poster-1":[4263,6400],"badbling/poster-2":[4263,6400],"badbling/poster-3":[4263,6400],"badbling/mock-bus":[1333,923],"badbling/mock-street":[1326,927],"badbling/mock-metro":[1330,882],"denim/hero":[1792,1024],"denim/mock-metro":[3900,2712],"denim/mock-bus":[3600,2152],"denim/mock-billboard":[3763,2509],"visuals/cosmic-cuts":[1587,2245],"nightlife/n7512":[6000,4000],"nightlife/n7542":[6000,4000],"nightlife/n7570":[4000,6000],"nightlife/n7638":[6000,4000],"nightlife/n7664":[4000,6000],"nightlife/n7667":[6000,4000],"nightlife/n8106":[4000,6000],"nightlife/n8130":[4000,6000],"nightlife/n8244":[4000,6000],"nightlife/n8258":[3635,5453],"nightlife/n8276":[4000,6000],"nightlife/n8442":[4000,6000],"nightlife/n8462":[4000,6000],"nightlife/n8482":[4000,6000],"nightlife/n8609":[3282,4923],"nightlife/n8655":[4000,6000],"nightlife/n9587":[3456,4608],"nightlife/n9589":[3456,4608],"nightlife/n9595":[3456,4608],"backstage/bs11":[3051,4160],"backstage/bs12":[1536,2048],"backstage/bs13":[1170,2080],"backstage/bs14":[790,1487],"backstage/bs15":[5712,4284],"backstage/bs16":[3024,4032],"backstage/bs17":[3024,4032],"backstage/bs18":[3024,4032],"backstage/bs19":[3024,4032],"backstage/bs20":[3024,4032],"backstage/bs21":[3024,4032],"backstage/bs22":[729,620],"backstage/bs23":[3024,4032],"backstage/bs24":[3024,4032],"backstage/bs25":[3024,4032],"backstage/bs26":[3024,5038],"punk/04":[5604,3302],"silk/final":[6000,4000],"badbling/poster-3-clean":[4263,6400]};

/* colore dominante di ogni foto nightlife (calcolato automaticamente) */
window.COLORS = {"travel/jp-kimono":"#3570a1","travel/jp-torii":"#8b7c48","travel/jp-fans":"#e57123","travel/jp-lantern":"#ab6a47","travel/jp-garden":"#8f7a25","travel/jp-gardener":"#dfba58","travel/jp-deer":"#e8c2a2","travel/jp-station":"#8e6c55","travel/jp-crossing":"#d17e45","travel/ma-rooftops":"#e2b8a2","travel/ma-medina":"#ba966d","travel/ma-tower":"#ac8672","travel/ma-checkers":"#b96649","travel/ma-beach":"#ceb07e","travel/ma-shore":"#f1ece8","nightlife/n7512":"#723269","nightlife/n7542":"#84001f","nightlife/n7570":"#b05139","nightlife/n7638":"#a00016","nightlife/n7664":"#80423d","nightlife/n7667":"#72131b","nightlife/n8106":"#964b44","nightlife/n8130":"#72281c","nightlife/n8244":"#883e2d","nightlife/n8258":"#5d57ce","nightlife/n8276":"#feac14","nightlife/n8442":"#806084","nightlife/n8462":"#d18558","nightlife/n8482":"#723d35","nightlife/n8609":"#7e5252","nightlife/n8655":"#9f857a","nightlife/n9587":"#c48220","nightlife/n9589":"#f4a246","nightlife/n9595":"#e59227","nightlife/x01":"#ff2800","nightlife/x010":"#fc4410","nightlife/x011":"#f01000","nightlife/x014":"#ff1800","nightlife/x016":"#ff2400","nightlife/x02":"#ff2400","nightlife/x03":"#ff6802","nightlife/x04-1":"#e69a52","nightlife/x04":"#be8c76","nightlife/x04b":"#622d9a","nightlife/x05":"#d1a5ba","nightlife/x06":"#f22e4c","nightlife/x06b":"#ff7070","nightlife/x07":"#ff7d41","nightlife/x08":"#7350a3","nightlife/x09":"#ff6b00","nightlife/x4005":"#ff2800","nightlife/x4354":"#c51f0a","nightlife/x4375":"#ff2700","nightlife/x4501":"#cd2f57","nightlife/x4502":"#aa99fc","nightlife/x4537":"#fc2500","nightlife/x4538":"#e66728","nightlife/x4579":"#d14e3d","nightlife/x4643":"#ff1d00","nightlife/x5":"#dfc6b7","nightlife/x5171":"#da7042","nightlife/x5178":"#cf592f","nightlife/x5218":"#5ba2f8","nightlife/x6":"#9e9baa","nightlife/x7":"#a76b63","nightlife/x9":"#797b93"};
