// Pokémon muy conocidos: iniciales, legendarios y favoritos de cada generación.
// El retrato es el Normal de Mystery Dungeon (SpriteCollab) en public/portraits/<dex>.png.
export interface Mon {
  dex: number;
  name: string;
}

export const ROSTER: readonly Mon[] = [
  // Kanto
  { dex: 1, name: 'Bulbasaur' }, { dex: 3, name: 'Venusaur' }, { dex: 4, name: 'Charmander' },
  { dex: 6, name: 'Charizard' }, { dex: 7, name: 'Squirtle' }, { dex: 9, name: 'Blastoise' },
  { dex: 12, name: 'Butterfree' }, { dex: 25, name: 'Pikachu' }, { dex: 26, name: 'Raichu' },
  { dex: 35, name: 'Clefairy' }, { dex: 37, name: 'Vulpix' }, { dex: 38, name: 'Ninetales' },
  { dex: 39, name: 'Jigglypuff' }, { dex: 52, name: 'Meowth' }, { dex: 54, name: 'Psyduck' },
  { dex: 59, name: 'Arcanine' }, { dex: 65, name: 'Alakazam' }, { dex: 68, name: 'Machamp' },
  { dex: 74, name: 'Geodude' }, { dex: 77, name: 'Ponyta' }, { dex: 79, name: 'Slowpoke' },
  { dex: 92, name: 'Gastly' }, { dex: 94, name: 'Gengar' }, { dex: 95, name: 'Onix' },
  { dex: 104, name: 'Cubone' }, { dex: 113, name: 'Chansey' }, { dex: 123, name: 'Scyther' },
  { dex: 129, name: 'Magikarp' }, { dex: 130, name: 'Gyarados' }, { dex: 131, name: 'Lapras' },
  { dex: 132, name: 'Ditto' }, { dex: 133, name: 'Eevee' }, { dex: 134, name: 'Vaporeon' },
  { dex: 135, name: 'Jolteon' }, { dex: 136, name: 'Flareon' }, { dex: 143, name: 'Snorlax' },
  { dex: 144, name: 'Articuno' }, { dex: 145, name: 'Zapdos' }, { dex: 146, name: 'Moltres' },
  { dex: 147, name: 'Dratini' }, { dex: 149, name: 'Dragonite' }, { dex: 150, name: 'Mewtwo' },
  { dex: 151, name: 'Mew' },
  // Johto
  { dex: 152, name: 'Chikorita' }, { dex: 155, name: 'Cyndaquil' }, { dex: 158, name: 'Totodile' },
  { dex: 172, name: 'Pichu' }, { dex: 175, name: 'Togepi' }, { dex: 181, name: 'Ampharos' },
  { dex: 196, name: 'Espeon' }, { dex: 197, name: 'Umbreon' }, { dex: 212, name: 'Scizor' },
  { dex: 214, name: 'Heracross' }, { dex: 245, name: 'Suicune' }, { dex: 248, name: 'Tyranitar' },
  { dex: 249, name: 'Lugia' }, { dex: 250, name: 'Ho-Oh' }, { dex: 251, name: 'Celebi' },
  // Hoenn
  { dex: 252, name: 'Treecko' }, { dex: 254, name: 'Sceptile' }, { dex: 255, name: 'Torchic' },
  { dex: 257, name: 'Blaziken' }, { dex: 258, name: 'Mudkip' }, { dex: 260, name: 'Swampert' },
  { dex: 282, name: 'Gardevoir' }, { dex: 302, name: 'Sableye' }, { dex: 306, name: 'Aggron' },
  { dex: 334, name: 'Altaria' }, { dex: 359, name: 'Absol' }, { dex: 373, name: 'Salamence' },
  { dex: 376, name: 'Metagross' }, { dex: 380, name: 'Latias' }, { dex: 381, name: 'Latios' },
  { dex: 382, name: 'Kyogre' }, { dex: 383, name: 'Groudon' }, { dex: 384, name: 'Rayquaza' },
  // Sinnoh
  { dex: 387, name: 'Turtwig' }, { dex: 390, name: 'Chimchar' }, { dex: 393, name: 'Piplup' },
  { dex: 405, name: 'Luxray' }, { dex: 442, name: 'Spiritomb' }, { dex: 445, name: 'Garchomp' },
  { dex: 447, name: 'Riolu' }, { dex: 448, name: 'Lucario' }, { dex: 470, name: 'Leafeon' },
  { dex: 471, name: 'Glaceon' }, { dex: 483, name: 'Dialga' }, { dex: 484, name: 'Palkia' },
  { dex: 487, name: 'Giratina' }, { dex: 491, name: 'Darkrai' }, { dex: 493, name: 'Arceus' },
  // Unova
  { dex: 495, name: 'Snivy' }, { dex: 498, name: 'Tepig' }, { dex: 501, name: 'Oshawott' },
  { dex: 571, name: 'Zoroark' }, { dex: 609, name: 'Chandelure' }, { dex: 635, name: 'Hydreigon' },
  { dex: 643, name: 'Reshiram' }, { dex: 644, name: 'Zekrom' },
  // Kalos
  { dex: 650, name: 'Chespin' }, { dex: 653, name: 'Fennekin' }, { dex: 656, name: 'Froakie' },
  { dex: 658, name: 'Greninja' }, { dex: 681, name: 'Aegislash' }, { dex: 700, name: 'Sylveon' },
  { dex: 716, name: 'Xerneas' }, { dex: 717, name: 'Yveltal' },
  // Alola
  { dex: 722, name: 'Rowlet' }, { dex: 725, name: 'Litten' }, { dex: 727, name: 'Incineroar' },
  { dex: 728, name: 'Popplio' }, { dex: 745, name: 'Lycanroc' }, { dex: 778, name: 'Mimikyu' },
  { dex: 791, name: 'Solgaleo' }, { dex: 792, name: 'Lunala' },
  // Galar
  { dex: 810, name: 'Grookey' }, { dex: 813, name: 'Scorbunny' }, { dex: 816, name: 'Sobble' },
  { dex: 823, name: 'Corviknight' }, { dex: 887, name: 'Dragapult' }, { dex: 888, name: 'Zacian' },
  { dex: 889, name: 'Zamazenta' },
  // Paldea
  { dex: 906, name: 'Sprigatito' }, { dex: 909, name: 'Fuecoco' }, { dex: 912, name: 'Quaxly' },
  { dex: 937, name: 'Ceruledge' }, { dex: 1007, name: 'Koraidon' }, { dex: 1008, name: 'Miraidon' },
];

export const portraitUrl = (dex: number): string => `${import.meta.env.BASE_URL}portraits/${dex}.png`;
