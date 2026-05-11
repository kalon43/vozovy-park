(function(){
// Simple browser bundle combining core classes and data from the project
class Vozidlo {
  constructor(id, znacka, spz, spotreba, kapacitaNadrze, servisLimitKm) {
    this._id = id;
    this._znacka = znacka;
    this._spz = spz;
    this._najetKm = 0;
    this._kapacitaNadrze = kapacitaNadrze;
    this._stavNadrze = kapacitaNadrze;
    this._servisLimitKm = servisLimitKm;
    this.spotreba = spotreba;
  }
  get id(){ return this._id }
  get znacka(){ return this._znacka }
  get spz(){ return this._spz }
  get najetKm(){ return this._najetKm }
  get stavNadrze(){ return this._stavNadrze }
  get kapacitaNadrze(){ return this._kapacitaNadrze }
  get servisLimitKm(){ return this._servisLimitKm }
  set najetKm(v){ if(v<0){console.error(`[${this._spz}] Nájezd nemůže být záporný!`); return} this._najetKm = v }
  set stavNadrze(v){ if(v<0){ this._stavNadrze = 0; console.warn(`[${this._spz}] Nádrž je prázdná!`)} else if(v>this._kapacitaNadrze){ this._stavNadrze = this._kapacitaNadrze; console.warn(`[${this._spz}] Nádrž je plná, přebytek ignorován.`)} else { this._stavNadrze = v } }
  tankovat(litry){ if(litry<=0){ console.error(`[${this._spz}] Množství paliva musí být kladné číslo.`); return } this.stavNadrze = this._stavNadrze + litry; console.log(`[${this._spz}] Natankováno. Stav nádrže: ${this._stavNadrze.toFixed(1)} / ${this._kapacitaNadrze} L`) }
  jeServisNutny(){ return this._najetKm >= this._servisLimitKm }
}

class OsobniVuz extends Vozidlo {
  constructor(id, znacka, spz, spotreba, kapacitaNadrze, servisLimitKm, pocetMist, klimatizace){
    super(id, znacka, spz, spotreba, kapacitaNadrze, servisLimitKm);
    this._pocetMist = 5;
    this.pocetMist = pocetMist;
    this.klimatizace = klimatizace;
  }
  get pocetMist(){ return this._pocetMist }
  set pocetMist(v){ if(v<1 || v>8){ console.error(`[${this.spz}] Počet míst musí být 1–8. Nastaveno výchozích 5.`); this._pocetMist = 5 } else { this._pocetMist = v } }
  vypocitejSpotreba(km){ const efektivniSpotreba = this.spotreba + (this.klimatizace ? 0.5 : 0); return (efektivniSpotreba * km) / 100 }
  getInfo(){ const servis = this.jeServisNutny() ? " ⚠️ SERVIS!" : ""; return `[OSOBNÍ] ${this.znacka} (${this.spz}) | Nájezd: ${this.najetKm} km | Nádrž: ${this.stavNadrze.toFixed(1)}/${this.kapacitaNadrze} L | Místa: ${this._pocetMist} | Klima: ${this.klimatizace ? "ano" : "ne"}` + servis }
  jet(km){ if(km<=0){ console.error(`[${this.spz}] Počet km musí být kladný.`); return } const potrebaPaliva = this.vypocitejSpotreba(km); if(potrebaPaliva > this.stavNadrze){ console.error(`[${this.spz}] Nedostatek paliva! Potřeba: ${potrebaPaliva.toFixed(2)} L, dostupné: ${this.stavNadrze.toFixed(1)} L`); return } this.stavNadrze = this.stavNadrze - potrebaPaliva; this.najetKm = this.najetKm + km; console.log(`[${this.spz}] Ujeto ${km} km, spotřebováno ${potrebaPaliva.toFixed(2)} L.`); if(this.jeServisNutny()){ console.warn(`[${this.spz}] ⚠️  Vozidlo překročilo servisní limit ${this.servisLimitKm} km!`) } }
}

class NakladniVuz extends Vozidlo {
  constructor(id, znacka, spz, spotreba, kapacitaNadrze, servisLimitKm, nosnostTun){
    super(id, znacka, spz, spotreba, kapacitaNadrze, servisLimitKm);
    this._nosnostTun = 1;
    this.nosnostTun = nosnostTun;
    this._aktualniNakladTun = 0;
  }
  get nosnostTun(){ return this._nosnostTun }
  get aktualniNakladTun(){ return this._aktualniNakladTun }
  set nosnostTun(v){ if(v<=0){ console.error(`[${this.spz}] Nosnost musí být kladná. Nastavena výchozí hodnota 1 t.`); this._nosnostTun = 1 } else { this._nosnostTun = v } }
  set aktualniNakladTun(v){ if(v<0){ console.error(`[${this.spz}] Náklad nemůže být záporný.`); this._aktualniNakladTun = 0 } else if(v>this._nosnostTun){ console.error(`[${this.spz}] Náklad ${v} t překračuje nosnost ${this._nosnostTun} t! Nastavena maximální hodnota.`); this._aktualniNakladTun = this._nosnostTun } else { this._aktualniNakladTun = v } }
  vypocitejSpotreba(km){ const efektivniSpotreba = this.spotreba + this._aktualniNakladTun * 1.5; return (efektivniSpotreba * km) / 100 }
  getInfo(){ const servis = this.jeServisNutny() ? " ⚠️ SERVIS!" : ""; return `[NÁKLADNÍ] ${this.znacka} (${this.spz}) | Nájezd: ${this.najetKm} km | Nádrž: ${this.stavNadrze.toFixed(1)}/${this.kapacitaNadrze} L | Náklad: ${this._aktualniNakladTun}/${this._nosnostTun} t` + servis }
  jet(km){ if(km<=0){ console.error(`[${this.spz}] Počet km musí být kladný.`); return } const potrebaPaliva = this.vypocitejSpotreba(km); if(potrebaPaliva > this.stavNadrze){ console.error(`[${this.spz}] Nedostatek paliva! Potřeba: ${potrebaPaliva.toFixed(2)} L, dostupné: ${this.stavNadrze.toFixed(1)} L`); return } this.stavNadrze = this.stavNadrze - potrebaPaliva; this.najetKm = this.najetKm + km; console.log(`[${this.spz}] Ujeto ${km} km (náklad ${this._aktualniNakladTun} t), spotřebováno ${potrebaPaliva.toFixed(2)} L.`); if(this.jeServisNutny()){ console.warn(`[${this.spz}] ⚠️  Vozidlo překročilo servisní limit ${this.servisLimitKm} km!`) } }
}

const katalog = [
  { id: "v001", typ: "osobni", znacka: "Škoda Octavia", spz: "1AB 2345", spotreba: 6.5, kapacitaNadrze: 55, servisLimitKm: 15000, pocetMist: 5, klimatizace: true },
  { id: "v002", typ: "osobni", znacka: "Volkswagen Golf", spz: "2CD 6789", spotreba: 5.8, kapacitaNadrze: 50, servisLimitKm: 20000, pocetMist: 5, klimatizace: false },
  { id: "v003", typ: "nakladni", znacka: "Mercedes Sprinter", spz: "3EF 1122", spotreba: 10.2, kapacitaNadrze: 100, servisLimitKm: 10000, nosnostTun: 3.5 },
  { id: "v004", typ: "nakladni", znacka: "MAN TGX", spz: "4GH 3344", spotreba: 28.0, kapacitaNadrze: 400, servisLimitKm: 50000, nosnostTun: 24 }
];

function vytvorVozidlo(data){
  if(data.typ === 'osobni'){
    return new OsobniVuz(data.id, data.znacka, data.spz, data.spotreba, data.kapacitaNadrze, data.servisLimitKm, data.pocetMist, data.klimatizace);
  } else if(data.typ === 'nakladni'){
    return new NakladniVuz(data.id, data.znacka, data.spz, data.spotreba, data.kapacitaNadrze, data.servisLimitKm, data.nosnostTun);
  } else {
    console.error(`Neznámý typ vozidla: ${data.typ}`);
    return null;
  }
}

const fleet = katalog.map(v => vytvorVozidlo(v)).filter(Boolean);

console.log('═══════════════════════════════════════════════════');
console.log('        EVIDENCE VOZOVÉHO PARKU – výpis stavu      ');
console.log('═══════════════════════════════════════════════════');
console.log('\n📋 Aktuální stav vozového parku:');
fleet.forEach((v,i)=>{ console.log(`  ${i+1}. ${v.getInfo()}`) });

// krátká simulace (stejně jako v TS)
const octavia = fleet.find(f => f.znacka && f.znacka.includes('Octavia'));
if(octavia){ console.log(`\nOctavia – jede 200 km (klima: ${octavia.klimatizace}):`); octavia.jet(200); console.log(`  Spotřeba na 200 km: ${octavia.vypocitejSpotreba(200).toFixed(2)} L`) }

console.log('\n═══════════════════════════════════════════════════');
console.log('        Test bundle loaded in browser (open console)');
console.log('═══════════════════════════════════════════════════');

})();
