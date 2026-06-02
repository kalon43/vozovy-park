/**
 * Vozidlo.ts – Abstraktní bázová třída
 *
 * Definuje společné vlastnosti a rozhraní pro všechna vozidla v systému.
 * Nelze z ní přímo vytvořit instanci – slouží pouze jako základ pro potomky.
 */
export class Vozidlo {
    // Soukromé atributy – přístup zvenčí pouze přes gettery/settery
    _id;
    _spz;
    _znacka;
    _najetKm;
    _stavNadrze;
    _kapacitaNadrze;
    _servisLimitKm;
    /** Průměrná (nebo základní) spotřeba v L/100 km */
    spotreba;
    /**
     * Konstruktor – inicializuje společné vlastnosti všech vozidel.
     * Validace vstupních hodnot probíhá přes settery.
     */
    constructor(id, znacka, spz, spotreba, kapacitaNadrze, servisLimitKm) {
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
    get id() { return this._id; }
    get znacka() { return this._znacka; }
    get spz() { return this._spz; }
    get najetKm() { return this._najetKm; }
    get stavNadrze() { return this._stavNadrze; }
    get kapacitaNadrze() { return this._kapacitaNadrze; }
    get servisLimitKm() { return this._servisLimitKm; }
    // ─── Settery s validací ────────────────────────────────────────────────
    /** Setter pro nájezd – zakazuje záporné hodnoty */
    set najetKm(hodnota) {
        if (hodnota < 0) {
            console.error(`[${this._spz}] Nájezd nemůže být záporný! Hodnota ignorována.`);
            return;
        }
        this._najetKm = hodnota;
    }
    /** Setter pro stav nádrže – hlídá rozsah 0 až kapacita nádrže */
    set stavNadrze(hodnota) {
        if (hodnota < 0) {
            this._stavNadrze = 0;
            console.warn(`[${this._spz}] Nádrž je prázdná!`);
        }
        else if (hodnota > this._kapacitaNadrze) {
            this._stavNadrze = this._kapacitaNadrze;
            console.warn(`[${this._spz}] Nádrž je plná, přebytek ignorován.`);
        }
        else {
            this._stavNadrze = hodnota;
        }
    }
    // ─── Sdílené metody ────────────────────────────────────────────────────
    /**
     * Natankuje zadaný počet litrů do nádrže.
     * Setter stavNadrze automaticky ohlídá nepřetečení.
     */
    tankovat(litry) {
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
    jeServisNutny() {
        return this._najetKm >= this._servisLimitKm;
    }
}
