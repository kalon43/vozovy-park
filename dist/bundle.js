(function () {
  class Vozidlo {
    constructor(id, znacka, spz, spotreba, kapacitaNadrze, servisLimitKm) {
      this._id = id;
      this._znacka = znacka;
      this._spz = spz;
      this._najetKm = 0;
      this._kapacitaNadrze = kapacitaNadrze;
      this._stavNadrze = kapacitaNadrze;
      this._servisLimitKm = servisLimitKm;
      this.spotreba = spotreba;
    }
    get id() { return this._id; }
    get znacka() { return this._znacka; }
    get spz() { return this._spz; }
    get najetKm() { return this._najetKm; }
    get stavNadrze() { return this._stavNadrze; }
    get kapacitaNadrze() { return this._kapacitaNadrze; }
    get servisLimitKm() { return this._servisLimitKm; }
    set najetKm(v) {
      if (v < 0) {
        console.error(`[${this._spz}] Nájezd nemůže být záporný!`);
        return;
      }
      this._najetKm = v;
    }
    set stavNadrze(v) {
      if (v < 0) {
        this._stavNadrze = 0;
        console.warn(`[${this._spz}] Nádrž je prázdná!`);
      } else if (v > this._kapacitaNadrze) {
        this._stavNadrze = this._kapacitaNadrze;
        console.warn(`[${this._spz}] Nádrž je plná, přebytek ignorován.`);
      } else {
        this._stavNadrze = v;
      }
    }
    tankovat(litry) {
      if (litry <= 0) {
        console.error(`[${this._spz}] Množství paliva musí být kladné číslo.`);
        return;
      }
      this.stavNadrze = this._stavNadrze + litry;
      console.log(`[${this._spz}] Natankováno. Stav nádrže: ${this._stavNadrze.toFixed(1)} / ${this._kapacitaNadrze} L`);
    }
    jeServisNutny() {
      return this._najetKm >= this._servisLimitKm;
    }
  }

  class OsobniVuz extends Vozidlo {
    constructor(id, znacka, spz, spotreba, kapacitaNadrze, servisLimitKm, pocetMist, klimatizace) {
      super(id, znacka, spz, spotreba, kapacitaNadrze, servisLimitKm);
      this._pocetMist = 5;
      this.pocetMist = pocetMist;
      this.klimatizace = klimatizace;
    }
    get pocetMist() { return this._pocetMist; }
    set pocetMist(v) {
      if (v < 1 || v > 9) {
        console.error(`[${this.spz}] Počet míst musí být 1–9. Nastaveno výchozích 5.`);
        this._pocetMist = 5;
      } else {
        this._pocetMist = v;
      }
    }
    vypocitejSpotreba(km) {
      const efektivniSpotreba = this.spotreba + (this.klimatizace ? 0.5 : 0);
      return (efektivniSpotreba * km) / 100;
    }
    getInfo() {
      const servis = this.jeServisNutny() ? " ⚠️ SERVIS!" : "";
      return `[OSOBNÍ] ${this.znacka} (${this.spz}) | Nájezd: ${this.najetKm} km | Nádrž: ${this.stavNadrze.toFixed(1)}/${this.kapacitaNadrze} L | Místa: ${this._pocetMist} | Klima: ${this.klimatizace ? "ano" : "ne"}` + servis;
    }
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
      console.log(`[${this.spz}] Ujeto ${km} km, spotřebováno ${potrebaPaliva.toFixed(2)} L.`);
      if (this.jeServisNutny()) {
        console.warn(`[${this.spz}] ⚠️ Vozidlo překročilo servisní limit ${this.servisLimitKm} km!`);
      }
    }
  }

  class NakladniVuz extends Vozidlo {
    constructor(id, znacka, spz, spotreba, kapacitaNadrze, servisLimitKm, nosnostTun) {
      super(id, znacka, spz, spotreba, kapacitaNadrze, servisLimitKm);
      this._nosnostTun = 1;
      this.nosnostTun = nosnostTun;
      this._aktualniNakladTun = 0;
    }
    get nosnostTun() { return this._nosnostTun; }
    get aktualniNakladTun() { return this._aktualniNakladTun; }
    set nosnostTun(v) {
      if (v <= 0) {
        console.error(`[${this.spz}] Nosnost musí být kladná. Nastavena výchozí hodnota 1 t.`);
        this._nosnostTun = 1;
      } else {
        this._nosnostTun = v;
      }
    }
    set aktualniNakladTun(v) {
      if (v < 0) {
        console.error(`[${this.spz}] Náklad nemůže být záporný.`);
        this._aktualniNakladTun = 0;
      } else if (v > this._nosnostTun) {
        console.error(`[${this.spz}] Náklad ${v} t překračuje nosnost ${this._nosnostTun} t! Nastavena maximální hodnota.`);
        this._aktualniNakladTun = this._nosnostTun;
      } else {
        this._aktualniNakladTun = v;
      }
    }
    vypocitejSpotreba(km) {
      const efektivniSpotreba = this.spotreba + this._aktualniNakladTun * 1.5;
      return (efektivniSpotreba * km) / 100;
    }
    getInfo() {
      const servis = this.jeServisNutny() ? " ⚠️ SERVIS!" : "";
      return `[NÁKLADNÍ] ${this.znacka} (${this.spz}) | Nájezd: ${this.najetKm} km | Nádrž: ${this.stavNadrze.toFixed(1)}/${this.kapacitaNadrze} L | Náklad: ${this._aktualniNakladTun}/${this._nosnostTun} t` + servis;
    }
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
        console.warn(`[${this.spz}] ⚠️ Vozidlo překročilo servisní limit ${this.servisLimitKm} km!`);
      }
    }
  }

  const katalog = [
    { id: "v001", typ: "osobni", znacka: "Škoda Octavia", spz: "1AB 2345", spotreba: 6.5, kapacitaNadrze: 55, servisLimitKm: 15000, pocetMist: 5, klimatizace: true },
    { id: "v002", typ: "osobni", znacka: "Volkswagen Golf", spz: "2CD 6789", spotreba: 5.8, kapacitaNadrze: 50, servisLimitKm: 20000, pocetMist: 5, klimatizace: false },
    { id: "v003", typ: "nakladni", znacka: "Mercedes Sprinter", spz: "3EF 1122", spotreba: 10.2, kapacitaNadrze: 100, servisLimitKm: 10000, nosnostTun: 3.5 },
    { id: "v004", typ: "nakladni", znacka: "MAN TGX", spz: "4GH 3344", spotreba: 28.0, kapacitaNadrze: 400, servisLimitKm: 50000, nosnostTun: 24 }
  ];

  function vytvorVozidlo(data) {
    if (data.typ === "osobni") {
      return new OsobniVuz(data.id, data.znacka, data.spz, data.spotreba, data.kapacitaNadrze, data.servisLimitKm, data.pocetMist, data.klimatizace);
    }
    return new NakladniVuz(data.id, data.znacka, data.spz, data.spotreba, data.kapacitaNadrze, data.servisLimitKm, data.nosnostTun);
  }

  const fleet = katalog.map(vytvorVozidlo);

  const els = {
    addForm: document.getElementById("add-vehicle-form"),
    addTyp: document.getElementById("add-typ"),
    osobniFields: document.getElementById("osobni-fields"),
    nakladniFields: document.getElementById("nakladni-fields"),
    addZnacka: document.getElementById("add-znacka"),
    addSpz: document.getElementById("add-spz"),
    addSpotreba: document.getElementById("add-spotreba"),
    addKapacita: document.getElementById("add-kapacita"),
    addServis: document.getElementById("add-servis"),
    addPocetMist: document.getElementById("add-pocet-mist"),
    addKlima: document.getElementById("add-klima"),
    addNosnost: document.getElementById("add-nosnost"),
    vehicleSelect: document.getElementById("vehicle-select"),
    driveKm: document.getElementById("drive-km"),
    cargoWrap: document.getElementById("cargo-wrap"),
    cargoTun: document.getElementById("cargo-tun"),
    tankLiters: document.getElementById("tank-liters"),
    driveBtn: document.getElementById("drive-btn"),
    tankBtn: document.getElementById("tank-btn"),
    status: document.getElementById("status"),
    summary: document.getElementById("summary"),
    fleetList: document.getElementById("fleet-list")
  };

  function setStatus(text, ok = true) {
    els.status.textContent = text;
    els.status.classList.toggle("ok", ok);
    els.status.classList.toggle("err", !ok);
  }

  function selectedVehicle() {
    const id = els.vehicleSelect.value;
    return fleet.find(v => v.id === id) || null;
  }

  function nextId() {
    const ids = fleet
      .map(v => Number(v.id.replace("v", "")))
      .filter(n => Number.isFinite(n));
    const max = ids.length ? Math.max(...ids) : 0;
    return `v${String(max + 1).padStart(3, "0")}`;
  }

  function renderSelect() {
    const current = els.vehicleSelect.value;
    els.vehicleSelect.innerHTML = "";
    fleet.forEach(v => {
      const option = document.createElement("option");
      option.value = v.id;
      option.textContent = `${v.znacka} (${v.spz})`;
      els.vehicleSelect.append(option);
    });
    els.vehicleSelect.value = current && fleet.some(v => v.id === current) ? current : (fleet[0] ? fleet[0].id : "");
    updateCargoVisibility();
  }

  function renderSummary() {
    const servis = fleet.filter(v => v.jeServisNutny()).length;
    const osobni = fleet.filter(v => v instanceof OsobniVuz).length;
    const nakladni = fleet.filter(v => v instanceof NakladniVuz).length;
    els.summary.textContent = `Celkem: ${fleet.length} | Osobní: ${osobni} | Nákladní: ${nakladni} | Servis: ${servis}`;
  }

  function renderFleet() {
    els.fleetList.innerHTML = "";
    fleet.forEach(v => {
      const card = document.createElement("article");
      card.className = "card";

      const heading = document.createElement("h3");
      heading.textContent = `${v.znacka} (${v.spz})`;

      const typeBadge = document.createElement("span");
      typeBadge.className = "badge";
      typeBadge.textContent = v instanceof OsobniVuz ? "Osobní" : "Nákladní";

      const fuel = document.createElement("div");
      fuel.className = "kv";
      fuel.textContent = `Nádrž: ${v.stavNadrze.toFixed(1)} / ${v.kapacitaNadrze} L`;

      const km = document.createElement("div");
      km.className = "kv";
      km.textContent = `Nájezd: ${v.najetKm} / ${v.servisLimitKm} km`;

      const detail = document.createElement("div");
      detail.className = "kv";
      if (v instanceof OsobniVuz) {
        detail.textContent = `Místa: ${v.pocetMist} | Klima: ${v.klimatizace ? "ano" : "ne"}`;
      } else {
        detail.textContent = `Náklad: ${v.aktualniNakladTun.toFixed(1)} / ${v.nosnostTun} t`;
      }

      const spotreba = document.createElement("div");
      spotreba.className = "kv";
      spotreba.textContent = `Odhad spotřeby na ${Number(els.driveKm.value) || 100} km: ${v.vypocitejSpotreba(Number(els.driveKm.value) || 100).toFixed(2)} L`;

      card.append(heading, typeBadge, fuel, km, detail, spotreba);

      if (v.jeServisNutny()) {
        const warn = document.createElement("span");
        warn.className = "badge warn";
        warn.textContent = "Vyžaduje servis";
        card.append(warn);
      }

      els.fleetList.append(card);
    });

    renderSummary();
  }

  function updateAddFormVisibility() {
    const osobni = els.addTyp.value === "osobni";
    els.osobniFields.classList.toggle("hidden", !osobni);
    els.nakladniFields.classList.toggle("hidden", osobni);
  }

  function updateCargoVisibility() {
    const vehicle = selectedVehicle();
    const showCargo = vehicle instanceof NakladniVuz;
    els.cargoWrap.classList.toggle("hidden", !showCargo);
  }

  els.addTyp.addEventListener("change", updateAddFormVisibility);
  els.vehicleSelect.addEventListener("change", updateCargoVisibility);

  els.addForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const typ = els.addTyp.value;
    const znacka = els.addZnacka.value.trim();
    const spz = els.addSpz.value.trim();
    const spotreba = Number(els.addSpotreba.value);
    const kapacita = Number(els.addKapacita.value);
    const servis = Number(els.addServis.value);

    if (!znacka || !spz || spotreba <= 0 || kapacita <= 0 || servis <= 0) {
      setStatus("Vyplňte prosím všechna pole správnými hodnotami.", false);
      return;
    }

    let vozidlo;
    if (typ === "osobni") {
      const mista = Number(els.addPocetMist.value);
      vozidlo = new OsobniVuz(nextId(), znacka, spz, spotreba, kapacita, servis, mista, els.addKlima.checked);
    } else {
      const nosnost = Number(els.addNosnost.value);
      if (nosnost <= 0) {
        setStatus("Nosnost musí být větší než 0.", false);
        return;
      }
      vozidlo = new NakladniVuz(nextId(), znacka, spz, spotreba, kapacita, servis, nosnost);
    }

    fleet.push(vozidlo);
    renderSelect();
    renderFleet();
    els.addForm.reset();
    els.addTyp.value = "osobni";
    updateAddFormVisibility();
    setStatus(`Vozidlo ${vozidlo.znacka} bylo přidáno.`);
  });

  els.driveBtn.addEventListener("click", () => {
    const vehicle = selectedVehicle();
    const km = Number(els.driveKm.value);

    if (!vehicle || km <= 0) {
      setStatus("Vyberte vozidlo a zadejte kladný počet km.", false);
      return;
    }

    if (vehicle instanceof NakladniVuz) {
      const naklad = Number(els.cargoTun.value);
      if (naklad < 0) {
        setStatus("Náklad nemůže být záporný.", false);
        return;
      }
      vehicle.aktualniNakladTun = naklad;
    }

    const oldKm = vehicle.najetKm;
    vehicle.jet(km);

    if (vehicle.najetKm === oldKm) {
      setStatus("Jízda neproběhla (zkontrolujte palivo nebo vstupní hodnoty).", false);
      return;
    }

    renderFleet();
    setStatus(`Jízda provedena: ${vehicle.znacka} ujelo ${km} km.`);
  });

  els.tankBtn.addEventListener("click", () => {
    const vehicle = selectedVehicle();
    const liters = Number(els.tankLiters.value);

    if (!vehicle || liters <= 0) {
      setStatus("Vyberte vozidlo a zadejte kladné množství paliva.", false);
      return;
    }

    const oldFuel = vehicle.stavNadrze;
    vehicle.tankovat(liters);

    if (vehicle.stavNadrze === oldFuel) {
      setStatus("Tankování neproběhlo.", false);
      return;
    }

    renderFleet();
    setStatus(`Natankováno ${liters} L pro ${vehicle.znacka}.`);
  });

  els.driveKm.addEventListener("input", renderFleet);

  updateAddFormVisibility();
  renderSelect();
  renderFleet();
  setStatus("Aplikace připravena.");
})();