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
  {
    title: "Te amo = Union de felicidad",
    image: "/teamobanner.webp",
    slug: "te-amo",
    from: "Tu novio",
    to: "Mi novia que más amo :3 ",
    text: "Pienso mucho en como te amo más cada día",
    components: [
      'TeamoTitle',
      'ContentTeamo',
    ]
  },
  {
    title: "Gracias 2025 - RECAP",
    image: "/2025/2025DANIA.webp",
    slug: "2025",
    from: "Tu Yei de tu vida",
    to: "La chica de mis sueños <3 ",
    text: "Le agradezco a todo por darme la oportunidad de tenerte a mi lado",
    components: [
      '2025Title',
      '2025FT',
      '2025FC',
      '2025FN',
      '2025Trenzas',
      '2025TC',
      '2025Cartita',
      'Content2025',
    ]
  },
  {
    title: "Tu mi san Valentin",
    image: "/bgvalentin.webp",
    slug: "san-valentin",
    from: "Tu novio",
    to: "La novia más linda del mundo <3 ",
    text: "Mi 14 de febrero más especial",
    components: [
      'Flores',
      'HeroValentin',
    ]
  },
  {
    title: "Nuestro Aniversario 14/04",
    image: "/portadaaniversario.webp",
    slug: "aniversario",
    from: "El hombre que más te ama",
    to: "La mujer de mis sueños",
    text: "Ya pasó un año desde que hablamos, y fue mi más bonita casualidad",
    components: [
      'AniversarioHero',
      'CartaAniversario',
    ]
  }
];
