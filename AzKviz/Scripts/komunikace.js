try {
    document.getElementById("Otazka").classList.add("hidden");
    document.getElementById("Odpoved").classList.add("hidden");
    document.getElementById("Buttons").classList.add("hidden");
} catch (e) {
    // error se nevypisuje do konzole
    document.getElementById("Odpoved2").classList.add("hidden");
}
let pc, channel;

// logovací funkce
function log(msg) {
    document.getElementById("log").value += msg + "\n";
    console.log(msg);
}

window.addEventListener("keydown", function (e) {
    if (e.key === "F5" || (e.ctrlKey && e.key.toLowerCase() === "r")) {
        e.preventDefault();
    }
});

window.addEventListener("beforeunload", (event) => {
    event.preventDefault();
    event.returnValue = "";
});

// vytvoření spojení (PC1)
document.getElementById("create").onclick = async () => {
    log("[CREATE] Vytvářím RTCPeerConnection");
    pc = new RTCPeerConnection();
    channel = pc.createDataChannel("chat");
    log("[CREATE] DataChannel vytvořen");
    setupChannel();

    const offer = await pc.createOffer();
    log("[CREATE] Offer vytvořen");
    await pc.setLocalDescription(offer);
    log("[CREATE] Offer nastaven jako localDescription");

    log("Offer vytvořen — zkopíruj ho do PC2:");
    document.getElementById("offer").value = JSON.stringify(offer);

    pc.onicecandidate = (e) => {
        log("[CREATE] ICE candidate: " + JSON.stringify(e.candidate));
        if (e.candidate === null) {
            document.getElementById("offer").value = JSON.stringify(
                pc.localDescription
            );
            log("[CREATE] Všechny ICE kandidáty odeslány");
        }
    };
    pc.onconnectionstatechange = () => log("[CREATE] Stav spojení: " + pc.connectionState);
};

// odpověď (PC2)
document.getElementById("answer").onclick = async () => {
    log("[ANSWER] Vytvářím RTCPeerConnection");
    pc = new RTCPeerConnection();

    pc.ondatachannel = (e) => {
        log("[ANSWER] DataChannel přijat");
        channel = e.channel;
        setupChannel();
    };

    const offer = JSON.parse(document.getElementById("offer").value);
    log("[ANSWER] Offer přijat: " + JSON.stringify(offer));
    await pc.setRemoteDescription(offer);
    log("[ANSWER] Offer nastaven jako remoteDescription");

    const answer = await pc.createAnswer();
    log("[ANSWER] Answer vytvořen");
    await pc.setLocalDescription(answer);
    log("[ANSWER] Answer nastaven jako localDescription");

    pc.onicecandidate = (e) => {
        log("[ANSWER] ICE candidate: " + JSON.stringify(e.candidate));
        if (e.candidate === null) {
            document.getElementById("offer").value = JSON.stringify(
                pc.localDescription
            );
            log("Answer vytvořen — zkopíruj ho zpět do PC1");
            log("[ANSWER] Všechny ICE kandidáty odeslány");
        }
    };
    pc.onconnectionstatechange = () => log("[ANSWER] Stav spojení: " + pc.connectionState);
};

// připojení (PC1 po vložení Answeru)
document.getElementById("connect").onclick = async () => {
    if (!pc) {
        log("❌ Nejprve vytvoř spojení kliknutím na 'Vytvořit' (PC1) nebo 'Odpovědět' (PC2)!");
        return;
    }
    const answer = JSON.parse(document.getElementById("offer").value);
    log("[CONNECT] Answer přijat: " + JSON.stringify(answer));
    await pc.setRemoteDescription(answer);
    log("[CONNECT] Answer nastaven jako remoteDescription");
    log("✅ Spojení navázáno!");
};

// nastavení data channelu
function setupChannel() {
    log("[CHANNEL] Nastavuji eventy pro DataChannel");
    channel.onopen = () => { log("[CHANNEL] Otevřen"); Start(); };
    channel.onmessage = (e) => {
        log("[CHANNEL] Přijata zpráva: " + e.data);
        let data = e.data;
        if (typeof data === 'string') {
            try {
                data = JSON.parse(data);
            } catch (err) {
                log("[CHANNEL] Zpráva není JSON");
            }
        }
        kontrola(data);
    };
    channel.onclose = () => log("[CHANNEL] Zavřen");
    channel.onerror = (e) => log("[CHANNEL] Chyba: " + e);
}

document.getElementById("send").onclick = () => {
    const msg = document.getElementById("msg").value;
    if (channel && channel.readyState === "open") {
        channel.send(msg);
        log("📤 Odesláno: " + msg);
    } else {
        log("⚠️ Spojení ještě není otevřené");
    }
};

function Start()
{
    document.getElementById("webrtc-section").classList.add("hidden")
    document.getElementById("container").classList.remove("hidden")
}

function vyberOtazky(poradi)
{
    let test = poradi + {"nazev": "Neco"}; // pouze pořadí otázky (1-based)
    channel.send(JSON.stringify(test))
}

function zmenaBarvy(barva,btnId)
{
    let barvaFinnaly = {"nazev": "Barvy", "barva": barva,"btnId": btnId}
    channel.send(JSON.stringify(barvaFinnaly))
}

pc = new RTCPeerConnection({
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
});