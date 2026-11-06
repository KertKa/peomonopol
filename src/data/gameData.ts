import type { Tile, RoundStage } from '../types';

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
  { id: 0, name: 'START', type: 'start', owner: null, color: '#ef4444' },
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
  { id: 10, name: 'Kõik joovad!', type: 'all_drink', owner: null, color: '#f97316' },
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
  { id: 20, name: 'Kõik joovad!', type: 'all_drink', owner: null, color: '#f97316' },
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
  { id: 30, name: 'Kõik joovad!', type: 'all_drink', owner: null, color: '#f97316' },
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

export const RAW_CARDS = {
  early: {
    drink: [
      "Kes kõige tõenäolisemalt jääb täna esimesena magama? Kolmeni ja näidake! Enim häält saanu võtab 2 lonksu.",
      "Kes kõige tõenäolisemalt saadab täna kellelegi siit ruumist flirtivat sõnumit? Näidake! Võitja võtab 2 lonksu.",
      "Kes kõige tõenäolisemalt suudleks täna kedagi siin? Näidake! Enim häält – 2 lonksu.",
      "Kõik, kes on kunagi kellelegi siin ruumis crushinud, võtavad lonksu.",
      "Ma pole kunagi… kellegagi siin ruumis flirtinud. Kellel on, võtab lonksu.",
      "{p} peab 10 sekundit vaatama silma vastas istujale. Kes esimesena naerab või pilgutab, võtab 2 lonksu.",
      "{p} valib ühe inimese ja peab teda 15 sekundit komplimentidega üle külvama. Kui ei suuda, võtab 2 lonksu.",
      "Kõik, kes on täna juba kellelegi silma teinud, võtavad lonksu.",
      "{p} ja tema parem naaber peavad üksteise käsi 10 sekundit hoidma. Kes esimesena lahti laseb, võtab lonksu.",
      "Toost! {p} peab tegema toosti kõige atraktiivsema inimese auks lauas. Kõik joovad.",
      "Kõik, kes on kunagi salaja kellelegi siin ruumis pilte teinud, võtavad lonksu.",
      "{p} peab valima, kes lauas näeb kõige paremini välja, ja ütlema selle valjult. See inimene annab talle 1 lonksu.",
      "Silmavaatamise ring: kõik vaatavad korraga vastas istujat 15 sekundit. Kes esimesena naerab, võtab 2 lonksu.",
      "{p} peab 20 sekundit rääkima ainult sosinal. Kes teda katkestab, võtab lonksu.",
      "Kõik, kes on kunagi unistanud kellegagi siin ruumis suudlemisest, võtavad lonksu (ausus!).",
      "{p} peab andma oma vasakule naabrile 10-sekundilise õlamassaaži. Kui keeldub, võtab 2 lonksu.",
      "„Ma pole kunagi…“ – {p} alustab millegi natuke piinlikuga. Kellel on kogemus, joob.",
      "Kõik vahetavad 10 sekundiks kohta päripäeva. Viimane, kes istub, võtab 2 lonksu.",
      "{p} peab valima kaks inimest, kes peavad 15 sekundit üksteisele silma vaatama. Kes esimesena naerab, joob.",
      "Lühike toost kõige seksikama inimese auks lauas. Kõik joovad.",
    ],
    truth: [
      "{p}, mis on kõige piinlikum laul su playlistis?",
      "{p}, kellele siin seltskonnas helistaksid, kui oleksid hädas kell 3 öösel?",
      "{p}, mis on halvim kingitus, mille oled saanud?",
      "{p}, mis on su salajane anne, millest keegi ei tea?",
      "{p}, mis on viimane asi, mille googeldasid?",
      "{p}, mis on su kõige veidram harjumus, kui oled täiesti üksi kodus?",
      "{p}, mida {o} kohta esimesel kohtumisel arvasid?",
      "{p}, mis on su kõige kummalisem harjumus?",
      "{p}, mis on su kõige veidram toidukombinatsioon, mida päriselt naudid?",
      "{p}, mis oli su lapsepõlve kõige piinlikum hetk?",
      "{p}, mis on kõige lapsikum asi, mida sa siiani teed?",
      "{p}, mis on kõige piinlikum asi, mille oled peol või poes emotsiooni pealt ostnud?",
      "{p}, kelle seltskonnast valiksid, kui peaksite kahekesi reality-saatesse minema?",
      "{p}, mis on halvim vale, mille oled välja mõelnud, et plaanidest või koolist/töölt ära viilida?",
      "{p}, kelle siin seltskonnas võtaksid kaasa üksikule saarele?",
      "{p}, mis on kõige suurem vale, mida oled õpetajale öelnud?",
      "{p}, mis on su elu kõige piinlikum flirdi- või kohtingukatse?",
      "{p}, mis on kõige hullem soeng, mis sul kunagi olnud on?",
      "{p}, mis on su kõige suurem hirm, mis on tegelikult naljakas?",
      "{p}, kui peaksid ühe inimese siit ruumist oma pulma tunnistajaks valima, kes see oleks?",
    ],
    dare: [
      "{p}, tee oma parim loomahääl. Teised arvavad looma.",
      "{p}, räägi järgmise käiguni ainult robotihäälega.",
      "{p}, tee 10 kükki ja loe samal ajal tähestikku.",
      "{p}, kõnni ringiga ümber laua nagu modell catwalk'il.",
      "{p}, pea 20-sekundiline motivatsioonikõne {o}-le.",
      "{p}, laula refrään laulust, mille {o} valib.",
      "{p}, tantsi 15 sekundit ilma muusikata.",
      "{p}, räägi järgmise käiguni ainult küsimustega.",
      "{p}, jäljenda mõnda kuulsust – teised peavad ära arvama, kes see on.",
      "{p}, tee kõigiga koos grupiselfi kõige naljakama näoga.",
      "{p}, loe järgmise käiguni ette {o} iga lause lõpp nagu uudisteankur.",
      "{p}, räägi 30 sekundit ühest suvalisest esemest laual nagu reklaamija.",
      "{p}, ütle tähestik tagurpidi nii kaugele kui suudad.",
      "{p}, tee oma parim tantsuliigutus ja õpeta see {o}-le.",
      "{p}, räägi järgmise käiguni mingi aktsendiga, mille {o} valib.",
      "{p}, tee oma parim ja dramaatilisem aegluubis kukkumine või filmitrikk.",
      "{p}, tee {o}-le 20 sekundit pantomiimi – teised peavad tegevuse ära arvama!",
      "{p}, kirjelda {o}-d kolme sõnaga – ilma naermata.",
      "{p}, räägi järgmise käiguni nii, nagu oleksid Michelini restorani peakokk ja teised kriitikud.",
      "{p}, tee kõige dramaatilisem ohe ja monoloog teemal 'Miks klaas on tühi'.",
    ],
  },
  mid: {
    drink: [
      "{p} ja tema parem naaber vahetavad 30 sekundiks kohta ja istuvad üksteise süljes (kui mõlemad nõus). Mõlemad joovad 2 lonksu.",
      "Silmavaatamise duell 30 sekundit. Esimene, kes naerab või pilgutab, võtab 3 lonksu.",
      "{p} peab sosistama oma paremale naabrile ühe salajase soovi või mõtte. Kui naaber keeldub seda valjult kordamast, joob naaber 2 lonksu.",
      "Kõik puudutavad korraga oma vasaku naabri põlve. Viimane, kes reageerib, võtab 2 lonksu.",
      "{p} valib ühe inimese – te peate 20 sekundit käsi ristis jooma (nagu pulmas).",
      "„Ma pole kunagi…“ peol kedagi suudelnud / kellegagi maganud / kellegagi siin flirtinud. Kes on, joob.",
      "{p} peab valima kaks inimest, kes peavad 15 sekundit üksteise pead toetama. Kes esimesena liigub, joob.",
      "Uus reegel kuni etapi lõpuni: keegi ei tohi öelda „ei“. Kes ütleb, võtab lonksu.",
      "{p} peab tegema 20-sekundilise aeglase tantsu oma vastas istuja ees. Kui keeldub, 3 lonksu.",
      "Kõik, kes on kunagi saatnud kellelegi siin ruumis hilisõhtuse sõnumi, võtavad 2 lonksu.",
      "{p} ja tema vasak naaber peavad 15 sekundit otsaesised kokku panema. Kes esimesena eemaldub, joob.",
      "Tõde või lonks: {p} küsib kaaslaselt midagi natuke isiklikku/flirtivat. Kui ei vasta, 3 lonksu.",
      "{p} valib ühe inimese ja peab teda 30 sekundit ainult komplimentidega rääkima. Kui jääb hätta, 2 lonksu.",
      "Kõik seisavad ühel jalal. Esimene, kes kukub või käega toetub, võtab 2 lonksu.",
      "{p} peab valima, kelle huuled lauas talle kõige rohkem meeldivad, ja ütlema selle valjult. See inimene annab talle lonksu.",
      "Käed-ristis joomine ringiga: igaüks joob ühe lonksu käed ristis oma naabriga.",
      "{p} peab 20 sekundit oma parema naabri kaela või õlga masseerima. Kui keeldub, 3 lonksu.",
      "„Ma pole kunagi…“ unistanud kellegagi siin magamisest / suudlemisest. Kes on, joob 2 lonksu.",
      "{p} valib kaks inimest, kes peavad 10 sekundit üksteisele sülle istuma (kui nõus). Mõlemad joovad.",
      "Viimane, kes paneb käe naabri õlale, võtab 2 lonksu.",
    ],
    truth: [
      "{p}, kes siin seltskonnas on sinu arvates kõige parem suudleja?",
      "{p}, mis on suurim vale, mida oled oma vanematele öelnud?",
      "{p}, kelle sõnumile siin ruumis vastad kõige aeglasemalt ja miks?",
      "{p}, mis on kõige piinlikum asi, mis sul peol juhtunud on?",
      "{p}, kes oli su viimane crush?",
      "{p}, mida sa {o} juures salaja kadestad?",
      "{p}, kellega siin ruumis kõige tõenäolisemalt tülli läheksid?",
      "{p}, mis on kõige piinlikum sõnum, mille oled kogemata valele inimesele saatnud?",
      "{p}, kes siit seltskonnast sobiks sinu arvates omavahel kõige paremini paariks ja miks?",
      "{p}, mis on su kõige halvem kohtingukogemus?",
      "{p}, kui peaksid kellegagi siin ruumis kehad vahetama, kellega ja miks?",
      "{p}, mis on kõige julgem asi, mida oled crushi heaks teinud?",
      "{p}, mis on kõige piinlikum asi, mille pärast oled kellegi sotsiaalmeedias läbi uurinud ehk stalkinud?",
      "{p}, keda siin ruumis stalkisid sotsiaalmeedias enne, kui temaga päriselt tuttavaks said?",
      "{p}, mis on su kõige suurem punane lipp teistes inimestes?",
      "{p}, kui peaksid ühe inimesega siit ruumist öösel tühja bensiinijaama lõksu jääma, kelle valiksid ja miks?",
      "{p}, kes siin ruumis on kõige tõenäolisemalt sinust salaja sisse võetud?",
      "{p}, mida sa telefonis kõige rohkem kardad, et keegi näeks?",
      "{p}, mis on su kõige piinlikum hüüdnimi?",
      "{p}, millist {o} harjumust sa salaja ei talu?",
    ],
    dare: [
      "{p}, vaheta kohta {o}-ga ja jäljenda teda järgmise käiguni.",
      "{p}, lase {o}-l oma telefonist üks emoji kellelegi saata.",
      "{p}, sosista {o}-le kõrva midagi naljakat, nii et ta naerma hakkaks. Ebaõnnestumine = 2 lonksu.",
      "{p}, tee {o}-le 30-sekundiline komplimentide vihm.",
      "{p}, näita kõigile oma viimast fotot galeriis.",
      "{p}, istu järgmise käiguni {o} kõrval ja kõneta teda ainult 'kallis'.",
      "{p}, loe ette oma viimane saadetud sõnum.",
      "{p}, vaata {o}-le 20 sekundit silma ja räägi talle kõige mesimagusamat komplimenti.",
      "{p}, tee 10 kätekõverdust. Iga puudu jäänud kätekõverdus = lonks.",
      "{p}, lase {o}-l oma juukseid 1 minuti jooksul kuidas tahes sättida.",
      "{p}, tee {o}-ga koos 15 sekundit peeglimängu – {o} liigub, sina kordad.",
      "{p}, lase {o}-l joonistada sulle markeriga käe peale tätoveering.",
      "{p}, kanna {o} kingi järgmise käiguni.",
      "{p}, laula {o}-le romantiline serenaad 15 sekundit.",
      "{p}, tee {o}-ga kiire tantsuvõistlus – seltskond hääletab võitja!",
      "{p}, lase {o}-l valida sulle telefonist üks laul ja tantsi selle järgi 20 sekundit täiega.",
      "{p}, kallista kõiki, kes on nõus – kes kallistada ei taha, saab high five'i.",
      "{p}, mängi järgmise käiguni {o} butlerit – too talle, mida ta palub.",
      "{p}, tee 20 sekundit oma parimat TikToki tantsu.",
      "{p}, tee {o}-le 15-sekundiline dramaatiline filmistseen või leppimisstseen.",
    ],
  },
  late: {
    drink: [
      "{p} valib ühe inimese – te peate 30 sekundit silmast silma vaatama ja naeratama. Kes esimesena naerab, 3 lonksu.",
      "Tõde või lonks (raske versioon): {p} küsib midagi väga isiklikku või flirtivat. Kui ei vasta ausalt, 3 lonksu.",
      "{p} peab valima kaks inimest, kes peavad 20 sekundit üksteist kallistama. Kes esimesena lahti laseb, joob.",
      "Kõik peavad korraga tegema 15-sekundilise aeglase tantsuliigutuse. Viimane, kes lõpetab, 3 lonksu.",
      "{p} valib ühe inimese ja peab talle 30 sekundit sosistades ütlema, mida ta temast arvab (ausalt). Kui keeldub, 3 lonksu.",
      "Käed-ristis + silmside: {p} ja valitud inimene joovad 2 lonksu käed ristis ja silma vaadates.",
      "„Ma pole kunagi…“ teinud midagi, mida oma vanematele kunagi ei räägiks. Kes on, 2 lonksu.",
      "{p} paneb kõigile uue reegli (nt „ei tohi naerda“, „peab rääkima ainult sosinal“ jne) kuni mängu lõpuni. Rikkuja 2 lonksu.",
      "Kõik, kes on täna juba kellelegi siin komplimendi teinud, võtavad 2 lonksu. Kes pole, peab kohe tegema.",
      "{p} valib ühe inimese – te peate 20 sekundit otsaesised + nina kokku panema. Kes esimesena eemaldub, 3 lonksu.",
      "Salapärane sosin: {p} sosistab kaaslasele ühe sõna või soovi, mida kaaslane peab kehakeelega teistele seletama. Kui ei arvata ära, mõlemad joovad.",
      "{p} peab valima, keda ta tahaks kõige rohkem suudelda, ja ütlema selle valjult (või jooma 3 lonksu).",
      "Kõik vahetavad kohta vastavalt {p} juhistele. Kes vaidleb vastu, 3 lonksu.",
      "{p} ja valitud inimene peavad 30 sekundit üksteise käsi hoidma ja silma vaatama. Kes esimesena liigub, joob.",
      "Tõde või lonks: „Kes on sinu arvates kõige seksikam inimene selles ruumis?“ Kui ei vasta, 3 lonksu.",
      "{p} peab tegema 20-sekundilise „aeglase tantsu“ valitud inimese ees. Kui keeldub, 3 lonksu.",
      "Kõik, kes on kunagi unistanud kellegagi siin ruumis midagi enamat kui sõprus, võtavad 2 lonksu.",
      "{p} valib kaks inimest, kes peavad 15 sekundit üksteise kaelasid masseerima. Kes keeldub, 3 lonksu.",
      "Viimane voor – „kõige julgem tegu“: {p} annab ühele inimesele julge (aga nõusolekul põhineva) ülesande. Kui teeb, saab +1 💰, kui ei, joob 3 lonksu.",
      "Lõputoost: {p} peab tegema toosti „kõige ohtlikumale / kõige seksikamale / kõige huvitavamale“ inimesele lauas. Kõik joovad 2 lonksu.",
    ],
    truth: [
      "{p}, kes siin ruumis on sinu arvates kõige kuumem? Ütle välja!",
      "{p}, mis on kõige pöörasem otsus, mille oled teinud vähem kui 5 minutiga?",
      "{p}, kui peaksid praegu ühe inimesega siit ruumist musi tegema, kelle valiksid?",
      "{p}, mida sa {o} kohta tegelikult arvad? Aus vastus!",
      "{p}, mis on su suurim saladus, mille julged täna välja öelda?",
      "{p}, mis on kõige skandaalsem asi, mida oled teinud ja millest keegi siin ei tea?",
      "{p}, kas sulle on kunagi salaja meeldinud keegi siin ruumis?",
      "{p}, kes siit ruumist teeb sinu arvates purjus peaga kõige rohkem lollusi?",
      "{p}, kellega siin ruumis läheksid kohtingule, kui peaksid valima?",
      "{p}, mis on kõige suurem asi, mille oled kunagi sõbra eest varjanud?",
      "{p}, kas oled kunagi kellegi sõnumeid tema teadmata lugenud?",
      "{p}, kas oled kunagi saatnud või saanud spicy pildi, mida kahetsed?",
      "{p}, kes siin seltskonnas on sinu salajane lemmik ja miks?",
      "{p}, mis on kõige piinlikum asi su otsinguajaloos?",
      "{p}, kes siin ruumis on sinu arvates kõige suurem flirtija?",
      "{p}, mis on kõige piinlikum asi, mille pealt keegi teine on sind tabanud?",
      "{p}, mida sa kunagi ei ütleks oma vanematele, aga ütled meile praegu?",
      "{p}, kellega siin ruumis oleks sul kõige raskem elada ühes toas?",
      "{p}, kas oled kunagi kedagi sotsiaalmeedias ghostinud ja miks?",
      "{p}, mis on kõige julgem sõnum, mille oled kunagi saatnud?",
    ],
    dare: [
      "{p}, tee {o}-ga koos aegluubis filmilik draamastseen (ilma päris puudutuseta)!",
      "{p}, hoia {o} käest kinni kuni oma järgmise käiguni.",
      "{p}, tee {o}-ga koos 20 sekundit tantsu keset tuba.",
      "{p}, helista kellelegi ja laula talle 'Palju õnne sünnipäevaks'.",
      "{p}, vaheta {o}-ga üks riideese kuni mängu lõpuni.",
      "{p}, tee 30-sekundiline stand-up kõigi teiste mängijate kohta.",
      "{p}, joo lonks ilma käteta (keegi teine hoiab klaasi).",
      "{p}, lase grupil sinu telefonist kellelegi üks sõnum kirjutada (sina võid enne saatmist ühe sõna muuta).",
      "{p}, tee {o}-le 1 minuti jooksul õlamassaaži (kui {o} on nõus).",
      "{p}, kanna {o} seljas või süles ümber laua (või tee 15 kükki).",
      "{p}, laula järgmise käiguni kõike, mida räägid.",
      "{p}, lase {o}-l saata su Instagrami või Snapchati storysse üks suvaline emoji või naljakas lause.",
      "{p}, tee dramaatiline armastusavaldus esimesele esemele, mille {o} näitab.",
      "{p}, tee 30 sekundit oma parimat räppi või toosti selle peo ja kõigi kohalolijate kohta!",
      "{p}, lase {o}-l lugeda ette sinu viimased 3 otsingut.",
      "{p}, imiteeri 30 sekundit {o}-d – teised hindavad 1–10. Alla 5 = 2 lonksu.",
      "{p}, helista oma kontaktide viimasele inimesele ja ütle, et armastad teda.",
      "{p}, istu {o} sülle järgmise käiguni (kui {o} on nõus) – kui ei, teed 15 kükki.",
      "{p}, lase kõigil sulle ükshaaval üks küsimus esitada – pead vastama ausalt.",
      "{p}, vaheta {o}-ga sokid või jalanõud kuni oma järgmise käiguni!",
    ],
  },
};

