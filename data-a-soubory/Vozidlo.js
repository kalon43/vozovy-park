"use strict";
/**
 * Vozidlo.ts – Abstraktní bázová třída
 *
 * Definuje společné vlastnosti a rozhraní pro všechna vozidla v systému.
 * Nelze z ní přímo vytvořit instanci – slouží pouze jako základ pro potomky.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vozidlo = void 0;
var Vozidlo = /** @class */ (function () {
    /**
     * Konstruktor – inicializuje společné vlastnosti všech vozidel.
     * Validace vstupních hodnot probíhá přes settery.
     */
    function Vozidlo(id, znacka, spz, spotreba, kapacitaNadrze, servisLimitKm) {
        this._id = id;
        this._znacka = znacka;
        this._spz = spz;
        this._najetKm = 0;
        this._stavNadrze = kapacitaNadrze; // začínáme s plnou nádrží
        this._kapacitaNadrze = kapacitaNadrze;
        this._servisLimitKm = servisLimitKm;
        this.spotreba = spotreba;
    }
    Object.defineProperty(Vozidlo.prototype, "id", {
        // ─── Gettery ───────────────────────────────────────────────────────────
        get: function () { return this._id; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Vozidlo.prototype, "znacka", {
        get: function () { return this._znacka; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Vozidlo.prototype, "spz", {
        get: function () { return this._spz; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Vozidlo.prototype, "najetKm", {
        get: function () { return this._najetKm; },
        // ─── Settery s validací ────────────────────────────────────────────────
        /** Setter pro nájezd – zakazuje záporné hodnoty */
        set: function (hodnota) {
            if (hodnota < 0) {
                console.error("[".concat(this._spz, "] Nájezd nemůže být záporný! Hodnota ignorována."));
                return;
            }
            this._najetKm = hodnota;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Vozidlo.prototype, "stavNadrze", {
        get: function () { return this._stavNadrze; },
        /** Setter pro stav nádrže – hlídá rozsah 0 až kapacita nádrže */
        set: function (hodnota) {
            if (hodnota < 0) {
                this._stavNadrze = 0;
                console.warn("[".concat(this._spz, "] Nádrž je prázdná!"));
            }
            else if (hodnota > this._kapacitaNadrze) {
                this._stavNadrze = this._kapacitaNadrze;
                console.warn("[".concat(this._spz, "] Nádrž je plná, přebytek ignorován."));
            }
            else {
                this._stavNadrze = hodnota;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Vozidlo.prototype, "kapacitaNadrze", {
        get: function () { return this._kapacitaNadrze; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Vozidlo.prototype, "servisLimitKm", {
        get: function () { return this._servisLimitKm; },
        enumerable: false,
        configurable: true
    });
    // ─── Sdílené metody ────────────────────────────────────────────────────
    /**
     * Natankuje zadaný počet litrů do nádrže.
     * Setter stavNadrze automaticky ohlídá nepřetečení.
     */
    Vozidlo.prototype.tankovat = function (litry) {
        if (litry <= 0) {
            console.error("[".concat(this._spz, "] Množství paliva musí být kladné číslo."));
            return;
        }
        this.stavNadrze = this._stavNadrze + litry;
        console.log("[".concat(this._spz, "] Natankováno. Stav nádrže: ").concat(this._stavNadrze.toFixed(1), " / ").concat(this._kapacitaNadrze, " L"));
    };
    /**
     * Zjistí, zda vozidlo překročilo servisní limit km.
     * Vrací true = servis je nutný, false = vše v pořádku.
     */
    Vozidlo.prototype.jeServisNutny = function () {
        return this._najetKm >= this._servisLimitKm;
    };
    return Vozidlo;
}());
exports.Vozidlo = Vozidlo;
