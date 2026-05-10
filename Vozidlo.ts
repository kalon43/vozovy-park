/**
 * Vozidlo.ts – Abstraktní bázová třída
 *
 * Definuje společné vlastnosti a rozhraní pro všechna vozidla v systému.
 * Nelze z ní přímo vytvořit instanci – slouží pouze jako základ pro potomky.
 */

export abstract class Vozidlo {
  // Soukromé atributy – přístup zvenčí pouze přes gettery/settery
  private _id: string;
  private _spz: string;
  private _znacka: string;
  private _najetKm: number;
  private _stavNadrze: number;
  private _kapacitaNadrze: number;
  private _servisLimitKm: number;

  /** Průměrná (nebo základní) spotřeba v L/100 km */
  public spotreba: number;

  /**
   * Konstruktor – inicializuje společné vlastnosti všech vozidel.
   * Validace vstupních hodnot probíhá přes settery.
   */
  constructor(
    id: string,
    znacka: string,
    spz: string,
    spotreba: number,
    kapacitaNadrze: number,
    servisLimitKm: number
  ) {
    this._id = id;
    this._znacka = znacka;
    this._spz = spz;
    this._najetKm = 0;
    this._stavNadrze = kapacitaNadrze; // začínáme s plnou nádrží
    this._kapacitaNadrze = kapacitaNadrze;
    this._servisLimitKm = servisLimitKm;
    this.spotreba = spotreba;
  }

  // ─── Gettery ───────────────────────────────────────────────────────────

  get id(): string { return this._id; }
  get znacka(): string { return this._znacka; }
  get spz(): string { return this._spz; }
  get najetKm(): number { return this._najetKm; }
  get stavNadrze(): number { return this._stavNadrze; }
  get kapacitaNadrze(): number { return this._kapacitaNadrze; }
  get servisLimitKm(): number { return this._servisLimitKm; }

  // ─── Settery s validací ────────────────────────────────────────────────

  /** Setter pro nájezd – zakazuje záporné hodnoty */
  set najetKm(hodnota: number) {
    if (hodnota < 0) {
      console.error(`[${this._spz}] Nájezd nemůže být záporný! Hodnota ignorována.`);
      return;
    }
    this._najetKm = hodnota;
  }

  /** Setter pro stav nádrže – hlídá rozsah 0 až kapacita nádrže */
  set stavNadrze(hodnota: number) {
    if (hodnota < 0) {
      this._stavNadrze = 0;
      console.warn(`[${this._spz}] Nádrž je prázdná!`);
    } else if (hodnota > this._kapacitaNadrze) {
      this._stavNadrze = this._kapacitaNadrze;
      console.warn(`[${this._spz}] Nádrž je plná, přebytek ignorován.`);
    } else {
      this._stavNadrze = hodnota;
    }
  }

  // ─── Sdílené metody ────────────────────────────────────────────────────

  /**
   * Natankuje zadaný počet litrů do nádrže.
   * Setter stavNadrze automaticky ohlídá nepřetečení.
   */
  public tankovat(litry: number): void {
    if (litry <= 0) {
      console.error(`[${this._spz}] Množství paliva musí být kladné číslo.`);
      return;
    }
    this.stavNadrze = this._stavNadrze + litry;
    console.log(`[${this._spz}] Natankováno. Stav nádrže: ${this._stavNadrze.toFixed(1)} / ${this._kapacitaNadrze} L`);
  }

  /**
   * Zjistí, zda vozidlo překročilo servisní limit km.
   * Vrací true = servis je nutný, false = vše v pořádku.
   */
  public jeServisNutny(): boolean {
    return this._najetKm >= this._servisLimitKm;
  }

  // ─── Abstraktní metody – každý potomek musí implementovat ─────────────

  /**
   * Vypočítá spotřebu paliva pro zadaný počet km.
   * Každý typ vozidla má vlastní výpočetní logiku.
   */
  public abstract vypocitejSpotreba(km: number): number;

  /**
   * Vrátí textový popis vozidla pro výpis do konzole nebo tabulky.
   * Každý typ vozidla vrací jiné informace.
   */
  public abstract getInfo(): string;
}
