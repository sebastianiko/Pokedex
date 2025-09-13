async function init() {
    let [response, error] = await resolve(fetch("bundesland.json"));
    if (response) {
        console.log("Fertig");
    }
    if (error) {
        console.error("Fehler");
    }
}

async function resolve(p) {
    try {
        let response = await p;
        return [response, null];
    } catch (e) {
        console.warn(e);
        return [null, e];
    }
}
