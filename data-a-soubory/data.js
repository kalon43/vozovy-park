/**
 * data.ts – Datový číselník vozového parku
 *
 * Tento soubor slouží jako "katalog" vozidel – obsahuje pouze čistá data
 * bez jakékoli logiky. Oddělení dat od logiky zajišťuje, že při změně
 * ceníku nebo přidání vozidla není třeba měnit žádný jiný soubor.
 */
/**
 * Katalog vozidel – "surová" data bez jakékoli třídy.
 * Program z těchto objektů vytvoří živé instance tříd OsobniVuz / NakladniVuz / ElektrickeAuto.
 */
export const katalog = [
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
        spz: "5JK 5566",
        spotreba: 15.8,
        kapacitaNadrze: 75,
        servisLimitKm: 30000,
        rekuperace: true,
    },
];
