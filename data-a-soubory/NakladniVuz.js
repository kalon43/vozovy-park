/**
 * NakladniVuz.ts – Konkrétní třída pro nákladní automobil
 *
 * Dědí od abstraktní třídy Vozidlo. Klíčový rozdíl oproti OsobniVuz:
 * spotřeba paliva roste lineárně s hmotností aktuálního nákladu.
 * Každá tuna nákladu přidává 1,5 L/100 km ke základní spotřebě.
 */
import { Vozidlo } from "./Vozidlo";
export class NakladniVuz extends Vozidlo {
    /** Maximální přípustná nosnost v tunách */
    _nosnostTun = 1;
    /** Aktuální náklad v tunách – ovlivňuje výpočet spotřeby */
    _aktualniNakladTun;
    /**
     * Konstruktor nákladního vozu.
     * Volá konstruktor rodičovské třídy (super) a inicializuje vlastní atributy.
     */
    constructor(id, znacka, spz, spotreba, kapacitaNadrze, servisLimitKm, nosnostTun) {
        super(id, znacka, spz, spotreba, kapacitaNadrze, servisLimitKm);
        this.nosnostTun = nosnostTun; // přes setter kvůli validaci
        this._aktualniNakladTun = 0; // prázdný vůz na začátku
    }
    // ─── Gettery / Settery ─────────────────────────────────────────────────
    get nosnostTun() { return this._nosnostTun; }
    get aktualniNakladTun() { return this._aktualniNakladTun; }
    /** Setter – nosnost musí být kladné číslo */
    set nosnostTun(hodnota) {
        if (hodnota <= 0) {
            console.error(`[${this.spz}] Nosnost musí být kladná. Nastavena výchozí hodnota 1 t.`);
            this._nosnostTun = 1;
        }
        else {
            this._nosnostTun = hodnota;
        }
    }
    /**
     * Setter pro aktuální náklad.
     * Hlídá rozsah 0 až maximální nosnost.
     */
    set aktualniNakladTun(hodnota) {
        if (hodnota < 0) {
            console.error(`[${this.spz}] Náklad nemůže být záporný.`);
            this._aktualniNakladTun = 0;
        }
        else if (hodnota > this._nosnostTun) {
            console.error(`[${this.spz}] Náklad ${hodnota} t překračuje nosnost ${this._nosnostTun} t! Nastavena maximální hodnota.`);
            this._aktualniNakladTun = this._nosnostTun;
        }
        else {
            this._aktualniNakladTun = hodnota;
        }
    }
    // ─── Implementace abstraktních metod ──────────────────────────────────
    /**
     * Výpočet spotřeby nákladního vozu.
     * Vzorec: (základní spotřeba + náklad × 1,5) × km / 100
     * Každá tuna nákladu přidává 1,5 L/100 km.
     */
    vypocitejSpotreba(km) {
        const efektivniSpotreba = this.spotreba + this._aktualniNakladTun * 1.5;
        return (efektivniSpotreba * km) / 100;
    }
    /**
     * Textový popis vozidla pro výpis do konzole / tabulky.
     */
    getInfo() {
        const servis = this.jeServisNutny() ? " ⚠️ SERVIS!" : "";
        return (`[NÁKLADNÍ] ${this.znacka} (${this.spz}) | ` +
            `Nájezd: ${this.najetKm} km | ` +
            `Nádrž: ${this.stavNadrze.toFixed(1)}/${this.kapacitaNadrze} L | ` +
            `Náklad: ${this._aktualniNakladTun}/${this._nosnostTun} t` +
            servis);
    }
    /**
     * Simulace jízdy – odečte spotřebované palivo, přičte km.
     * Spotřeba se vypočítá podle aktuálního nákladu v době jízdy.
     */
    jet(km) {
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
        console.log(`[${this.spz}] Ujeto ${km} km (náklad ${this._aktualniNakladTun} t), spotřebováno ${potrebaPaliva.toFixed(2)} L.`);
        if (this.jeServisNutny()) {
            console.warn(`[${this.spz}] ⚠️  Vozidlo překročilo servisní limit ${this.servisLimitKm} km!`);
        }
    }
}
