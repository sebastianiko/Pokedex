let pokemonAmount = 20;
let currentPokemons = 1;
let pokemons = [];
let displayedPokemons = [];
let allPokemonIndex = null;

function init() {
    displayedPokemons = pokemons;
    savePokemon();
    document.addEventListener("keydown", handleEscapeToClose);

    document.getElementById("pokedex-logo").addEventListener("click", function () {
        location.reload();
    });
}

async function savePokemon() {
    for (let i = currentPokemons; i <= pokemonAmount; i++) {
        try {
            let url = `https://pokeapi.co/api/v2/pokemon/${i}/`;
            let response = await fetch(url);
            let responseAsJSON = await response.json();
            pokemons.push({
                id: responseAsJSON.id,
                name: responseAsJSON.name,
                type: responseAsJSON.types[0].type.name,
                imageUrl: responseAsJSON.sprites.other["official-artwork"].front_default,
                height: responseAsJSON.height,
                weight: responseAsJSON.weight,
            });
        } catch (error) {}
    }
    loadPokemon();
}

function loadPokemon() {
    document.getElementById("popup-container").style.display = "none";

    document.getElementById("pokemon-Container").innerHTML = "";

    for (let i = 0; i < displayedPokemons.length; i++) {
        let pokemon = displayedPokemons[i];

        let id = pokemon.id;
        let types = pokemon.type;
        let image = pokemon.imageUrl;

        let capitalizedType = capitalizeFirstLetter(types);
        let capitalizedName = capitalizeFirstLetter(pokemon.name);

        let pokemonHTML = loadPokemonHTML(id, types, capitalizedName, image, capitalizedType);
        document.getElementById("pokemon-Container").innerHTML += pokemonHTML;
    }
    document.getElementById("popup-container").style.display = "none";
}

function loadPokemonHTML(id, types, capitalizedName, image, capitalizedType) {
    return /*html*/ `
        <div class="pokemonBox" onclick="showPokemonDetails(${id})" id="pokemon-Box-${id}">
            <h3><div id="pokemon-type-font-color-${types}">${id}#</div> <div id="pokemon-type-font-color-${types}">${capitalizedName}</div> <div id="pokemon-type-font-color-${types}"><div>${capitalizedType}</div></h3>
            <div class="pokemon-type-color" id="pokemon-type-color-${types}"><img class="pokemon-img" src="${image}" alt="${capitalizedName}"></div>
        </div>`;
}

async function searchPokemon() {
    let pokemonValue = document.getElementById("pokemonName").value.toLowerCase();
    try {
        let query = pokemonValue.trim();
        if (query.length < 3) {
            return;
        }

        await ensureAllPokemonIndex();

        let match = null;
        if (allPokemonIndex && Array.isArray(allPokemonIndex.results)) {
            match = allPokemonIndex.results.find((p) => p.name.includes(query));
        }

        if (!match) {
            document.getElementById("popup-container").style.display = "none";
            document.getElementById("pokemon-Container").innerHTML = generateErrorHTML();
            hideLoadMorePokemonButton();
            setTimeout(reloadPageFunctionAfterFailRequest, 2000);
            clearSearchInput();
            return;
        }

        let response = await fetch(match.url);
        if (!response.ok) {
            document.getElementById("popup-container").style.display = "none";
            document.getElementById("pokemon-Container").innerHTML = generateErrorHTML();
            hideLoadMorePokemonButton();
            setTimeout(reloadPageFunctionAfterFailRequest, 2000);
            clearSearchInput();
            return;
        }

        let responseAsJSON = await response.json();
        let capitalizedPokemonName = capitalizeFirstLetter(responseAsJSON.name);
        let types = responseAsJSON.types[0].type.name;
        let capitalizedPokemonType = capitalizeFirstLetter(responseAsJSON.types[0].type.name);
        document.getElementById("popup-container").style.display = "flex";
        let searchPokemonHTML = popupHTML(
            responseAsJSON.id,
            capitalizedPokemonName,
            types,
            capitalizedPokemonType,
            responseAsJSON.sprites.other["official-artwork"].front_default,
            responseAsJSON.weight,
            responseAsJSON.height
        );
        document.getElementById("popup-container").innerHTML = searchPokemonHTML;
        clearSearchInput();
    } catch (error) {
        document.getElementById("popup-container").style.display = "none";
        document.getElementById("pokemon-Container").innerHTML = generateErrorHTML();
        hideLoadMorePokemonButton();
        setTimeout(reloadPageFunctionAfterFailRequest, 2000);
        clearSearchInput();
    }
}

