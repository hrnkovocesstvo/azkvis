document.getElementById("container").classList.add("hidden")

// přidej preload zvuků (umístěte soubory do h:\Můj disk\AzKviz\Sounds)
// cesta je relativní vůči HTML stránce, která script načítá
const sounds = {
    click: new Audio('../Sounds/click.mp3'),
};
// nastavit hlasitost (0.0 - 1.0)
Object.values(sounds).forEach(a => a.volume = 0.7);

document.querySelectorAll('.hex-button').forEach((button, index) => {
    button.addEventListener('click', function() {
        // přehraj zvuk při kliknutí (restart pokud už hraje)
        if (sounds.click) {
            sounds.click.currentTime = 0;
            sounds.click.play().catch(() => { /* ignorovat chybu autoplayu */ });
        }

        vyberOtazky(index + 1); // předává pořadí tlačítka (1, 2, 3, ...)
        Moderator(index + 1);
        
    });
});




