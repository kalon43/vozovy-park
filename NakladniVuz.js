"use strict";
/**
 * NakladniVuz.ts – Konkrétní třída pro nákladní automobil
 *
 * Dědí od abstraktní třídy Vozidlo. Klíčový rozdíl oproti OsobniVuz:
 * spotřeba paliva roste lineárně s hmotností aktuálního nákladu.
 * Každá tuna nákladu přidává 1,5 L/100 km ke základní spotřebě.
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.NakladniVuz = void 0;
var Vozidlo_1 = require("./Vozidlo");
var NakladniVuz = /** @class */ (function (_super) {
    __extends(NakladniVuz, _super);
    /**
     * Konstruktor nákladního vozu.
     * Volá konstruktor rodičovské třídy (super) a inicializuje vlastní atributy.
     */
    function NakladniVuz(id, znacka, spz, spotreba, kapacitaNadrze, servisLimitKm, nosnostTun) {
        var _this = _super.call(this, id, znacka, spz, spotreba, kapacitaNadrze, servisLimitKm) || this;
        /** Maximální přípustná nosnost v tunách */
        _this._nosnostTun = 1;
        _this.nosnostTun = nosnostTun; // přes setter kvůli validaci
        _this._aktualniNakladTun = 0; // prázdný vůz na začátku
        return _this;
    }
    Object.defineProperty(NakladniVuz.prototype, "nosnostTun", {
        // ─── Gettery / Settery ─────────────────────────────────────────────────
        get: function () { return this._nosnostTun; },
        /** Setter – nosnost musí být kladné číslo */
        set: function (hodnota) {
            if (hodnota <= 0) {
                console.error("[".concat(this.spz, "] Nosnost mus\u00ED b\u00FDt kladn\u00E1. Nastavena v\u00FDchoz\u00ED hodnota 1 t."));
                this._nosnostTun = 1;
            }
            else {
                this._nosnostTun = hodnota;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(NakladniVuz.prototype, "aktualniNakladTun", {
        get: function () { return this._aktualniNakladTun; },
        /**
         * Setter pro aktuální náklad.
         * Hlídá rozsah 0 až maximální nosnost.
         */
        set: function (hodnota) {
            if (hodnota < 0) {
                console.error("[".concat(this.spz, "] N\u00E1klad nem\u016F\u017Ee b\u00FDt z\u00E1porn\u00FD."));
                this._aktualniNakladTun = 0;
            }
            else if (hodnota > this._nosnostTun) {
                console.error("[".concat(this.spz, "] N\u00E1klad ").concat(hodnota, " t p\u0159ekra\u010Duje nosnost ").concat(this._nosnostTun, " t! Nastavena maxim\u00E1ln\u00ED hodnota."));
                this._aktualniNakladTun = this._nosnostTun;
            }
            else {
                this._aktualniNakladTun = hodnota;
            }
        },
        enumerable: false,
        configurable: true
    });
    // ─── Implementace abstraktních metod ──────────────────────────────────
    /**
     * Výpočet spotřeby nákladního vozu.
     * Vzorec: (základní spotřeba + náklad × 1,5) × km / 100
     * Každá tuna nákladu přidává 1,5 L/100 km.
     */
    NakladniVuz.prototype.vypocitejSpotreba = function (km) {
        var efektivniSpotreba = this.spotreba + this._aktualniNakladTun * 1.5;
        return (efektivniSpotreba * km) / 100;
    };
    /**
     * Textový popis vozidla pro výpis do konzole / tabulky.
     */
    NakladniVuz.prototype.getInfo = function () {
        var servis = this.jeServisNutny() ? " ⚠️ SERVIS!" : "";
        return ("[N\u00C1KLADN\u00CD] ".concat(this.znacka, " (").concat(this.spz, ") | ") +
            "N\u00E1jezd: ".concat(this.najetKm, " km | ") +
            "N\u00E1dr\u017E: ".concat(this.stavNadrze.toFixed(1), "/").concat(this.kapacitaNadrze, " L | ") +
            "N\u00E1klad: ".concat(this._aktualniNakladTun, "/").concat(this._nosnostTun, " t") +
            servis);
    };
    /**
     * Simulace jízdy – odečte spotřebované palivo, přičte km.
     * Spotřeba se vypočítá podle aktuálního nákladu v době jízdy.
     */
    NakladniVuz.prototype.jet = function (km) {
        if (km <= 0) {
            console.error("[".concat(this.spz, "] Po\u010Det km mus\u00ED b\u00FDt kladn\u00FD."));
            return;
        }
        var potrebaPaliva = this.vypocitejSpotreba(km);
        if (potrebaPaliva > this.stavNadrze) {
            console.error("[".concat(this.spz, "] Nedostatek paliva! Pot\u0159eba: ").concat(potrebaPaliva.toFixed(2), " L, dostupn\u00E9: ").concat(this.stavNadrze.toFixed(1), " L"));
            return;
        }
        this.stavNadrze = this.stavNadrze - potrebaPaliva;
        this.najetKm = this.najetKm + km;
        console.log("[".concat(this.spz, "] Ujeto ").concat(km, " km (n\u00E1klad ").concat(this._aktualniNakladTun, " t), spot\u0159ebov\u00E1no ").concat(potrebaPaliva.toFixed(2), " L."));
        if (this.jeServisNutny()) {
            console.warn("[".concat(this.spz, "] \u26A0\uFE0F  Vozidlo p\u0159ekro\u010Dilo servisn\u00ED limit ").concat(this.servisLimitKm, " km!"));
        }
    };
    return NakladniVuz;
}(Vozidlo_1.Vozidlo));
exports.NakladniVuz = NakladniVuz;
