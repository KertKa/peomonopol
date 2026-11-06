import type { Tile, PartyCardTemplate, RoundStage } from '../types';

export const TOTAL_TILES = 40;

export const MIN_ROUNDS = 3;
export const DEFAULT_ROUNDS = 10;
export const MAX_ROUNDS_LIMIT = 30;

export const PLAYER_COLORS = [
  { name: 'Neoonroosa', hex: '#f43f5e' },
  { name: 'Kuldne', hex: '#f59e0b' },
  { name: 'Smaragd', hex: '#10b981' },
  { name: 'Taevasinine', hex: '#38bdf8' },
  { name: 'Elektrililla', hex: '#a855f7' },
  { name: 'Leekoranž', hex: '#fb923c' },
  { name: 'Laimiroheline', hex: '#84cc16' },
  { name: 'Hõbevalge', hex: '#e2e8f0' },
];

export const INITIAL_TILES: Tile[] = [
  // Alumine rida (0 -> 10)
  { id: 0, name: 'START', type: 'start', owner: null, color: '#fbbf24' },
  { id: 1, name: 'Telliskivi Loomelinnak', type: 'property', price: 2, owner: null, color: '#38bdf8' },
  { id: 2, name: 'Joomiskaart', type: 'drink', owner: null, color: '#f97316' },
  { id: 3, name: 'Sveta Baar', type: 'property', price: 2, owner: null, color: '#38bdf8' },
  { id: 4, name: 'Tõde või Tegu', type: 'truth_dare', owner: null, color: '#ec4899' },
  { id: 5, name: 'Tõde või Tegu', type: 'truth_dare', owner: null, color: '#ec4899' },
  { id: 6, name: 'Kalamaja Korter', type: 'property', price: 3, owner: null, color: '#06b6d4' },
  { id: 7, name: 'Joomiskaart', type: 'drink', owner: null, color: '#f97316' },
  { id: 8, name: 'Põhjala Tehas', type: 'property', price: 3, owner: null, color: '#06b6d4' },
  { id: 9, name: 'Kalaranna Promenaad', type: 'property', price: 3, owner: null, color: '#06b6d4' },

  // Parem veerg (10 -> 20)
  { id: 10, name: 'Kõik joovad!', type: 'all_drink', owner: null, color: '#eab308' },
  { id: 11, name: 'Rüütli Tänav', type: 'property', price: 3, owner: null, color: '#10b981' },
  { id: 12, name: 'Tõde või Tegu', type: 'truth_dare', owner: null, color: '#ec4899' },
  { id: 13, name: 'Pirogovi Park', type: 'property', price: 3, owner: null, color: '#10b981' },
  { id: 14, name: 'Joomiskaart', type: 'drink', owner: null, color: '#f97316' },
  { id: 15, name: 'Joomiskaart', type: 'drink', owner: null, color: '#f97316' },
  { id: 16, name: 'Emajõe Kallas', type: 'property', price: 4, owner: null, color: '#84cc16' },
  { id: 17, name: 'Tõde või Tegu', type: 'truth_dare', owner: null, color: '#ec4899' },
  { id: 18, name: 'Aparaaditehas', type: 'property', price: 4, owner: null, color: '#84cc16' },
  { id: 19, name: 'Toomemäe Loss', type: 'property', price: 4, owner: null, color: '#84cc16' },

  // Ülemine rida (20 -> 30)
  { id: 20, name: 'Kõik joovad!', type: 'all_drink', owner: null, color: '#eab308' },
  { id: 21, name: 'Pärnu Rand', type: 'property', price: 4, owner: null, color: '#a855f7' },
  { id: 22, name: 'Joomiskaart', type: 'drink', owner: null, color: '#f97316' },
  { id: 23, name: 'Vallikäär', type: 'property', price: 4, owner: null, color: '#a855f7' },
  { id: 24, name: 'Tõde või Tegu', type: 'truth_dare', owner: null, color: '#ec4899' },
  { id: 25, name: 'Tõde või Tegu', type: 'truth_dare', owner: null, color: '#ec4899' },
  { id: 26, name: 'Kuressaare Loss', type: 'property', price: 5, owner: null, color: '#6366f1' },
  { id: 27, name: 'Joomiskaart', type: 'drink', owner: null, color: '#f97316' },
  { id: 28, name: 'Otepää Suusabaas', type: 'property', price: 5, owner: null, color: '#6366f1' },
  { id: 29, name: 'Pühajärve Spa', type: 'property', price: 5, owner: null, color: '#6366f1' },

  // Vasak veerg (30 -> 39)
  { id: 30, name: 'Kõik joovad!', type: 'all_drink', owner: null, color: '#eab308' },
  { id: 31, name: 'Vanalinna Katusebaar', type: 'property', price: 5, owner: null, color: '#f43f5e' },
  { id: 32, name: 'Tõde või Tegu', type: 'truth_dare', owner: null, color: '#ec4899' },
  { id: 33, name: 'Bermuda Kolmnurk', type: 'property', price: 5, owner: null, color: '#f43f5e' },
  { id: 34, name: 'Joomiskaart', type: 'drink', owner: null, color: '#f97316' },
  { id: 35, name: 'Joomiskaart', type: 'drink', owner: null, color: '#f97316' },
  { id: 36, name: 'Noblessneri Jahisadam', type: 'property', price: 6, owner: null, color: '#e11d48' },
  { id: 37, name: 'Tõde või Tegu', type: 'truth_dare', owner: null, color: '#ec4899' },
  { id: 38, name: 'Pirita Jahiklubi', type: 'property', price: 6, owner: null, color: '#e11d48' },
  { id: 39, name: 'VIP Penthouse', type: 'property', price: 6, owner: null, color: '#e11d48' },
];

