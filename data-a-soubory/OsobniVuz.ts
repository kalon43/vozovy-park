/**
 * OsobniVuz.ts – Konkrétní třída pro osobní automobil
 *
 * Dědí od abstraktní třídy Vozidlo a implementuje vlastní
 * výpočet spotřeby: fixní spotřeba + příplatek za klimatizaci.
 */

import { Vozidlo } from "./Vozidlo";

export class OsobniVuz extends Vozidlo {
  /** Počet míst k sezení (včetně řidiče) */
  private _pocetMist: number = 5;

  /** Přítomnost klimatizace – přidává 0,5 L/100 km ke spotřebě */
  public klimatizace: boolean;

  /**
   * Konstruktor osobního vozu.
   * Volá konstruktor rodičovské třídy (super) a inicializuje vlastní atributy.
   */
  constructor(
    id: string,
    znacka: string,
    spz: string,
    spotreba: number,
    kapacitaNadrze: number,
    servisLimitKm: number,
    pocetMist: number,
    klimatizace: boolean
  ) {
    super(id, znacka, spz, spotreba, kapacitaNadrze, servisLimitKm);
    this.pocetMist = pocetMist; // přes setter kvůli validaci
    this.klimatizace = klimatizace;
  }

  // ─── Getter / Setter pro počet míst ───────────────────────────────────

  get pocetMist(): number { return this._pocetMist; }

  /** Setter – počet míst musí být v rozsahu 1–9 */
  set pocetMist(hodnota: number) {
    if (hodnota < 1 || hodnota > 9) {
      console.error(`[${this.spz}] Počet míst musí být 1–9. Nastaveno výchozích 5.`);
      this._pocetMist = 5;
    } else {
      this._pocetMist = hodnota;
    }
  }

  // ─── Implementace abstraktních metod ──────────────────────────────────

  /**
   * Výpočet spotřeby osobního vozu.
   * Vzorec: (základní spotřeba + příplatek za klimatizaci) × km / 100
   * Klimatizace přidává 0,5 L/100 km.
   */
  public vypocitejSpotreba(km: number): number {
    const efektivniSpotreba = this.spotreba + (this.klimatizace ? 0.5 : 0);
    return (efektivniSpotreba * km) / 100;
  }

  /**
   * Textový popis vozidla pro výpis do konzole / tabulky.
   */
  public getInfo(): string {
    const servis = this.jeServisNutny() ? " ⚠️ SERVIS!" : "";
    return (
      `[OSOBNÍ] ${this.znacka} (${this.spz}) | ` +
      `Nájezd: ${this.najetKm} km | ` +
      `Nádrž: ${this.stavNadrze.toFixed(1)}/${this.kapacitaNadrze} L | ` +
      `Místa: ${this._pocetMist} | ` +
      `Klima: ${this.klimatizace ? "ano" : "ne"}` +
      servis
    );
  }

  /**
   * Simulace jízdy – odečte spotřebované palivo, přičte km.
   * Kontroluje, zda má vozidlo dostatek paliva na danou trasu.
   */
  public jet(km: number): void {
    if (km <= 0) {
      console.error(`[${this.spz}] Počet km musí být kladný.`);
      return;
    }
    const potrebaPaliva = this.vypocitejSpotreba(km);
    if (potrebaPaliva > this.stavNadrze) {
      console.error(`[${this.spz}] Nedostatek paliva! Potřeba: ${potrebaPaliva.toFixed(2)} L, dostupné: ${this.stavNadrze.toFixed(1)} L`);
      return;
    }
    this.stavNadrze = this.stavNadrze - potrebaPaliva;
    this.najetKm = this.najetKm + km;
    console.log(`[${this.spz}] Ujeto ${km} km, spotřebováno ${potrebaPaliva.toFixed(2)} L.`);
    if (this.jeServisNutny()) {
      console.warn(`[${this.spz}] ⚠️  Vozidlo překročilo servisní limit ${this.servisLimitKm} km!`);
    }
  }
}