async function ensureAllPokemonIndex() {
    if (allPokemonIndex) {
        return;
    }
    try {
        let res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=2000");
        if (res.ok) {
            allPokemonIndex = await res.json();
        } else {
            allPokemonIndex = { results: [] };
        }
    } catch (_) {
        allPokemonIndex = { results: [] };
    }
}

function clearSearchInput() {
    let input = document.getElementById("pokemonName");
    if (input) {
        input.value = "";
        input.blur();
    }
}

async function loadMorePokemon() {
    showLoadingSpinner(); // Show spinner before loading
    pokemonAmount += 20;
    currentPokemons += 20;
    await savePokemon();
    hideLoadingSpinner(); // Hide spinner after loading is complete
}

function showLoadingSpinner() {
    document.getElementById("loading-spinner").classList.remove("d-none");
    document.getElementById("load-more-pokemon").classList.add("d-none");
}

function hideLoadingSpinner() {
    document.getElementById("loading-spinner").classList.add("d-none");
    document.getElementById("load-more-pokemon").classList.remove("d-none");
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function checkAndSearchPokemon() {
    let pokemonValue = document.getElementById("pokemonName").value;
    if (pokemonValue.length >= 3) {
        searchPokemon();
    }
}

function hideLoadMorePokemonButton() {
    document.getElementById("load-more-pokemon").classList.add("d-none");
}

function removeLoadMorePokemonButton() {
    document.getElementById("load-more-pokemon").classList.remove("d-none");
}

function reloadPageFunctionAfterFailRequest() {
    document.getElementById("pokemon-Container").innerHTML = ``;
    removeLoadMorePokemonButton();
    pokemonAmount = 20;
    currentPokemons = 1;
    loadPokemon(pokemonAmount, currentPokemons);
}

function hidePokemon() {
    document.getElementById("pokemon-Container").innerHTML = ``;
    currentPokemons = 1;
    pokemonAmount = 20;
    loadPokemon();
}

async function showPokemonDetails(i) {
    let url = `https://pokeapi.co/api/v2/pokemon/${i}/`;
    let response = await fetch(url);
    let responseAsJSON = await response.json();
    let types = responseAsJSON.types[0].type.name;
    let capitalizedPokemonName = capitalizeFirstLetter(responseAsJSON.name);
    let capitalizedPokemonType = capitalizeFirstLetter(responseAsJSON.types[0].type.name);

    const stats = {};
    responseAsJSON.stats.forEach((stat) => {
        stats[stat.stat.name.replace("-", "")] = stat.base_stat;
    });

    document.getElementById("popup-container").style.display = "flex";
    let pokemonHTML = pokemonDetailsHTML(
        i,
        responseAsJSON.id,
        capitalizedPokemonName,
        types,
        capitalizedPokemonType,
        responseAsJSON.sprites.other["official-artwork"].front_default,
        responseAsJSON.weight,
        responseAsJSON.height,
        stats
    );
    document.getElementById("popup-container").innerHTML = pokemonHTML;
    removeLoadMorePokemonButton();
}

function closePokemonDetails() {
    document.getElementById("popup-container").style.display = "none";
}

function closePokemonDetailsContainer() {
    document.getElementById("popup-container").style.display = "none";
}

function handleEscapeToClose(event) {
    if (event.key === "Escape" || event.key === "Enter") {
        closePokemonDetailsContainer();
    }
}

function nextPokemon(event, i) {
    event.stopPropagation();
    i++;
    showPokemonDetails(i);
}

function previousPokemon(event, i) {
    event.stopPropagation();
    i--;
    if (i < 1) {
        closePokemonDetailsContainer();
    } else {
        showPokemonDetails(i);
    }
}

function doNotClosePokemonCard(event) {
    event.stopPropagation();
}

function showDetailsPage(event, pokemonId) {
    event.stopPropagation();
    const page1 = document.getElementById(`pokemon-detail-${pokemonId}`);
    const page2 = document.getElementById(`stats-container-${pokemonId}`);
    const isPage1Visible = page1.style.display !== "none";
    if (isPage1Visible) {
        page1.style.display = "none";
        page2.style.display = "flex";
    } else {
        page1.style.display = "flex";
        page2.style.display = "none";
    }
}

//HTML

function loadPokemonHTML(id, types, capitalizedName, image, capitalizedType) {
    return /*html*/ `
        <div class="pokemonBox" onclick="showPokemonDetails(${id})" id="pokemon-Box-${id}">
            <h3><div id="pokemon-type-font-color-${types}">${id}#</div> <div id="pokemon-type-font-color-${types}">${capitalizedName}</div> <div id="pokemon-type-font-color-${types}"><div>${capitalizedType}</div></h3>
            <div class="pokemon-type-color" id="pokemon-type-color-${types}"><img class="pokemon-img" src="${image}" alt="${capitalizedName}"></div>
        </div>`;
}

function popupHTML(id, name, types, type, img, weight, height) {
    return /*html*/ `
        <div class="pokemonBox" onclick="doNotClosePokemonCard(event)">
            <h3>
                <div id="pokemon-type-font-color-${types}">${id}#</div>
                <div id="pokemon-type-font-color-${types}">${name}</div>
                <div id="pokemon-type-font-color-${types}">${type}</div>
                <div onclick="closePokemonDetails()" class="closeCard" id="close-card">X</div>
            </h3>
            <div class="pokemon-type-color" id="pokemon-type-color-${types}">
                <div id="img-container">
                    <img class="pokemon-img" src="${img}" alt="${name}">
                </div>
                <div id="pokemon-detail">
                    <div>${weight}kg</div>
                    <div>Height: ${height}0 cm</div>
                </div>
            </div>
        </div>`;
}

function generateErrorHTML() {
    return /*html*/ `
        <div class="pokemon-fail-Box">404 - Pokemon konnte nicht gefunden werden</div>`;
}

function displayPokemonHTML() {
    document.getElementById("pokemon-Container").innerHTML = /*html*/ `
    <div class="pokemonBox">
        <h3>
            <div id="pokemon-type-font-color-${types}">${responseAsJSON.id}#</div>
            <div id="pokemon-type-font-color-${types}">${capitalizedPokemonName}</div>
            <div id="pokemon-type-font-color-${types}">
            <div>${capitalizedPokemonType}</div>
            <div onclick="hidePokemon()" class="closeCard" id="close-card">X</div>
    </div>
        </h3>
            <div class="pokemon-type-color" id="pokemon-type-color-${types}"><img class="pokemon-img" src="${responseAsJSON.sprites.other["official-artwork"].front_default}" alt="${responseAsJSON.name}"></div>
    </div>`;
}

function pokemonDetailsHTML(i, id, name, types, type, image, weight, height, stats) {
    return /*html*/ `
        <div class="pokemonBox" id="pokemon-Box-${i}" onclick="doNotClosePokemonCard(event)">
            <h3>
                <div id="pokemon-type-font-color-${types}">${id}#</div>
                <div id="pokemon-type-font-color-${types}">${name}</div>
                <div id="pokemon-type-font-color-${types}">${type}</div>
                <div onclick="closePokemonDetails()" class="closeCard" id="close-card">X</div>
            </h3>
            <div class="pokemon-type-color" id="pokemon-type-color-${types}">
                <div id="img-container">
                    <img src="./img/left-sign.svg" alt="left-sign" class="arrows" onclick="previousPokemon(event, ${i})">
                    <img class="pokemon-img" src="${image}" alt="${name}">
                    <img src="./img/right-sign.svg" alt="right-sign" class="arrows" onclick="nextPokemon(event, ${i})">
                </div>
                <div id="pokemon-detail-wrapper">
                    <img src="./img/left-arrow.svg" class="details-arrows" onclick="showDetailsPage(event, ${i})">
                    <div id="pokemon-detail-${i}" class="pokemon-detail-page">
                        <div>${weight}kg</div>
                        <div>Height: ${height}0 cm</div>
                    </div>
                    <div id="stats-container-${i}" class="pokemon-detail-page" style="display: none; align-items: center;">
                        <ul id="stats-list">
                            <li>HP: ${stats.hp}</li>
                            <li>Attack: ${stats.attack}</li>
                            <li>Defense: ${stats.defense}</li>
                        </ul>
                        <ul id="stats-list">
                            <li>Atk: ${stats.specialattack}</li>
                            <li>Def: ${stats.specialdefense}</li>
                            <li>Speed: ${stats.speed}</li>
                        </ul>
                    </div>
                    <img src="./img/right-arrow.svg" class="details-arrows" onclick="showDetailsPage(event, ${i})">
                </div>
            </div>
        </div>`;
}
