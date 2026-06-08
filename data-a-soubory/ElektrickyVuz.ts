/**
 * ElektrickeAuto.ts – Konkrétní třída pro elektrický automobil
 *
 * Dědí od abstraktní třídy Vozidlo. Pro elektrický pohon používáme:
 * - spotřeba = kWh / 100 km
 * - kapacitaNadrze = kapacita baterie v kWh
 */

import { Vozidlo } from "./Vozidlo";

export class ElektrickeAuto extends Vozidlo {
  /** Rekuperace při jízdě – snižuje efektivní spotřebu o 10 % */
  public rekuperace: boolean;

  constructor(
    id: string,
    znacka: string,
    spz: string,
    spotreba: number,
    kapacitaBaterieKWh: number,
    servisLimitKm: number,
    rekuperace: boolean
  ) {
    super(id, znacka, spz, spotreba, kapacitaBaterieKWh, servisLimitKm);
    this.rekuperace = rekuperace;
  }

  /**
   * Výpočet spotřeby elektrického vozu.
   * Vzorec: (základní spotřeba × faktor rekuperace) × km / 100
   * Rekuperace snižuje spotřebu o 10 %.
   */
  public vypocitejSpotreba(km: number): number {
    const faktorRekuperace = this.rekuperace ? 0.9 : 1;
    return (this.spotreba * faktorRekuperace * km) / 100;
  }

  /**
   * Nabíjení baterie (override tankování).
   */
  public override tankovat(kWh: number): void {
    if (kWh <= 0) {
      console.error(`[${this.spz}] Množství energie musí být kladné číslo.`);
      return;
    }
    this.stavNadrze = this.stavNadrze + kWh;
    console.log(`[${this.spz}] Nabito. Stav baterie: ${this.stavNadrze.toFixed(1)} / ${this.kapacitaNadrze} kWh`);
  }

  /**
   * Simulace jízdy – odečte energii z baterie, přičte km.
   */
  public jet(km: number): void {
    if (km <= 0) {
      console.error(`[${this.spz}] Počet km musí být kladný.`);
      return;
    }
    const potrebaEnergie = this.vypocitejSpotreba(km);
    if (potrebaEnergie > this.stavNadrze) {
      console.error(`[${this.spz}] Nedostatek energie! Potřeba: ${potrebaEnergie.toFixed(2)} kWh, dostupné: ${this.stavNadrze.toFixed(1)} kWh`);
      return;
    }
    this.stavNadrze = this.stavNadrze - potrebaEnergie;
    this.najetKm = this.najetKm + km;
    console.log(`[${this.spz}] Ujeto ${km} km, spotřebováno ${potrebaEnergie.toFixed(2)} kWh.`);
    if (this.jeServisNutny()) {
      console.warn(`[${this.spz}] ⚠️  Vozidlo překročilo servisní limit ${this.servisLimitKm} km!`);
    }
  }

  /**
   * Textový popis vozidla.
   */
  public getInfo(): string {
    const servis = this.jeServisNutny() ? " ⚠️ SERVIS!" : "";
    return (
      `[ELEKTRICKÉ] ${this.znacka} (${this.spz}) | ` +
      `Nájezd: ${this.najetKm} km | ` +
      `Baterie: ${this.stavNadrze.toFixed(1)}/${this.kapacitaNadrze} kWh | ` +
      `Rekuperace: ${this.rekuperace ? "ano" : "ne"}` +
      servis
    );
  }
}