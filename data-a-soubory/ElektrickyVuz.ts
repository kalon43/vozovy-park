import { Vozidlo } from "./Vozidlo";

export class ElektrickyVuz extends Vozidlo {
  private _pocetMist: number = 5;

  constructor(
    id: string,
    znacka: string,
    spz: string,
    spotreba: number,       // v kWh/100km
    kapacitaBaterie: number, // v kWh (předá se do kapacitaNadrze)
    servisLimitKm: number,
    pocetMist: number,
    nosnostTun: number
  ) {
    super(id, znacka, spz, spotreba, kapacitaBaterie, servisLimitKm);
    this.pocetMist = pocetMist;
  }

  get pocetMist(): number { return this._pocetMist; }
  set pocetMist(v: number) {
    if (v < 1 || v > 9) {
      console.error(`[${this.spz}] Počet míst musí být 1–9. Nastaveno 5.`);
      this._pocetMist = 5;
    } else {
      this._pocetMist = v;
    }
  }

  /**
   * Výpočet spotřeby elektrického vozu (kWh místo litrů)
   */
  public vypocitejSpotreba(km: number): number {
    return (this.spotreba * km) / 100;
  }

  /**
   * Textový popis upravený pro elektromobil
   */
  public getInfo(): string {
    const servis = this.jeServisNutny() ? " ⚠️ SERVIS!" : "";
    return (
      `[ELEKTRICKÉ] ${this.znacka} (${this.spz}) | ` +
      `Nájezd: ${this.najetKm} km | ` +
      `Baterie: ${this.stavNadrze.toFixed(1)}/${this.kapacitaNadrze} kWh | ` +
      `Místa: ${this._pocetMist}` + 
      servis
    );
  }

  /**
   * Jízda – funguje stejně, jen hlášení do konzole mluví o kWh
   */
  public jet(km: number): void {
    if (km <= 0) {
      console.error(`[${this.spz}] Počet km musí být kladný.`);
      return;
    }
    const potrebaEnergie = this.vypocitejSpotreba(km);
    if (potrebaEnergie > this.stavNadrze) {
      console.error(`[${this.spz}] Nedostatek energie v baterii! Potřeba: ${potrebaEnergie.toFixed(2)} kWh, dostupné: ${this.stavNadrze.toFixed(1)} kWh`);
      return;
    }
    this.stavNadrze = this.stavNadrze - potrebaEnergie;
    this.najetKm = this.najetKm + km;
    console.log(`[${this.spz}] Ujeto ${km} km, spotřebováno ${potrebaEnergie.toFixed(2)} kWh elektrické energie.`);
    if (this.jeServisNutny()) {
      console.warn(`[${this.spz}] ⚠️ Vozidlo překročilo servisní limit ${this.servisLimitKm} km!`);
    }
  }
}