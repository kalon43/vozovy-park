"use strict";
/**
 * OsobniVuz.ts – Konkrétní třída pro osobní automobil
 *
 * Dědí od abstraktní třídy Vozidlo a implementuje vlastní
 * výpočet spotřeby: fixní spotřeba + příplatek za klimatizaci.
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
exports.OsobniVuz = void 0;
var Vozidlo_1 = require("./Vozidlo");
var OsobniVuz = /** @class */ (function (_super) {
    __extends(OsobniVuz, _super);
    /**
     * Konstruktor osobního vozu.
     * Volá konstruktor rodičovské třídy (super) a inicializuje vlastní atributy.
     */
    function OsobniVuz(id, znacka, spz, spotreba, kapacitaNadrze, servisLimitKm, pocetMist, klimatizace) {
        var _this = _super.call(this, id, znacka, spz, spotreba, kapacitaNadrze, servisLimitKm) || this;
        /** Počet míst k sezení (včetně řidiče) */
        _this._pocetMist = 5;
        _this.pocetMist = pocetMist; // přes setter kvůli validaci
        _this.klimatizace = klimatizace;
        return _this;
    }
    Object.defineProperty(OsobniVuz.prototype, "pocetMist", {
        // ─── Getter / Setter pro počet míst ───────────────────────────────────
        get: function () { return this._pocetMist; },
        /** Setter – počet míst musí být v rozsahu 1–9 */
        set: function (hodnota) {
            if (hodnota < 1 || hodnota > 9) {
                console.error("[".concat(this.spz, "] Po\u010Det m\u00EDst mus\u00ED b\u00FDt 1\u20139. Nastaveno v\u00FDchoz\u00EDch 5."));
                this._pocetMist = 5;
            }
            else {
                this._pocetMist = hodnota;
            }
        },
        enumerable: false,
        configurable: true
    });
    // ─── Implementace abstraktních metod ──────────────────────────────────
    /**
     * Výpočet spotřeby osobního vozu.
     * Vzorec: (základní spotřeba + příplatek za klimatizaci) × km / 100
     * Klimatizace přidává 0,5 L/100 km.
     */
    OsobniVuz.prototype.vypocitejSpotreba = function (km) {
        var efektivniSpotreba = this.spotreba + (this.klimatizace ? 0.5 : 0);
        return (efektivniSpotreba * km) / 100;
    };
    /**
     * Textový popis vozidla pro výpis do konzole / tabulky.
     */
    OsobniVuz.prototype.getInfo = function () {
        var servis = this.jeServisNutny() ? " ⚠️ SERVIS!" : "";
        return ("[OSOBN\u00CD] ".concat(this.znacka, " (").concat(this.spz, ") | ") +
            "N\u00E1jezd: ".concat(this.najetKm, " km | ") +
            "N\u00E1dr\u017E: ".concat(this.stavNadrze.toFixed(1), "/").concat(this.kapacitaNadrze, " L | ") +
            "M\u00EDsta: ".concat(this._pocetMist, " | ") +
            "Klima: ".concat(this.klimatizace ? "ano" : "ne") +
            servis);
    };
    /**
     * Simulace jízdy – odečte spotřebované palivo, přičte km.
     * Kontroluje, zda má vozidlo dostatek paliva na danou trasu.
     */
    OsobniVuz.prototype.jet = function (km) {
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
        console.log("[".concat(this.spz, "] Ujeto ").concat(km, " km, spot\u0159ebov\u00E1no ").concat(potrebaPaliva.toFixed(2), " L."));
        if (this.jeServisNutny()) {
            console.warn("[".concat(this.spz, "] \u26A0\uFE0F  Vozidlo p\u0159ekro\u010Dilo servisn\u00ED limit ").concat(this.servisLimitKm, " km!"));
        }
    };
    return OsobniVuz;
}(Vozidlo_1.Vozidlo));
exports.OsobniVuz = OsobniVuz;