export const HOST_LINES: Record<string, string[]> = {
  start: ["Pidu algab! Täringud valmis, klaasid täis!"],
  buy: ["Kinnisvaramagnaat sünnib meie silme all!", "Uus omanik linnas – hoidke oma maksad!"],
  chug: ["Purk põhja! See on õppetund kõigile.", "Üürimaks makstud vedelal kujul!"],
  six: ["Täring halastamatu nagu alati!", "Lonks, sest statistika nõuab seda."],
  pass: ["Ei julge? Rahakott nutab ja klaas tühjeneb.", "Strateegiline taganemine – aga lonksust ei pääse!"],
  shop: ["Ostlemine keset pidu – stiilne.", "Relvad on jagatud. Sõda algab."],
  steal: ["Vaenulik ülevõtmine! Wall Street nutaks rõõmust.", "Maa vahetas omanikku – sõprus pandi proovile."],
  stage: ["Nüüd läheb asi vürtsikaks!", "Viimased ringid – nüüd läheb hulluks!"],
  end: ["Pidu läbi! Võitja on rikas, kaotajad janused."],
};

export interface FlatCard {
  id: string; // e.g. "early-drink-0"
  stage: RoundStage;
  category: 'drink' | 'truth' | 'dare';
  tileType: 'drink' | 'truth_dare';
  text: string;
}

