/**
 * data.ts – Datový číselník vozového parku
 *
 * Tento soubor slouží jako "katalog" vozidel – obsahuje pouze čistá data
 * bez jakékoli logiky. Oddělení dat od logiky zajišťuje, že při změně
 * ceníku nebo přidání vozidla není třeba měnit žádný jiný soubor.
 */

/** Typ pro osobní automobil v číselníku */
export type OsobniVuzData = {
  id: string;
  typ: "osobni";
  znacka: string;
  spz: string;
  spotreba: number;       // průměrná spotřeba v L/100 km
  kapacitaNadrze: number; // objem nádrže v litrech
  servisLimitKm: number;  // počet km do povinného servisu
  pocetMist: number;
  klimatizace: boolean;
};

/** Typ pro nákladní automobil v číselníku */
export type NakladniVuzData = {
  id: string;
  typ: "nakladni";
  znacka: string;
  spz: string;
  spotreba: number;       // základní spotřeba (prázdný vůz) v L/100 km
  kapacitaNadrze: number;
  servisLimitKm: number;
  nosnostTun: number;     // maximální přípustný náklad v tunách
};

/** Typ pro elektrické auto v číselníku */
export type ElektrickyVuzData = {
  id: string;
  typ: "elektricke";
  znacka: string;
  spz: string;
  spotreba: number;       // průměrná spotřeba v kWh/100 km
  kapacitaNadrze: number; // kapacita baterie v kWh
  servisLimitKm: number;  
  pocetMist: number;
};

// Do pole katalog přidáme například Teslu:


/** Sjednocený typ pro položku číselníku */
export type VozidloData = OsobniVuzData | NakladniVuzData | ElektrickyVuzData;

/**
 * Katalog vozidel – "surová" data bez jakékoli třídy.
 * Program z těchto objektů vytvoří živé instance tříd OsobniVuz / NakladniVuz.
 */
export const katalog: VozidloData[] = [
  {
    id: "v001",
    typ: "osobni",
    znacka: "Škoda Octavia",
    spz: "1AB 2345",
    spotreba: 6.5,
    kapacitaNadrze: 55,
    servisLimitKm: 15000,
    pocetMist: 5,
    klimatizace: true,
  },
  {
    id: "v002",
    typ: "osobni",
    znacka: "Volkswagen Golf",
    spz: "2CD 6789",
    spotreba: 5.8,
    kapacitaNadrze: 50,
    servisLimitKm: 20000,
    pocetMist: 5,
    klimatizace: false,
  },
  {
    id: "v003",
    typ: "nakladni",
    znacka: "Mercedes Sprinter",
    spz: "3EF 1122",
    spotreba: 10.2,
    kapacitaNadrze: 100,
    servisLimitKm: 10000,
    nosnostTun: 3.5,
  },
  {
    id: "v004",
    typ: "nakladni",
    znacka: "MAN TGX",
    spz: "4GH 3344",
    spotreba: 28.0,
    kapacitaNadrze: 400,
    servisLimitKm: 50000,
    nosnostTun: 24,
  },
  {
    id: "v005",
    typ: "elektricke",
    znacka: "Tesla Model 3",
    spz: "ELB 1234",
    spotreba: 15.0,        // 15 kWh / 100 km
    kapacitaNadrze: 60,    // 60 kWh baterie
    servisLimitKm: 40000,  // elektromobily mají delší servisní intervaly
    pocetMist: 5
}
];
