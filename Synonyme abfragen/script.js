async function getSynonyms() {
    let query = document.getElementById("query").value;
    let url = `https://www.openthesaurus.de/synonyme/search?q=${query}&format=application/json`;

    let response = await fetch(url);
    let responseAsJSON = await response.json();
    let synsets = responseAsJSON["synsets"];
    renderSynsets(synsets);
}

function renderSynsets(synsets) {
    let container = document.getElementById("container");
    container.innerHTML = /*html*/ `<div>Es wurden <b>${synsets.length}</b> Synonyme geladen</div>`;

    for (let i = 0; i < synsets.length; i++) {
        const synset = synsets[i];
        let terms = synset["terms"];
        container.innerHTML += /*html*/ `<h2>Synonym mit Id ${synset["id"]}</h2>`;

        for (let j = 0; j < terms.length; j++) {
            const term = terms[j];
            container.innerHTML += /*html*/ `<div>${term["term"]}</div>`;
        }
    }
}