// Convert RAW_CARDS to a flat array of cards with unique IDs
export const ALL_PARTY_CARDS: FlatCard[] = [];

(['early', 'mid', 'late'] as const).forEach((stage) => {
  (['drink', 'truth', 'dare'] as const).forEach((category) => {
    const list = RAW_CARDS[stage][category];
    list.forEach((text, idx) => {
      ALL_PARTY_CARDS.push({
        id: `${stage}-${category}-${idx}`,
        stage,
        category,
        tileType: category === 'drink' ? 'drink' : 'truth_dare',
        text,
      });
    });
  });
});

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

function toNonAlcoholic(text: string): string {
  return text
    .replace(/lonkse/gi, 'sõõme')
    .replace(/lonksu/gi, 'sõõmu')
    .replace(/lonksud/gi, 'sõõmud')
    .replace(/lonks/gi, 'sõõm')
    .replace(/joomasõbrad/gi, 'tiimikaaslased')
    .replace(/joomasõber/gi, 'tiimikaaslane')
    .replace(/purgi tühjaks/gi, 'klaasi tühjaks')
    .replace(/purk põhja/gi, 'klaas tühjaks')
    .replace(/purk/gi, 'klaas');
}

export interface DrawCardResult {
  text: string;
  category: 'drink' | 'truth' | 'dare';
  cardId: string;
  newUsedIds: string[];
}

