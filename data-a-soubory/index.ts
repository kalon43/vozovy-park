/**
 * index.ts – Hlavní soubor aplikace (Fáze 2: testování v konzoli)
 *
 * Tento soubor:
 *  1. Načte surová data z číselníku (katalog v data.ts)
 *  2. Z každého záznamu vytvoří živou instanci příslušné třídy
 *  3. Uloží všechny instance do jednoho pole (polymorfismus)
 *  4. Projde pole a otestuje metody – výsledky vypíše do konzole
 */

import { katalog, VozidloData } from "./data";
import { Vozidlo } from "./Vozidlo";
import { OsobniVuz } from "./OsobniVuz";
import { NakladniVuz } from "./NakladniVuz";

// ─── 1. Vytvoření instancí z datového číselníku ───────────────────────────

/**
 * Tovární funkce – přijme surový objekt z číselníku a vrátí
 * správnou instanci třídy podle hodnoty atributu "typ".
 * Toto je klíčový moment aplikace: "oživení" dat.
 */
function vytvorVozidlo(data: VozidloData): Vozidlo {
  if (data.typ === "osobni") {
    return new OsobniVuz(
      data.id,
      data.znacka,
      data.spz,
      data.spotreba,
      data.kapacitaNadrze,
      data.servisLimitKm,
      data.pocetMist,
      data.klimatizace
    );
  } else {
    return new NakladniVuz(
      data.id,
      data.znacka,
      data.spz,
      data.spotreba,
      data.kapacitaNadrze,
      data.servisLimitKm,
      data.nosnostTun
    );
  }
}

/**
 * Pole fleet: Vozidlo[] – obsahuje mix instancí OsobniVuz i NakladniVuz.
 * Díky polymorfismu s nimi pracujeme jednotně přes rozhraní Vozidlo.
 */
const fleet: Vozidlo[] = katalog.map(vytvorVozidlo);

// ─── 2. Výpis celého parku (polymorfismus – getInfo) ─────────────────────

console.log("═══════════════════════════════════════════════════");
console.log("        EVIDENCE VOZOVÉHO PARKU – výpis stavu      ");
console.log("═══════════════════════════════════════════════════");
console.log("\n📋 Aktuální stav vozového parku:");

// Každé vozidlo zavolá svůj vlastní getInfo() – polymorfismus v praxi
fleet.forEach((v, i) => {
  console.log(`  ${i + 1}. ${v.getInfo()}`);
});

// ─── 3. Simulace provozu ──────────────────────────────────────────────────

console.log("\n🚗 Simulace provozu:");
console.log("───────────────────────────────────────────────────");

// Octavia jede 200 km (s klimatizací)
const octavia = fleet[0] as OsobniVuz;
console.log(`\nOctavia – jede 200 km (klima: ${octavia.klimatizace}):`);
octavia.jet(200);
console.log(`  Spotřeba na 200 km: ${octavia.vypocitejSpotreba(200).toFixed(2)} L`);

// Golf jede 150 km (bez klimatizace)
const golf = fleet[1] as OsobniVuz;
console.log(`\nGolf – jede 150 km (klima: ${golf.klimatizace}):`);
golf.jet(150);
console.log(`  Spotřeba na 150 km: ${golf.vypocitejSpotreba(150).toFixed(2)} L`);

// Sprinter naložen 2 tunami, jede 100 km
const sprinter = fleet[2] as NakladniVuz;
console.log(`\nSprinter – naložen 2 t, jede 100 km:`);
sprinter.aktualniNakladTun = 2;
sprinter.jet(100);
console.log(`  Spotřeba (2 t náklad, 100 km): ${sprinter.vypocitejSpotreba(100).toFixed(2)} L`);

// MAN plně naložen (20 t), jede 300 km
const man = fleet[3] as NakladniVuz;
console.log(`\nMAN TGX – plně naložen 20 t, jede 300 km:`);
man.aktualniNakladTun = 20;
man.jet(300);
console.log(`  Spotřeba (20 t náklad, 300 km): ${man.vypocitejSpotreba(300).toFixed(2)} L`);

// ─── 4. Tankování ─────────────────────────────────────────────────────────

console.log("\n⛽ Tankování:");
console.log("───────────────────────────────────────────────────");
octavia.tankovat(30);
sprinter.tankovat(60);
sprinter.tankovat(200); // pokus o přetečení – setter to ohlídá

// ─── 5. Test validace setterů ────────────────────────────────────────────

console.log("\n🛡️  Test validace (záměrně chybné hodnoty):");
console.log("───────────────────────────────────────────────────");
const testOsobni = new OsobniVuz("t1", "Test Auto", "9ZZ 0000", 7, 50, 5000, 15, false);
testOsobni.pocetMist = -3;        // neplatný počet míst – setter opraví na výchozích 5

const testNakladni = new NakladniVuz("t2", "Test Truck", "9ZZ 0001", 12, 100, 5000, 5);
testNakladni.aktualniNakladTun = 99; // přesahuje nosnost 5 t
testNakladni.jet(-50);               // záporné km

// ─── 6. Servisní kontrola (polymorfismus) ────────────────────────────────

console.log("\n🔧 Servisní kontrola – projíždí celý fleet:");
console.log("───────────────────────────────────────────────────");

// Simulujeme vysoký nájezd u Golfu – překračujeme servisní limit
golf.najetKm = 20500;

// Projdeme celý fleet jednotně – každý objekt zavolá jeServisNutny() a getInfo()
fleet.forEach(v => {
  const stav = v.jeServisNutny() ? "⚠️  VYŽADUJE SERVIS" : "✅ V pořádku";
  console.log(`  ${v.znacka} (${v.spz}): ${stav} | Nájezd: ${v.najetKm} / ${v.servisLimitKm} km`);
});

// ─── 7. Závěrečný výpis stavu parku ──────────────────────────────────────

console.log("\n📋 Stav parku po simulaci:");
fleet.forEach((v, i) => {
  console.log(`  ${i + 1}. ${v.getInfo()}`);
});

console.log("\n═══════════════════════════════════════════════════");
console.log("        Testování dokončeno – vše funguje ✅        ");
console.log("═══════════════════════════════════════════════════");
