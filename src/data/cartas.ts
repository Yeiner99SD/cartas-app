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
  }
];