export function drawPartyCard(
  tileType: 'drink' | 'truth_dare',
  round: number,
  currentPlayerName: string,
  allPlayerNames: string[],
  nonAlcoholic: boolean,
  usedIds: string[],
  maxRounds: number = DEFAULT_ROUNDS
): DrawCardResult {
  const stage = getStageForRound(round, maxRounds);

  // Filter pool matching current stage & tileType
  const matchingCards = ALL_PARTY_CARDS.filter(
    (c) => c.stage === stage && c.tileType === tileType
  );

  // Available cards that haven't been drawn yet in this pool
  let available = matchingCards.filter((c) => !usedIds.includes(c.id));
  let updatedUsedIds = [...usedIds];

  // If all cards in this category/stage have been used, reset them so cycle begins anew
  if (available.length === 0) {
    const matchingIds = new Set(matchingCards.map((c) => c.id));
    updatedUsedIds = updatedUsedIds.filter((id) => !matchingIds.has(id));
    available = matchingCards;
  }

  const chosen = available[Math.floor(Math.random() * available.length)];
  updatedUsedIds.push(chosen.id);

  const others = allPlayerNames.filter((n) => n !== currentPlayerName);
  const randomOther =
    others.length > 0
      ? others[Math.floor(Math.random() * others.length)]
      : currentPlayerName;

  let raw = chosen.text;
  if (nonAlcoholic) {
    raw = toNonAlcoholic(raw);
  }

  const formattedText = raw
    .replaceAll('{p}', currentPlayerName)
    .replaceAll('{player}', currentPlayerName)
    .replaceAll('{o}', randomOther)
    .replaceAll('{other}', randomOther);

  return {
    text: formattedText,
    category: chosen.category,
    cardId: chosen.id,
    newUsedIds: updatedUsedIds,
  };
}

export function getRandomHostLine(category: keyof typeof HOST_LINES): string {
  const lines = HOST_LINES[category];
  if (!lines || lines.length === 0) return '';
  return lines[Math.floor(Math.random() * lines.length)];
}
