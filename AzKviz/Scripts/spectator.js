function getOtazkyFromStorage() {
    try {
        // podporované klíče: 'AzKviz.Otazky' (použitý dříve) nebo fallback 'Otazky'
        const raw = localStorage.getItem('AzKviz.Otazky') || localStorage.getItem('Otazky');
        if (!raw) return null;
        return JSON.parse(raw);
    } catch (err) {
        console.warn('Chyba při čtení Otazky z localStorage', err);
        return null;
    }
}

async function ensureOtazky(timeout = 2000) {
    if (Array.isArray(window.Otazky)) return window.Otazky;
    if (typeof window.LoadOtazkyFromStorage === 'function') {
        const loaded = window.LoadOtazkyFromStorage();
        if (Array.isArray(loaded)) {
            window.Otazky = loaded;
            return window.Otazky;
        }
    }
    const fromStorage = getOtazkyFromStorage();
    if (Array.isArray(fromStorage)) {
        window.Otazky = fromStorage;
        return window.Otazky;
    }

    // krátké polling čekání pokud se seznam právě načítá v jiné části aplikace
    const start = Date.now();
    while (Date.now() - start < timeout) {
        if (Array.isArray(window.Otazky)) return window.Otazky;
        await new Promise(r => setTimeout(r, 100));
        const again = getOtazkyFromStorage();
        if (Array.isArray(again)) {
            window.Otazky = again;
            return window.Otazky;
        }
    }
    return null;
}

async function kontrola(test) {

    if (test.nazev == "Barvy") 
    {
        Barvy(test)
        console.log(test)
    }
    else {
        let idx = NaN;
        if (typeof test === 'string' || typeof test === 'number') {
            idx = parseInt(test, 10) - 1;
        } else if (test && typeof test.id !== 'undefined') {
            idx = parseInt(test.id, 10) - 1;
        }

        const otazky = await ensureOtazky();
        if (!Array.isArray(otazky)) {
            console.warn('Otazky nejsou dostupné (window.Otazky ani storage). Přijato:', test);
            return null;
        }

        if (!Number.isFinite(idx) || idx < 0 || idx >= otazky.length) {
            console.warn('Neplatné nebo chybějící pořadí v příchozím objektu:', test);
            return null;
        }

        const found = otazky[idx];

        if (found) {
            window.CurrentQuestion = found;
            console.log('Otázka nalezena:', found);
            Zobraz(found)
            return found;
        } else {
            console.warn(`Otázka na indexu ${idx} nebyla nalezena v Otazky.`);
            console.log('Aktuální Otazky (ukázka prvních 10):', otazky.slice(0, 10));
            return null;
        }
    }
}

function Zobraz(a) {
    document.getElementById("Odpoved2").innerHTML = a.otazka + "";
    document.getElementById("Odpoved2").classList.remove("hidden");
    document.getElementById("container").classList.add("hidden")
}

function Barvy(barva)
{
    const parent = document.getElementById(barva.btnId);
    if (!parent) return;

    if (barva.barva == "oranzova") {
        Array.from(parent.children).forEach(child => {
            child.classList.add("orange");
            child.style.color = "white";
        });
    }
    else if (barva.barva == "modra") {
        Array.from(parent.children).forEach(child => {
            child.classList.add("blue");
            child.style.color = "white";
        });
    }
    else if (barva.barva == "cerna") {
        Array.from(parent.children).forEach(child => {
            child.classList.add("black");
            child.style.color = "white";
        });
    }
    document.getElementById("Odpoved2").classList.add("hidden");
    document.getElementById("container").classList.remove("hidden")
}