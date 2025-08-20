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
    title: "Gongoli",
    image: "/gongolibg.webp",
    slug: "gongoli",
    from: "Tu hombre",
    to: "Gongoló",
    text: "Sembré algodón y coseché una nube.",
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
    image: "/gongolibg.webp",
    from: "Tu hombre",
    to: "Marla",
    text: "En cada carta hay un pedacito de mí esperándote.",
    components: [
      'HeroMarla',
      'ContentMarla1',
      'ContentMarla2'
    ]
  },
  {
    title: "Dulce carita",
    image: "/gongolibg.webp",
    slug: "dulce-carita",
    from: "Tu hombre",
    to: "Dulce",
    text: "Tus sonrisas son la tinta con la que escribo mi felicidad.",
    components: [
      'HeroDulce',
      'ContentDulce1',
      'ContentDulce2'
    ]
  }
];