export const PARTY_CARDS: PartyCardTemplate[] = [
  // ==========================================
  // FAAS 1: SOOJENDUS (Early) - ID: 101 .. 138
  // ==========================================
  {
    id: 101,
    stage: 'early',
    type: 'drink',
    alcoholText: '{player}, nimeta kolm asja, mida teed enne pidu. Kõik, kes teevad vähemalt ühte neist, võtavad lonksu!',
    nonAlcoholText: '{player}, nimeta kolm asja, mida teed enne pidu. Kõik, kes teevad vähemalt ühte neist, võtavad sõõmu!',
  },
  {
    id: 102,
    stage: 'early',
    type: 'drink',
    alcoholText: 'Kõik näitavad korraga näpuga: kes siit seltskonnast jääb täna esimesena magama? Enim hääli saanud mängija võtab 2 lonksu!',
    nonAlcoholText: 'Kõik näitavad korraga näpuga: kes siit seltskonnast jääb täna esimesena magama? Enim hääli saanud mängija võtab 2 sõõmu!',
  },
  {
    id: 103,
    stage: 'early',
    type: 'drink',
    alcoholText: '{player} ja {other} teevad kivi-paber-käärid ühe võiduni. Kaotaja võtab mehise lonksu!',
    nonAlcoholText: '{player} ja {other} teevad kivi-paber-käärid ühe võiduni. Kaotaja võtab suure sõõmu!',
  },
  {
    id: 104,
    stage: 'early',
    type: 'drink',
    alcoholText: 'Kiire hääletus: suvi Pärnus või talv Otepääl? Vähemusse jäänud seltskond joob koos {player}-ga!',
    nonAlcoholText: 'Kiire hääletus: suvi Pärnus või talv Otepääl? Vähemusse jäänud seltskond võtab sõõmu koos {player}-ga!',
  },
  {
    id: 105,
    stage: 'early',
    type: 'drink',
    alcoholText: 'Kõik, kes jõid täna kohvi või energiajooki, võtavad lonksu! {player} jagab veel 1 lisalonksu.',
    nonAlcoholText: 'Kõik, kes jõid täna kohvi või energiajooki, võtavad sõõmu! {player} jagab veel 1 lisasõõmu.',
  },
  {
    id: 106,
    stage: 'early',
    type: 'drink',
    alcoholText: '{player}, nimeta 5 sekundiga 3 Eesti linna peale Tallinna ja Tartu! Kui ei jõua, võtad 2 lonksu.',
    nonAlcoholText: '{player}, nimeta 5 sekundiga 3 Eesti linna peale Tallinna ja Tartu! Kui ei jõua, võtad 2 sõõmu.',
  },
  {
    id: 107,
    stage: 'early',
    type: 'drink',
    alcoholText: 'Kõik, kelle sokkidel on muster või pilt, võtavad lonksu. Ühevärviliste kandjad pääsevad puhtalt!',
    nonAlcoholText: 'Kõik, kelle sokkidel on muster või pilt, võtavad sõõmu. Ühevärviliste kandjad pääsevad puhtalt!',
  },
  {
    id: 108,
    stage: 'early',
    type: 'drink',
    alcoholText: '{player} valib teema (nt automargid, snäkid). Igaüks ütleb kordamööda ühe. Kes takerdub, joob 2 lonksu!',
    nonAlcoholText: '{player} valib teema (nt automargid, snäkid). Igaüks ütleb kordamööda ühe. Kes takerdub, võtab 2 sõõmu!',
  },
  {
    id: 109,
    stage: 'early',
    type: 'drink',
    alcoholText: 'Kõik, kelle telefoni aku on hetkel alla 50%, võtavad laadimise terviseks ühe lonksu!',
    nonAlcoholText: 'Kõik, kelle telefoni aku on hetkel alla 50%, võtavad laadimise terviseks ühe sõõmu!',
  },
  {
    id: 110,
    stage: 'early',
    type: 'drink',
    alcoholText: '{player} ja {other} peavad korraga ütlema numbri 1–5. Kui ütlete sama numbri, joovad kõik teised!',
    nonAlcoholText: '{player} ja {other} peavad korraga ütlema numbri 1–5. Kui ütlete sama numbri, joovad kõik teised!',
  },
  {
    id: 111,
    stage: 'early',
    type: 'drink',
    alcoholText: 'Kõik, kes on viimase nädala jooksul Woltist või Bolt Foodist tellinud, võtavad mugavuslonksu!',
    nonAlcoholText: 'Kõik, kes on viimase nädala jooksul Woltist või Bolt Foodist tellinud, võtavad mugavussõõmu!',
  },
  {
    id: 112,
    stage: 'early',
    type: 'drink',
    alcoholText: '{player}, räägi 20 sekundit järjest ilma kordamata teemal "Miks reede on parim päev". Kui vait jääd, jood!',
    nonAlcoholText: '{player}, räägi 20 sekundit järjest ilma kordamata teemal "Miks reede on parim päev". Kui vait jääd, võtad sõõmu!',
  },
  {
    id: 113,
    stage: 'early',
    type: 'drink',
    alcoholText: 'Pikkuse järjekord! Seltskonna kõige lühem ja kõige pikem mängija löövad klaasid kokku ja joovad!',
    nonAlcoholText: 'Pikkuse järjekord! Seltskonna kõige lühem ja kõige pikem mängija löövad klaasid kokku ja võtavad sõõmu!',
  },
  {
    id: 114,
    stage: 'early',
    type: 'drink',
    alcoholText: '{player}, nimeta mängija, kes naeratab täna kõige rohkem. See mängija määrab {other}-le 2 lonksu!',
    nonAlcoholText: '{player}, nimeta mängija, kes naeratab täna kõige rohkem. See mängija määrab {other}-le 2 sõõmu!',
  },
  {
    id: 115,
    stage: 'early',
    type: 'drink',
    alcoholText: 'Kõik, kellel on praegu seljas midagi musta värvi, võtavad klassikalise lonksu!',
    nonAlcoholText: 'Kõik, kellel on praegu seljas midagi musta värvi, võtavad klassikalise sõõmu!',
  },
  {
    id: 116,
    stage: 'early',
    type: 'drink',
    alcoholText: '{player}, joo üks lonks iga laua taga oleva mängija eest, kelle nimes on täht "A"!',
    nonAlcoholText: '{player}, võta üks sõõm iga laua taga oleva mängija eest, kelle nimes on täht "A"!',
  },
  {
    id: 117,
    stage: 'early',
    type: 'drink',
    alcoholText: 'Kõik näitavad näpuga: kes räägib seltskonnas tavaliselt kõige valjemini? Valitu joob lonksu!',
    nonAlcoholText: 'Kõik näitavad näpuga: kes räägib seltskonnas tavaliselt kõige valjemini? Valitu võtab sõõmu!',
  },
  {
    id: 118,
    stage: 'early',
    type: 'drink',
    alcoholText: '{player} ja {other} peavad järgmise oma käiguni jooma alati paaris: kui üks joob, joob ka teine!',
    nonAlcoholText: '{player} ja {other} peavad järgmise oma käiguni jooma alati paaris: kui üks võtab sõõmu, võtab ka teine!',
  },
  {
    id: 119,
    stage: 'early',
    type: 'drink',
    alcoholText: 'Kõik, kes tulid peole ühistranspordi või taksoga, võtavad lonksu. Jalakäijad jagavad lonksu!',
    nonAlcoholText: 'Kõik, kes tulid peole ühistranspordi või taksoga, võtavad sõõmu. Jalakäijad jagavad sõõmu!',
  },
  {
    id: 120,
    stage: 'early',
    type: 'truth_dare',
    alcoholText: '{player}, mis oli su esimene mulje mängijast {other}? Räägi ausalt või võta 2 lonksu.',
    nonAlcoholText: '{player}, mis oli su esimene mulje mängijast {other}? Räägi ausalt või võta 2 sõõmu.',
  },
  {
    id: 121,
    stage: 'early',
    type: 'truth_dare',
    alcoholText: 'Kõik hääletavad näpuga näidates: kes satub kõige tõenäolisemalt hommikul võõrasse linna? Võitja jagab 2 lonksu laiali!',
    nonAlcoholText: 'Kõik hääletavad näpuga näidates: kes satub kõige tõenäolisemalt hommikul võõrasse linna? Võitja jagab 2 sõõmu laiali!',
  },
  {
    id: 122,
    stage: 'early',
    type: 'truth_dare',
    alcoholText: '{player}, tee parim paroodia ühest mängijast laua taga. Kui keegi 10 sekundiga ära arvab, võtab see mängija lonksu!',
    nonAlcoholText: '{player}, tee parim paroodia ühest mängijast laua taga. Kui keegi 10 sekundiga ära arvab, võtab see mängija sõõmu!',
  },
  {
    id: 123,
    stage: 'early',
    type: 'truth_dare',
    alcoholText: '{player}, ütle mängijale {other} üks täiesti ootamatu, aga siiras kompliment.',
    nonAlcoholText: '{player}, ütle mängijale {other} üks täiesti ootamatu, aga siiras kompliment.',
  },
  {
    id: 124,
    stage: 'early',
    type: 'truth_dare',
    alcoholText: '{player}, mis on kõige veidram harjumus, mis sul kodus üksi olles on? Räägi ausalt ära!',
    nonAlcoholText: '{player}, mis on kõige veidram harjumus, mis sul kodus üksi olles on? Räägi ausalt ära!',
  },
  {
    id: 125,
    stage: 'early',
    type: 'truth_dare',
    alcoholText: '{player}, lase mängijal {other} valida sinu telefonist üks lugu, mis pannakse kohe 30 sekundiks mängima!',
    nonAlcoholText: '{player}, lase mängijal {other} valida sinu telefonist üks lugu, mis pannakse kohe 30 sekundiks mängima!',
  },
  {
    id: 126,
    stage: 'early',
    type: 'truth_dare',
    alcoholText: '{player}, kes laua taga olevatest inimestest elaks zombiapokalüpsises kõige kauem üle ja miks?',
    nonAlcoholText: '{player}, kes laua taga olevatest inimestest elaks zombiapokalüpsises kõige kauem üle ja miks?',
  },
  {
    id: 127,
    stage: 'early',
    type: 'truth_dare',
    alcoholText: '{player}, seisa püsti ja tee 5 kükki, lugedes iga kükki prantsuse või saksa keeles!',
    nonAlcoholText: '{player}, seisa püsti ja tee 5 kükki, lugedes iga kükki prantsuse või saksa keeles!',
  },
  {
    id: 128,
    stage: 'early',
    type: 'truth_dare',
    alcoholText: '{player}, mis on kõige piinlikum laul, mida sa salaja autos või duši all kaasa laulad?',
    nonAlcoholText: '{player}, mis on kõige piinlikum laul, mida sa salaja autos või duši all kaasa laulad?',
  },
  {
    id: 129,
    stage: 'early',
    type: 'truth_dare',
    alcoholText: '{player}, ütle kolm asja, mis sul ja mängijal {other} on ühist!',
    nonAlcoholText: '{player}, ütle kolm asja, mis sul ja mängijal {other} on ühist!',
  },
  {
    id: 130,
    stage: 'early',
    type: 'truth_dare',
    alcoholText: '{player}, räägi oma järgmine lause nii, nagu oleksid telereklaami pealelugeja!',
    nonAlcoholText: '{player}, räägi oma järgmine lause nii, nagu oleksid telereklaami pealelugeja!',
  },
  {
    id: 131,
    stage: 'early',
    type: 'truth_dare',
    alcoholText: '{player}, näita kõigile oma telefoni avaekraani taustapilti ja seleta lühidalt selle lugu.',
    nonAlcoholText: '{player}, näita kõigile oma telefoni avaekraani taustapilti ja seleta lühidalt selle lugu.',
  },
  {
    id: 132,
    stage: 'early',
    type: 'truth_dare',
    alcoholText: 'Kõik hääletavad: kes laua taga vastab sõnumitele kõige aeglasemalt? Too inimene peab vabanduseks lonksu võtma!',
    nonAlcoholText: 'Kõik hääletavad: kes laua taga vastab sõnumitele kõige aeglasemalt? Too inimene peab vabanduseks sõõmu võtma!',
  },
  {
    id: 133,
    stage: 'early',
    type: 'truth_dare',
    alcoholText: '{player}, proovi mängijat {other} 10 sekundiga naerma ajada ilma teda puudutamata!',
    nonAlcoholText: '{player}, proovi mängijat {other} 10 sekundiga naerma ajada ilma teda puudutamata!',
  },
  {
    id: 134,
    stage: 'early',
    type: 'truth_dare',
    alcoholText: '{player}, mis oli sinu kõige esimene töökoht või taskuraha teenimise viis? Räägi lühidalt.',
    nonAlcoholText: '{player}, mis oli sinu kõige esimene töökoht või taskuraha teenimise viis? Räägi lühidalt.',
  },
  {
    id: 135,
    stage: 'early',
    type: 'truth_dare',
    alcoholText: '{player}, tee salajane käepigistus mängijaga {other}. Nüüdsest on see teie ametlik tervitus!',
    nonAlcoholText: '{player}, tee salajane käepigistus mängijaga {other}. Nüüdsest on see teie ametlik tervitus!',
  },
  {
    id: 136,
    stage: 'early',
    type: 'truth_dare',
    alcoholText: '{player}, kumb on parem: kas mitte kunagi enam pitsat või mitte kunagi enam burgerit süüa? Põhjenda!',
    nonAlcoholText: '{player}, kumb on parem: kas mitte kunagi enam pitsat või mitte kunagi enam burgerit süüa? Põhjenda!',
  },
  {
    id: 137,
    stage: 'early',
    type: 'truth_dare',
    alcoholText: '{player}, räägi üks naljakas lapsepõlvelugu, mida su vanemad siiani sugulastele räägivad.',
    nonAlcoholText: '{player}, räägi üks naljakas lapsepõlvelugu, mida su vanemad siiani sugulastele räägivad.',
  },
  {
    id: 138,
    stage: 'early',
    type: 'truth_dare',
    alcoholText: '{player}, laula või ümise 10 sekundit ühte tuntud eurolaulu refrääni!',
    nonAlcoholText: '{player}, laula või ümise 10 sekundit ühte tuntud eurolaulu refrääni!',
  },

  // ==========================================
  // FAAS 2: VÜRTSIKAKS (Mid) - ID: 201 .. 238
  // ==========================================
  {
    id: 201,
    stage: 'mid',
    type: 'drink',
    alcoholText: 'Silmsideduell! {player} ja {other} vaatavad teineteisele tõsiselt silma. Kes esimesena naerma hakkab või pilgu pöörab, võtab 2 lonksu!',
    nonAlcoholText: 'Silmsideduell! {player} ja {other} vaatavad teineteisele tõsiselt silma. Kes esimesena naerma hakkab või pilgu pöörab, võtab 2 sõõmu!',
  },
  {
    id: 202,
    stage: 'mid',
    type: 'drink',
    alcoholText: '{player}, vaheta kohe istekoht mängijaga {other} ja võtke mõlemad uue koha tähistamiseks lonks!',
    nonAlcoholText: '{player}, vaheta kohe istekoht mängijaga {other} ja võtke mõlemad uue koha tähistamiseks sõõm!',
  },
  {
    id: 203,
    stage: 'mid',
    type: 'drink',
    alcoholText: '{player} alustab: "Ma pole kunagi..." Kõik, kes on seda teinud, võtavad lonksu!',
    nonAlcoholText: '{player} alustab: "Ma pole kunagi..." Kõik, kes on seda teinud, võtavad sõõmu!',
  },
  {
    id: 204,
    stage: 'mid',
    type: 'drink',
    alcoholText: '{player}, sosista mängijale {other} kõrva üks vürtsikas küsimus. {other} ütleb vastuse kõva häälega, ilma et avaldaks küsimust!',
    nonAlcoholText: '{player}, sosista mängijale {other} kõrva üks vürtsikas küsimus. {other} ütleb vastuse kõva häälega, ilma et avaldaks küsimust!',
  },
  {
    id: 205,
    stage: 'mid',
    type: 'drink',
    alcoholText: 'Kõik, kes on kunagi kellelegi purjus peaga kahetsusväärse sõnumi saatnud, võtavad aususlonksu!',
    nonAlcoholText: 'Kõik, kes on kunagi kellelegi öösel kahetsusväärse sõnumi saatnud, võtavad ausussõõmu!',
  },
  {
    id: 206,
    stage: 'mid',
    type: 'drink',
    alcoholText: '{player}, nimeta mängija, kellega sa kõige vähem tahaksid lifti kinni jääda. See mängija määrab sulle 2 lonksu!',
    nonAlcoholText: '{player}, nimeta mängija, kellega sa kõige vähem tahaksid lifti kinni jääda. See mängija määrab sulle 2 sõõmu!',
  },
  {
    id: 207,
    stage: 'mid',
    type: 'drink',
    alcoholText: 'Kõik, kes on kunagi valetanud, miks nad peole ei saa tulla, võtavad lonksu!',
    nonAlcoholText: 'Kõik, kes on kunagi valetanud, miks nad peole ei saa tulla, võtavad sõõmu!',
  },
  {
    id: 208,
    stage: 'mid',
    type: 'drink',
    alcoholText: '{player} ja {other} peavad jooma oma klaasist teineteise käega (käed risti nagu pulmas)!',
    nonAlcoholText: '{player} ja {other} peavad jooma oma klaasist teineteise käega (käed risti nagu pulmas)!',
  },
  {
    id: 209,
    stage: 'mid',
    type: 'drink',
    alcoholText: 'Kõik näitavad näpuga: kes siit seltskonnast kulutab riietele või ilule kõige rohkem raha? Valitu joob 2 lonksu!',
    nonAlcoholText: 'Kõik näitavad näpuga: kes siit seltskonnast kulutab riietele või ilule kõige rohkem raha? Valitu võtab 2 sõõmu!',
  },
  {
    id: 210,
    stage: 'mid',
    type: 'drink',
    alcoholText: '{player}, ütle ausalt: kas oled kunagi kellegi laua taga oleva inimese sotsiaalmeediat salaja luuranud? Kui jah, joo 2 lonksu!',
    nonAlcoholText: '{player}, ütle ausalt: kas oled kunagi kellegi laua taga oleva inimese sotsiaalmeediat salaja luuranud? Kui jah, võta 2 sõõmu!',
  },
  {
    id: 211,
    stage: 'mid',
    type: 'drink',
    alcoholText: 'Kõik, kes on hetkel vallalised, võtavad vabaduse auks lonksu! Suhtes olijad jagavad 1 lonksu.',
    nonAlcoholText: 'Kõik, kes on hetkel vallalised, võtavad vabaduse auks sõõmu! Suhtes olijad jagavad 1 sõõmu.',
  },
  {
    id: 212,
    stage: 'mid',
    type: 'drink',
    alcoholText: '{player}, ütle üks asi, mida sa mängija {other} juures kadestad või imetled. Mõlemad võtavad lonksu!',
    nonAlcoholText: '{player}, ütle üks asi, mida sa mängija {other} juures kadestad või imetled. Mõlemad võtavad sõõmu!',
  },
  {
    id: 213,
    stage: 'mid',
    type: 'drink',
    alcoholText: 'Kõik hääletavad: kes lahkub peolt tavaliselt prantsuse lahkumisega (ilma hüvasti jätmata)? Süüdlane joob 2 lonksu!',
    nonAlcoholText: 'Kõik hääletavad: kes lahkub peolt tavaliselt prantsuse lahkumisega (ilma hüvasti jätmata)? Süüdlane võtab 2 sõõmu!',
  },
  {
    id: 214,
    stage: 'mid',
    type: 'drink',
    alcoholText: '{player}, joo nii mitu lonksu, kui mitu tundi sa eile öösel magasid alla 8 tunni!',
    nonAlcoholText: '{player}, võta nii mitu sõõmu, kui mitu tundi sa eile öösel magasid alla 8 tunni!',
  },
  {
    id: 215,
    stage: 'mid',
    type: 'drink',
    alcoholText: 'Kõik, kes on kunagi Tinderis või mõnes tutvumisäpis käinud, võtavad swipe-lonksu!',
    nonAlcoholText: 'Kõik, kes on kunagi Tinderis või mõnes tutvumisäpis käinud, võtavad swipe-sõõmu!',
  },
  {
    id: 216,
    stage: 'mid',
    type: 'drink',
    alcoholText: '{player}, esita mängijale {other} moraalne dilemma. Kui ta ei suuda 10 sekundiga vastata, joob ta 2 lonksu!',
    nonAlcoholText: '{player}, esita mängijale {other} moraalne dilemma. Kui ta ei suuda 10 sekundiga vastata, võtab ta 2 sõõmu!',
  },
  {
    id: 217,
    stage: 'mid',
    type: 'drink',
    alcoholText: 'Kõik, kes on kunagi tööl või koolis haigust teeselnud, võtavad patukahetsuse lonksu!',
    nonAlcoholText: 'Kõik, kes on kunagi tööl või koolis haigust teeselnud, võtavad patukahetsuse sõõmu!',
  },
  {
    id: 218,
    stage: 'mid',
    type: 'drink',
    alcoholText: '{player}, vali üks mängija, kellega vahetad klaasid järgmise oma käiguni!',
    nonAlcoholText: '{player}, vali üks mängija, kellega vahetad joogiklaasid järgmise oma käiguni!',
  },
  {
    id: 219,
    stage: 'mid',
    type: 'drink',
    alcoholText: 'Kõik, kes on kunagi öelnud "ma täna võtan ainult ühe", võtavad iroonia auks 2 lonksu!',
    nonAlcoholText: 'Kõik, kes on kunagi öelnud "ma täna jään täitsa varakult koju", võtavad iroonia auks 2 sõõmu!',
  },
  {
    id: 220,
    stage: 'mid',
    type: 'truth_dare',
    alcoholText: '{player}, näita kõigile viimast fotot oma telefoni galeriis või joo 3 lonksu!',
    nonAlcoholText: '{player}, näita kõigile viimast fotot oma telefoni galeriis või võta 3 suurt sõõmu!',
  },
  {
    id: 221,
    stage: 'mid',
    type: 'truth_dare',
    alcoholText: '{player}, sosista oma paremal käel istuvale mängijale üks saladus, mida teised laua taga ei tea.',
    nonAlcoholText: '{player}, sosista oma paremal käel istuvale mängijale üks saladus, mida teised laua taga ei tea.',
  },
  {
    id: 222,
    stage: 'mid',
    type: 'truth_dare',
    alcoholText: '{player}, kes siit seltskonnast oleks kõige ohtlikum peokaaslane välismaal ja miks? Nimeta ta ja võtke koos lonks!',
    nonAlcoholText: '{player}, kes siit seltskonnast oleks kõige ohtlikum peokaaslane välismaal ja miks? Nimeta ta ja võtke koos sõõm!',
  },
  {
    id: 223,
    stage: 'mid',
    type: 'truth_dare',
    alcoholText: '{player} ja {other} peavad järgmise vooru lõpuni hoidma üksteisel käest kinni. Kui lahti lasete, joote mõlemad 2 lonksu!',
    nonAlcoholText: '{player} ja {other} peavad järgmise vooru lõpuni hoidma üksteisel käest kinni. Kui lahti lasete, võtate mõlemad 2 sõõmu!',
  },
  {
    id: 224,
    stage: 'mid',
    type: 'truth_dare',
    alcoholText: '{player}, loe ette oma viimane saadetud sõnum Instagramis või WhatsAppis!',
    nonAlcoholText: '{player}, loe ette oma viimane saadetud sõnum Instagramis või WhatsAppis!',
  },
  {
    id: 225,
    stage: 'mid',
    type: 'truth_dare',
    alcoholText: '{player}, lase mängijal {other} teha endale uus soeng, mis peab jääma pähe 3 järgmiseks ringiks!',
    nonAlcoholText: '{player}, lase mängijal {other} teha endale uus soeng, mis peab jääma pähe 3 järgmiseks ringiks!',
  },
  {
    id: 226,
    stage: 'mid',
    type: 'truth_dare',
    alcoholText: '{player}, mis on olnud sinu elu kõige kohmakam või ebaõnnestunum deit? Räägi lühidalt parim pala.',
    nonAlcoholText: '{player}, mis on olnud sinu elu kõige kohmakam või ebaõnnestunum deit? Räägi lühidalt parim pala.',
  },
  {
    id: 227,
    stage: 'mid',
    type: 'truth_dare',
    alcoholText: '{player}, tee mängijale {other} tõsine armastusavaldus, kasutades ainult toidunimetusi!',
    nonAlcoholText: '{player}, tee mängijale {other} tõsine armastusavaldus, kasutades ainult toidunimetusi!',
  },
  {
    id: 228,
    stage: 'mid',
    type: 'truth_dare',
    alcoholText: '{player}, ütle ausalt: kes siit seltskonnast riietub kõige stiilsemalt ja kes vajaks veidi stilisti abi?',
    nonAlcoholText: '{player}, ütle ausalt: kes siit seltskonnast riietub kõige stiilsemalt ja kes vajaks veidi stilisti abi?',
  },
  {
    id: 229,
    stage: 'mid',
    type: 'truth_dare',
    alcoholText: '{player}, räägi järgmised 2 minutit ainult sosistades või võta 2 trahvironksu!',
    nonAlcoholText: '{player}, räägi järgmised 2 minutit ainult sosistades või võta 2 trahvisõõmu!',
  },
  {
    id: 230,
    stage: 'mid',
    type: 'truth_dare',
    alcoholText: '{player}, ava oma Spotify või Apple Music ja näita oma viimati kuulatud lugude nimekirja esimesi kolme laulu.',
    nonAlcoholText: '{player}, ava oma Spotify või Apple Music ja näita oma viimati kuulatud lugude nimekirja esimesi kolme laulu.',
  },
  {
    id: 231,
    stage: 'mid',
    type: 'truth_dare',
    alcoholText: '{player}, vaheta oma telefon mängijaga {other} ja te võite teineteise telefonist vaadata viimast ekraanitõmmist (screenshot).',
    nonAlcoholText: '{player}, vaheta oma telefon mängijaga {other} ja te võite teineteise telefonist vaadata viimast ekraanitõmmist (screenshot).',
  },
  {
    id: 232,
    stage: 'mid',
    type: 'truth_dare',
    alcoholText: '{player}, tunnista üles üks vale, mille oled hiljuti kellelegi laua taga öelnud (või vana saladus)!',
    nonAlcoholText: '{player}, tunnista üles üks vale, mille oled hiljuti kellelegi laua taga öelnud (või vana saladus)!',
  },
  {
    id: 233,
    stage: 'mid',
    type: 'truth_dare',
    alcoholText: '{player}, lase mängijal {other} joonistada sulle pastakaga näole või käele väike naljakas tätoveering!',
    nonAlcoholText: '{player}, lase mängijal {other} joonistada sulle pastakaga näole või käele väike naljakas tätoveering!',
  },
  {
    id: 234,
    stage: 'mid',
    type: 'truth_dare',
    alcoholText: '{player}, mis on kõige rumalam asi, mille peale oled viimase kuu jooksul raha raisanud?',
    nonAlcoholText: '{player}, mis on kõige rumalam asi, mille peale oled viimase kuu jooksul raha raisanud?',
  },
  {
    id: 235,
    stage: 'mid',
    type: 'truth_dare',
    alcoholText: '{player}, tee mängijaga {other} dramaatiline seebiooperi stseen teemal "Sa unustasid osta piima!"',
    nonAlcoholText: '{player}, tee mängijaga {other} dramaatiline seebiooperi stseen teemal "Sa unustasid osta piima!"',
  },
  {
    id: 236,
    stage: 'mid',
    type: 'truth_dare',
    alcoholText: '{player}, helista või saada häälsõnum ühele sõbrale (kes pole siin) ja ütle talle: "Kurgid on küpsed, kordan, kurgid on küpsed!"',
    nonAlcoholText: '{player}, helista või saada häälsõnum ühele sõbrale (kes pole siin) ja ütle talle: "Kurgid on küpsed, kordan, kurgid on küpsed!"',
  },
  {
    id: 237,
    stage: 'mid',
    type: 'truth_dare',
    alcoholText: '{player}, ütle iga laua taga oleva mängija kohta üks omadussõna, mis teda kõige paremini kirjeldab!',
    nonAlcoholText: '{player}, ütle iga laua taga oleva mängija kohta üks omadussõna, mis teda kõige paremini kirjeldab!',
  },
  {
    id: 238,
    stage: 'mid',
    type: 'truth_dare',
    alcoholText: '{player}, tee 15 sekundit kõhulihaste harjutust (plank) ja vasta samal ajal mängija {other} esitatud küsimusele!',
    nonAlcoholText: '{player}, tee 15 sekundit kõhulihaste harjutust (plank) ja vasta samal ajal mängija {other} esitatud küsimusele!',
  },

  // ==========================================
  // FAAS 3: HULLUS (Late) - ID: 301 .. 338
  // ==========================================
  {
    id: 301,
    stage: 'late',
    type: 'drink',
    alcoholText: 'FINAALIKÜTE! {player} valib endale paarilise ({other} või keegi teine) ja mõlemad teevad korraga 3 kiiret lonksu!',
    nonAlcoholText: 'FINAALIKÜTE! {player} valib endale paarilise ({other} või keegi teine) ja mõlemad teevad korraga 3 kiiret sõõmu!',
  },
  {
    id: 302,
    stage: 'late',
    type: 'drink',
    alcoholText: 'Kose-aeg! {player} alustab joomist ja teised järjest kaasa – keegi ei tohi lõpetada enne kui temast eelmine mängija!',
    nonAlcoholText: 'Kose-aeg! {player} alustab joomist ja teised järjest kaasa – keegi ei tohi lõpetada enne kui temast eelmine mängija!',
  },
  {
    id: 303,
    stage: 'late',
    type: 'drink',
    alcoholText: '{player}, esita otsene väljakutse mängijale {other}: kes joob oma klaasist kiiremini 3 lonksu? Kaotaja maksab võitjale veel komplimendi!',
    nonAlcoholText: '{player}, esita otsene väljakutse mängijale {other}: kes joob oma klaasist kiiremini 3 sõõmu? Kaotaja teeb võitjale veel komplimendi!',
  },
  {
    id: 304,
    stage: 'late',
    type: 'drink',
    alcoholText: 'Vene rulett! {player} veeretab virtuaalselt: kõik mängijad, kelle müntide arv on paarisarv, joovad 2 lonksu!',
    nonAlcoholText: 'Vene rulett! {player} veeretab virtuaalselt: kõik mängijad, kelle müntide arv on paarisarv, võtavad 2 sõõmu!',
  },
  {
    id: 305,
    stage: 'late',
    type: 'drink',
    alcoholText: 'Kuldne tund! Mängija, kellel on hetkel kõige rohkem münte, peab jooma 3 võidulonksu ja teised aplodeerivad!',
    nonAlcoholText: 'Kuldne tund! Mängija, kellel on hetkel kõige rohkem münte, peab võtma 3 võidusõõmu ja teised aplodeerivad!',
  },
  {
    id: 306,
    stage: 'late',
    type: 'drink',
    alcoholText: 'Põhjakoristus! Igaüks, kelle klaasis on jooki alla poole, joob oma klaasi tühjaks või võtab 2 suurt lonksu!',
    nonAlcoholText: 'Põhjakoristus! Igaüks, kelle klaasis on jooki alla poole, joob oma klaasi tühjaks või võtab 2 suurt sõõmu!',
  },
  {
    id: 307,
    stage: 'late',
    type: 'drink',
    alcoholText: '{player}, joo lonks ilma käsi kasutamata! Kui vajad abi, tohib {other} sind aidata, aga joote mõlemad.',
    nonAlcoholText: '{player}, võta sõõm ilma käsi kasutamata! Kui vajad abi, tohib {other} sind aidata, aga võtate mõlemad.',
  },
  {
    id: 308,
    stage: 'late',
    type: 'drink',
    alcoholText: 'Kõik näitavad näpuga: kes on täna õhtu tõeline peolõvi? Too inimene jagab seltskonnale laiali 5 lonksu!',
    nonAlcoholText: 'Kõik näitavad näpuga: kes on täna õhtu tõeline peolõvi? Too inimene jagab seltskonnale laiali 5 sõõmu!',
  },
  {
    id: 309,
    stage: 'late',
    type: 'drink',
    alcoholText: '{player} ja tema paremal käel istuv naaber võtavad mõlemad 2 lonksu ja teevad kiire võidutantsu!',
    nonAlcoholText: '{player} ja tema paremal käel istuv naaber võtavad mõlemad 2 sõõmu ja teevad kiire võidutantsu!',
  },
  {
    id: 310,
    stage: 'late',
    type: 'drink',
    alcoholText: 'Kõik tõusevad püsti! Viimane, kes püsti saab, joob 3 karistuslonksu!',
    nonAlcoholText: 'Kõik tõusevad püsti! Viimane, kes püsti saab, võtab 3 karistussõõmu!',
  },
  {
    id: 311,
    stage: 'late',
    type: 'drink',
    alcoholText: '{player}, vali kaks mängijat, kes peavad omavahel tegema klaaside kokkulöömise toosti ja jooma 2 lonksu!',
    nonAlcoholText: '{player}, vali kaks mängijat, kes peavad omavahel tegema klaaside kokkulöömise toosti ja võtma 2 sõõmu!',
  },
  {
    id: 312,
    stage: 'late',
    type: 'drink',
    alcoholText: 'Pöörane ring! Kõik mängijad võtavad järjest vasakult paremale ühe mehise lonksu ilma pausita!',
    nonAlcoholText: 'Pöörane ring! Kõik mängijad võtavad järjest vasakult paremale ühe mehise sõõmu ilma pausita!',
  },
  {
    id: 313,
    stage: 'late',
    type: 'drink',
    alcoholText: '{player}, kui su klaasis on jääd, võtad lonksu. Kui ei ole, määrad {other}-le 2 lonksu!',
    nonAlcoholText: '{player}, kui su klaasis on jääd, võtad sõõmu. Kui ei ole, määrad {other}-le 2 sõõmu!',
  },
  {
    id: 314,
    stage: 'late',
    type: 'drink',
    alcoholText: 'Pankurite kriis! Mängija, kellel on hetkel kõige vähem münte, saab lohutuseks 2 münti ja määrab 3 lonksu!',
    nonAlcoholText: 'Pankurite kriis! Mängija, kellel on hetkel kõige vähem münte, saab lohutuseks 2 münti ja määrab 3 sõõmu!',
  },
  {
    id: 315,
    stage: 'late',
    type: 'drink',
    alcoholText: '{player}, joo 2 lonksu ja tee kohe järgi laua taga oleva lemmiklooma või metslooma hääl!',
    nonAlcoholText: '{player}, võta 2 sõõmu ja tee kohe järgi laua taga oleva lemmiklooma või metslooma hääl!',
  },
  {
    id: 316,
    stage: 'late',
    type: 'drink',
    alcoholText: 'Kõik, kes plaanivad täna veel edasi peole või ööklubisse minna, võtavad kütelonksu!',
    nonAlcoholText: 'Kõik, kes plaanivad täna veel kaua üleval olla, võtavad energiasõõmu!',
  },
  {
    id: 317,
    stage: 'late',
    type: 'drink',
    alcoholText: '{player} ja {other} joovad teineteisele otsa vaadates sünkroonis 2 lonksu ja löövad nukid kokku!',
    nonAlcoholText: '{player} ja {other} joovad teineteisele otsa vaadates sünkroonis 2 sõõmu ja löövad nukid kokku!',
  },
  {
    id: 318,
    stage: 'late',
    type: 'drink',
    alcoholText: 'Täielik kaos! Igaüks laua taga joob täpselt nii palju lonkse, kui mitu kinnisvara talle kuulub!',
    nonAlcoholText: 'Täielik kaos! Igaüks laua taga võtab täpselt nii palju sõõme, kui mitu kinnisvara talle kuulub!',
  },
  {
    id: 319,
    stage: 'late',
    type: 'drink',
    alcoholText: '{player}, ütle kiiresti: "Musta lehma saba valge lehma taga" 3 korda. Kui eksid, jood 3 lonksu!',
    nonAlcoholText: '{player}, ütle kiiresti: "Musta lehma saba valge lehma taga" 3 korda. Kui eksid, võtad 3 sõõmu!',
  },
  {
    id: 320,
    stage: 'late',
    type: 'truth_dare',
    alcoholText: '{player}, tee mängijale {other} 15-sekundiline õlamassaaž ja räägi samal ajal nagu spordikommentaator!',
    nonAlcoholText: '{player}, tee mängijale {other} 15-sekundiline õlamassaaž ja räägi samal ajal nagu spordikommentaator!',
  },
  {
    id: 321,
    stage: 'late',
    type: 'truth_dare',
    alcoholText: '{player}, anna oma telefon 20 sekundiks mängija {other} kätte – ta võib avada ühe vabalt valitud äpi!',
    nonAlcoholText: '{player}, anna oma telefon 20 sekundiks mängija {other} kätte – ta võib avada ühe vabalt valitud äpi!',
  },
  {
    id: 322,
    stage: 'late',
    type: 'truth_dare',
    alcoholText: '{player}, nimeta siit seltskonnast inimene, kellega läheksid kohe praegu üksikule saarele, ja tehke koos võidukas nukk või kallistus!',
    nonAlcoholText: '{player}, nimeta siit seltskonnast inimene, kellega läheksid kohe praegu üksikule saarele, ja tehke koos võidukas nukk või kallistus!',
  },
  {
    id: 323,
    stage: 'late',
    type: 'truth_dare',
    alcoholText: '{player}, tantsi 15 sekundit ilma muusikata, samal ajal kui {other} teeb sulle suuga rütmi (beatbox)!',
    nonAlcoholText: '{player}, tantsi 15 sekundit ilma muusikata, samal ajal kui {other} teeb sulle suuga rütmi (beatbox)!',
  },
  {
    id: 324,
    stage: 'late',
    type: 'truth_dare',
    alcoholText: '{player}, vaheta üks riideese (müts, jakk, kell vms) mängijaga {other} ja kanna seda mängu lõpuni!',
    nonAlcoholText: '{player}, vaheta üks riideese (müts, jakk, kell vms) mängijaga {other} ja kanna seda mängu lõpuni!',
  },
  {
    id: 325,
    stage: 'late',
    type: 'truth_dare',
    alcoholText: '{player}, tee oma parim aegluubis filmistseen, kus saad kuuli või päästad maailma!',
    nonAlcoholText: '{player}, tee oma parim aegluubis filmistseen, kus saad kuuli või päästad maailma!',
  },
  {
    id: 326,
    stage: 'late',
    type: 'truth_dare',
    alcoholText: '{player}, lase mängijal {other} postitada või saata suvalisse chatti üks naljakas emoji ilma selgituseta!',
    nonAlcoholText: '{player}, lase mängijal {other} postitada või saata suvalisse chatti üks naljakas emoji ilma selgituseta!',
  },
  {
    id: 327,
    stage: 'late',
    type: 'truth_dare',
    alcoholText: '{player}, räägi kõigile oma kõige hullumeelsem peomälestus, mida sa tavaliselt vanematele ei räägiks!',
    nonAlcoholText: '{player}, räägi kõigile oma kõige hullumeelsem peomälestus, mida sa tavaliselt vanematele ei räägiks!',
  },
  {
    id: 328,
    stage: 'late',
    type: 'truth_dare',
    alcoholText: '{player}, võta mängijal {other} käest kinni, vaata talle silma ja loe talle südamlik luuletus lumest või kartulitest!',
    nonAlcoholText: '{player}, võta mängijal {other} käest kinni, vaata talle silma ja loe talle südamlik luuletus lumest või kartulitest!',
  },
  {
    id: 329,
    stage: 'late',
    type: 'truth_dare',
    alcoholText: '{player}, tee laua taga olevale seltskonnale 30-sekundiline stand-up komöödia etteaste!',
    nonAlcoholText: '{player}, tee laua taga olevale seltskonnale 30-sekundiline stand-up komöödia etteaste!',
  },
  {
    id: 330,
    stage: 'late',
    type: 'truth_dare',
    alcoholText: '{player}, lase mängijal {other} panna oma silmad kinni ja arva puudutuse järgi ära, kelle käsi see on!',
    nonAlcoholText: '{player}, lase mängijal {other} panna oma silmad kinni ja arva puudutuse järgi ära, kelle käsi see on!',
  },
  {
    id: 331,
    stage: 'late',
    type: 'truth_dare',
    alcoholText: '{player}, ütle täiesti ausalt: kui peaksid abielluma kellegagi sellest ruumist, kes see oleks?',
    nonAlcoholText: '{player}, ütle täiesti ausalt: kui peaksid abielluma kellegagi sellest ruumist, kes see oleks?',
  },
  {
    id: 332,
    stage: 'late',
    type: 'truth_dare',
    alcoholText: '{player}, tee mängijaga {other} sünkroonne räpparite poos ja laske kellelgi teha kiire foto!',
    nonAlcoholText: '{player}, tee mängijaga {other} sünkroonne räpparite poos ja laske kellelgi teha kiire foto!',
  },
  {
    id: 333,
    stage: 'late',
    type: 'truth_dare',
    alcoholText: '{player}, räägi järgmised 3 käiku ainult lauldes või ooperihäälega!',
    nonAlcoholText: '{player}, räägi järgmised 3 käiku ainult lauldes või ooperihäälega!',
  },
  {
    id: 334,
    stage: 'late',
    type: 'truth_dare',
    alcoholText: '{player}, tee 10 kätekõverdust! Igaüks laua taga loeb kaasa ja ergutab!',
    nonAlcoholText: '{player}, tee 10 kätekõverdust! Igaüks laua taga loeb kaasa ja ergutab!',
  },
  {
    id: 335,
    stage: 'late',
    type: 'truth_dare',
    alcoholText: '{player}, kes laua taga olevatest inimestest on täna teinud kõige naljakama nalja? Kallista teda!',
    nonAlcoholText: '{player}, kes laua taga olevatest inimestest on täna teinud kõige naljakama nalja? Kallista teda!',
  },
  {
    id: 336,
    stage: 'late',
    type: 'truth_dare',
    alcoholText: '{player}, teeskle 20 sekundit, et oled vihane restoranikriitik või Gordon Ramsay ja kritiseeri laua snäkke!',
    nonAlcoholText: '{player}, teeskle 20 sekundit, et oled vihane restoranikriitik või Gordon Ramsay ja kritiseeri laua snäkke!',
  },
  {
    id: 337,
    stage: 'late',
    type: 'truth_dare',
    alcoholText: '{player}, luba mängijal {other} saata oma Instagrami storysse üks täiesti suvaline pilt ilma selgituseta!',
    nonAlcoholText: '{player}, luba mängijal {other} saata oma Instagrami storysse üks täiesti suvaline pilt ilma selgituseta!',
  },
  {
    id: 338,
    stage: 'late',
    type: 'truth_dare',
    alcoholText: '{player}, tõuse püsti ja pea kogu seltskonnale võimas filmilik kõne teemal "Meie oleme võitjad!"',
    nonAlcoholText: '{player}, tõuse püsti ja pea kogu seltskonnale võimas filmilik kõne teemal "Meie oleme võitjad!"',
  },
];

