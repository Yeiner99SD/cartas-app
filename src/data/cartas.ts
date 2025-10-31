interface Carta {
  title: string;
  image: string;
  slug: string;
  from: string;
  to: string;
  text: string;
  components: string[];
}

export const cartas: Carta[] = [
  {
    title: "Gongoli 🫧☁️ ",
    image: "/gongolibg.webp",
    slug: "gongoli",
    from: "Yei",
    to: "Dania :) ",
    text: "Sembré algodón y coseché una nube. ",
    components: [
      'HeroGongoli',
      'Content1',
      'Content2',
      'Content3',
      'ReflectionGongoli'
    ]
  },
  {
    title: "Marla Singer",
    slug: "marla-singer",
    image: "/msbg.webp",
    from: "Tu hombre",
    to: "La mujer mas hermosa",
    text: "Tus labios son rock and roll :3 ",
    components: [
      'HeroMarla',
      'ContentMS1',
      'ContentMS2',
      'ContentMS3',
      'ReflecionMarla',
    ]
  },
  {
    title: "Tus Ojitos",
    image: "/bgojitoslindos.webp",
    slug: "ojitos-lindos",
    from: "Tu hombre",
    to: "Mi mujer",
    text: "Tus ojos son la tinta con la que escribo",
    components: [
      'HeroOjitos',
      'ContentOjitos',
    
    ]
  },
  {
    title: "Mi Niña Hermosa",
    image: "/bgnb.webp",
    slug: "mi-niña-hermosa",
    from: "Tu Novio",
    to: "Mi pareja hermosa :) ",
    text: "Mi 29.5 eres tan especial y tan linda que no hay palabras para describir lo mucho que te quiero :3 ",
    components: [
      'HeroNiñaHermosa',
      'ContentNiñaHermosa',
    ]
  },
  {
    title: "Feliz Cumpleaños Mi Amor",
    image: "/cumple.webp",
    slug: "cumpleaños",
    from: "Tu Yei",
    to: "Mi niña linda :3 ",
    text: "Feliz día amor, ya tienes 17 TE AMO MUCHO :3",
    components: [
      'HeroCumpleaños',
      'ContentCumpleaños',
    ]
  },
  {
    title: "2 Meses Contigo = Muchisima Felicidad",
    image: "/banner2meses.webp",
    slug: "two-months",
    from: "Tu Yei",
    to: "Mi angel hermoso :3 ",
    text: "Felices 2 meses mi amor, gracias por hacerme tan feliz",
    components: [
      'Title',
      'OrquiPerfect',
      'Phalaenopsis',
      'Cattleya',
      'Vanda',
      'Oncidum',
      'Paphiopedilum',
    ]
  },
  
];
