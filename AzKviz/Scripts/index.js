let ButtonIndex = 0;

async function Moderator(test)
{
    let idx = NaN;
    ButtonIndex = test;
    if (typeof test === 'string' || typeof test === 'number') {
        idx = parseInt(test, 10) - 1; // pořadí tlačítka (1-based) na index (0-based)
    } else if (test && typeof test.id !== 'undefined') {
        idx = parseInt(test.id, 10) - 1;
    }

    const otazky = window.Otazky;
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
        console.log('Aktuální Otazky (ukázka prvních 10):', otazky.slice(0,10));
        return null;
    }
}

function Zobraz(e)
{
    document.getElementById("Otazka").classList.remove("hidden");
    document.getElementById("Odpoved").classList.remove("hidden");
    document.getElementById("Buttons").classList.remove("hidden");
    document.getElementById("Otazka").innerHTML = e.otazka;
    document.getElementById("Odpoved").innerHTML = e.odpoved;
}

document.getElementById("OrangeB").addEventListener("click", function(){
    barva("oranzova")
})
document.getElementById("BlackB").addEventListener("click", function(){
    barva("cerna")
})
document.getElementById("BlueB").addEventListener("click", function(){
    barva("modra")
})
function barva(nazev)
{
    const btnId = "btn-" + ButtonIndex;
    const parent = document.getElementById(btnId);
    if (!parent) return;

    if (nazev == "oranzova") {
        Array.from(parent.children).forEach(child => {
            child.classList.add("orange");
            child.style.color = "white";
        });
    }
    else if (nazev == "modra") {
        Array.from(parent.children).forEach(child => {
            child.classList.add("blue");
            child.style.color = "white";
        });
    }
    else if (nazev == "cerna") {
        Array.from(parent.children).forEach(child => {
            child.classList.add("black");
            child.style.color = "white";
            child.style.color = "white";
        });
    }
    zmenaBarvy(nazev,btnId)
}