export function getStageForRound(round: number, maxRounds: number = DEFAULT_ROUNDS): RoundStage {
  const earlyCut = Math.max(1, Math.min(maxRounds - 2, Math.round(maxRounds * 0.3)));
  const midCut = Math.min(maxRounds - 1, Math.max(earlyCut + 1, Math.round(maxRounds * 0.7)));

  if (round <= earlyCut) return 'early';
  if (round <= midCut) return 'mid';
  return 'late';
}

export function getStageName(stage: RoundStage): string {
  switch (stage) {
    case 'early':
      return 'Soojendus';
    case 'mid':
      return 'Vürtsikaks';
    case 'late':
      return 'Hullus';
  }
}

export interface DrawCardResult {
  text: string;
  cardId: number;
  newUsedIds: number[];
}

export function drawPartyCard(
  type: 'drink' | 'truth_dare',
  round: number,
  currentPlayerName: string,
  allPlayerNames: string[],
  nonAlcoholic: boolean,
  usedIds: number[],
  maxRounds: number = DEFAULT_ROUNDS
): DrawCardResult {
  const stage = getStageForRound(round, maxRounds);
  
  // Kõik selle faasi ja tüübi kaardid
  const stagePool = PARTY_CARDS.filter((c) => c.stage === stage && c.type === type);
  const fallbackPool = stagePool.length > 0 ? stagePool : PARTY_CARDS.filter((c) => c.type === type);

  // Filtreeri välja need, mida on juba selles mängus tõmmatud
  let available = fallbackPool.filter((c) => !usedIds.includes(c.id));
  let updatedUsedIds = [...usedIds];

  // Kui kõik selle kategooria kaardid on läbi mängitud, tühjenda selle kategooria ajalugu (algab uus ring)
  if (available.length === 0) {
    const stageIds = new Set(fallbackPool.map((c) => c.id));
    updatedUsedIds = updatedUsedIds.filter((id) => !stageIds.has(id));
    available = fallbackPool;
  }

  const chosen = available[Math.floor(Math.random() * available.length)];
  updatedUsedIds.push(chosen.id);

  const others = allPlayerNames.filter((n) => n !== currentPlayerName);
  const randomOther =
    others.length > 0
      ? others[Math.floor(Math.random() * others.length)]
      : currentPlayerName;

  const raw = nonAlcoholic ? chosen.nonAlcoholText : chosen.alcoholText;
  const formattedText = raw
    .replaceAll('{player}', currentPlayerName)
    .replaceAll('{other}', randomOther);

  return {
    text: formattedText,
    cardId: chosen.id,
    newUsedIds: updatedUsedIds,
  };
}
