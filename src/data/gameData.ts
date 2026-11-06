import type { Tile, PartyCardTemplate, RoundStage } from '../types';

export const TOTAL_TILES = 40;

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
  // ROUNDS 1–3: ICEBREAKERS (Early)
  {
    stage: 'early',
    type: 'drink',
    alcoholText: '{player}, nimeta kolm asja, mida teed enne pidu. Kõik, kes teevad vähemalt ühte neist, võtavad lonksu!',
    nonAlcoholText: '{player}, nimeta kolm asja, mida teed enne pidu. Kõik, kes teevad vähemalt ühte neist, võtavad sõõmu!',
  },
  {
    stage: 'early',
    type: 'drink',
    alcoholText: 'Kõik näitavad korraga näpuga: kes siit seltskonnast jääb täna esimesena magama? Enim hääli saanud mängija võtab 2 lonksu!',
    nonAlcoholText: 'Kõik näitavad korraga näpuga: kes siit seltskonnast jääb täna esimesena magama? Enim hääli saanud mängija võtab 2 sõõmu!',
  },
  {
    stage: 'early',
    type: 'drink',
    alcoholText: '{player} ja {other} teevad kivi-paber-käärid ühe võiduni. Kaotaja võtab mehise lonksu!',
    nonAlcoholText: '{player} ja {other} teevad kivi-paber-käärid ühe võiduni. Kaotaja võtab suure sõõmu!',
  },
  {
    stage: 'early',
    type: 'drink',
    alcoholText: 'Kiire hääletus: suvi Pärnus või talv Otepääl? Vähemusse jäänud seltskond joob koos {player}-ga!',
    nonAlcoholText: 'Kiire hääletus: suvi Pärnus või talv Otepääl? Vähemusse jäänud seltskond võtab sõõmu koos {player}-ga!',
  },
  {
    stage: 'early',
    type: 'truth_dare',
    alcoholText: '{player}, mis oli su esimene mulje mängijast {other}? Räägi ausalt või võta 2 lonksu.',
    nonAlcoholText: '{player}, mis oli su esimene mulje mängijast {other}? Räägi ausalt või võta 2 sõõmu.',
  },
  {
    stage: 'early',
    type: 'truth_dare',
    alcoholText: 'Kõik hääletavad näpuga näidates: kes satub kõige tõenäolisemalt hommikul võõrasse linna? Võitja jagab 2 lonksu laiali!',
    nonAlcoholText: 'Kõik hääletavad näpuga näidates: kes satub kõige tõenäolisemalt hommikul võõrasse linna? Võitja jagab 2 sõõmu laiali!',
  },
  {
    stage: 'early',
    type: 'truth_dare',
    alcoholText: '{player}, tee parim paroodia ühest mängijast laua taga. Kui keegi 10 sekundiga ära arvab, võtab see mängija lonksu!',
    nonAlcoholText: '{player}, tee parim paroodia ühest mängijast laua taga. Kui keegi 10 sekundiga ära arvab, võtab see mängija sõõmu!',
  },
  {
    stage: 'early',
    type: 'truth_dare',
    alcoholText: '{player}, ütle mängijale {other} üks täiesti ootamatu, aga siiras kompliment.',
    nonAlcoholText: '{player}, ütle mängijale {other} üks täiesti ootamatu, aga siiras kompliment.',
  },

  // ROUNDS 4–7: PROVOCATIVE & KINETIC (Mid)
  {
    stage: 'mid',
    type: 'drink',
    alcoholText: 'Silmsideduell! {player} ja {other} vaatavad teineteisele tõsiselt silma. Kes esimesena naerma hakkab või pilgu pöörab, võtab 2 lonksu!',
    nonAlcoholText: 'Silmsideduell! {player} ja {other} vaatavad teineteisele tõsiselt silma. Kes esimesena naerma hakkab või pilgu pöörab, võtab 2 sõõmu!',
  },
  {
    stage: 'mid',
    type: 'drink',
    alcoholText: '{player}, vaheta kohe istekoht mängijaga {other} ja võtke mõlemad uue koha tähistamiseks lonks!',
    nonAlcoholText: '{player}, vaheta kohe istekoht mängijaga {other} ja võtke mõlemad uue koha tähistamiseks sõõm!',
  },
  {
    stage: 'mid',
    type: 'drink',
    alcoholText: '{player} alustab: "Ma pole kunagi..." Kõik, kes on seda teinud, võtavad lonksu!',
    nonAlcoholText: '{player} alustab: "Ma pole kunagi..." Kõik, kes on seda teinud, võtavad sõõmu!',
  },
  {
    stage: 'mid',
    type: 'drink',
    alcoholText: '{player}, sosista mängijale {other} kõrva üks vürtsikas küsimus. {other} ütleb vastuse kõva häälega, ilma et avaldaks küsimust!',
    nonAlcoholText: '{player}, sosista mängijale {other} kõrva üks vürtsikas küsimus. {other} ütleb vastuse kõva häälega, ilma et avaldaks küsimust!',
  },
  {
    stage: 'mid',
    type: 'truth_dare',
    alcoholText: '{player}, näita kõigile viimast fotot oma telefoni galeriis või joo 3 lonksu!',
    nonAlcoholText: '{player}, näita kõigile viimast fotot oma telefoni galeriis või võta 3 suurt sõõmu!',
  },
  {
    stage: 'mid',
    type: 'truth_dare',
    alcoholText: '{player}, sosista oma paremal käel istuvale mängijale üks saladus, mida teised laua taga ei tea.',
    nonAlcoholText: '{player}, sosista oma paremal käel istuvale mängijale üks saladus, mida teised laua taga ei tea.',
  },
  {
    stage: 'mid',
    type: 'truth_dare',
    alcoholText: '{player}, kes siit seltskonnast oleks kõige ohtlikum peokaaslane välismaal ja miks? Nimeta ta ja võtke koos lonks!',
    nonAlcoholText: '{player}, kes siit seltskonnast oleks kõige ohtlikum peokaaslane välismaal ja miks? Nimeta ta ja võtke koos sõõm!',
  },
  {
    stage: 'mid',
    type: 'truth_dare',
    alcoholText: '{player} ja {other} peavad järgmise vooru lõpuni hoidma üksteisel käest kinni. Kui lahti lasete, joote mõlemad 2 lonksu!',
    nonAlcoholText: '{player} ja {other} peavad järgmise vooru lõpuni hoidma üksteisel käest kinni. Kui lahti lasete, võtate mõlemad 2 sõõmu!',
  },

  // ROUNDS 8–10: WILD CLIMAX (Late)
  {
    stage: 'late',
    type: 'drink',
    alcoholText: 'FINAALIKÜTE! {player} valib endale paarilise ({other} või keegi teine) ja mõlemad teevad korraga 3 kiiret lonksu!',
    nonAlcoholText: 'FINAALIKÜTE! {player} valib endale paarilise ({other} või keegi teine) ja mõlemad teevad korraga 3 kiiret sõõmu!',
  },
  {
    stage: 'late',
    type: 'drink',
    alcoholText: 'Kose-aeg! {player} alustab joomist ja teised järjest kaasa – keegi ei tohi lõpetada enne kui temast eelmine mängija!',
    nonAlcoholText: 'Kose-aeg! {player} alustab joomist ja teised järjest kaasa – keegi ei tohi lõpetada enne kui temast eelmine mängija!',
  },
  {
    stage: 'late',
    type: 'drink',
    alcoholText: '{player}, esita otsene väljakutse mängijale {other}: kes joob oma klaasist kiiremini 3 lonksu? Kaotaja maksab võitjale veel komplimendi!',
    nonAlcoholText: '{player}, esita otsene väljakutse mängijale {other}: kes joob oma klaasist kiiremini 3 sõõmu? Kaotaja teeb võitjale veel komplimendi!',
  },
  {
    stage: 'late',
    type: 'truth_dare',
    alcoholText: '{player}, tee mängijale {other} 15-sekundiline õlamassaaž ja räägi samal ajal nagu spordikommentaator!',
    nonAlcoholText: '{player}, tee mängijale {other} 15-sekundiline õlamassaaž ja räägi samal ajal nagu spordikommentaator!',
  },
  {
    stage: 'late',
    type: 'truth_dare',
    alcoholText: '{player}, anna oma telefon 20 sekundiks mängija {other} kätte – ta võib avada ühe vabalt valitud äpi!',
    nonAlcoholText: '{player}, anna oma telefon 20 sekundiks mängija {other} kätte – ta võib avada ühe vabalt valitud äpi!',
  },
  {
    stage: 'late',
    type: 'truth_dare',
    alcoholText: '{player}, nimeta siit seltskonnast inimene, kellega läheksid kohe praegu üksikule saarele, ja tehke koos võidukas nukk või kallistus!',
    nonAlcoholText: '{player}, nimeta siit seltskonnast inimene, kellega läheksid kohe praegu üksikule saarele, ja tehke koos võidukas nukk või kallistus!',
  },
  {
    stage: 'late',
    type: 'truth_dare',
    alcoholText: '{player}, tantsi 15 sekundit ilma muusikata, samal ajal kui {other} teeb sulle suuga rütmi (beatbox)!',
    nonAlcoholText: '{player}, tantsi 15 sekundit ilma muusikata, samal ajal kui {other} teeb sulle suuga rütmi (beatbox)!',
  },
];

export function getStageForRound(round: number): RoundStage {
  if (round <= 3) return 'early';
  if (round <= 7) return 'mid';
  return 'late';
}

export function drawPartyCard(
  type: 'drink' | 'truth_dare',
  round: number,
  currentPlayerName: string,
  allPlayerNames: string[],
  nonAlcoholic: boolean
): string {
  const stage = getStageForRound(round);
  const pool = PARTY_CARDS.filter((c) => c.stage === stage && c.type === type);
  const candidates = pool.length > 0 ? pool : PARTY_CARDS.filter((c) => c.type === type);
  const chosen = candidates[Math.floor(Math.random() * candidates.length)];

  const others = allPlayerNames.filter((n) => n !== currentPlayerName);
  const randomOther =
    others.length > 0
      ? others[Math.floor(Math.random() * others.length)]
      : currentPlayerName;

  const raw = nonAlcoholic ? chosen.nonAlcoholText : chosen.alcoholText;
  return raw
    .replaceAll('{player}', currentPlayerName)
    .replaceAll('{other}', randomOther);
}
