let pokemonAmount = 20;
let currentPokemons = 1;
let pokemons = [];
let displayedPokemons = [];

function init() {
    document.getElementById("reload-icon-container").style.display = "none";
    displayedPokemons = pokemons;
    savePokemon();
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
        } catch (error) {
            alert("Pokemon konnte nicht gefunden werden");
        }
    }
    loadPokemon();
}

function loadPokemon() {
    document.getElementById("pokemon-Container").innerHTML = ``;
    document.getElementById("popup-container").style.display = "none";
    for (let i = 0; i < displayedPokemons.length; i++) {
        let pokemon = displayedPokemons[i];
        let id = pokemon.id;
        let types = pokemon.type;
        let image = pokemon.imageUrl;
        let capitalizedType = capitalizeFirstLetter(types);
        let capitalizedName = capitalizeFirstLetter(pokemon.name);
        let pokemonHTML = loadPokemonHTML(id, types, capitalizedName, image, capitalizedType);
        document.getElementById("pokemon-Container").innerHTML += pokemonHTML;
        removeLoadMorePokemonButton();
    }
}

function filterPokemons(pokemonValue) {
    displayedPokemons = pokemons.filter((pokemon) => pokemon.name.includes(pokemonValue));
    if (displayedPokemons.length > 0) {
        loadPokemon();
        hideLoadMorePokemonButton();
    } else {
        alert("Pokemon konnte nicht gefunden werden");
        displayedPokemons = pokemons;
    }
}

function loadPokemonHTML(id, types, capitalizedName, image, capitalizedType) {
    return /*html*/ `
        <div class="pokemonBox" onclick="showPokemonDetails(${id})" id="pokemon-Box-${id}">
            <h3><div id="pokemon-type-font-color-${types}">${id}#</div> <div id="pokemon-type-font-color-${types}">${capitalizedName}</div> <div id="pokemon-type-font-color-${types}"><div>${capitalizedType}</div></h3>
            <div class="pokemon-type-color" id="pokemon-type-color-${types}"><img class="pokemon-img" src="${image}" alt="${capitalizedName}"></div>
        </div>`;
}

function showPokemonDetails(i) {
    let pokemonDetail = pokemons[i - 1];
    let pokemonDetailHTML = pokemonDetailsHTML(pokemonDetail, i);
    document.getElementById("popup-container").style.display = "flex";
    document.getElementById("popup-container").innerHTML = pokemonDetailHTML;
}

function pokemonDetailsHTML(pokemonDetail, i) {
    let id = pokemonDetail.id;
    let types = pokemonDetail.type;
    let image = pokemonDetail.imageUrl;
    let weight = pokemonDetail.weight;
    let height = pokemonDetail.height;
    let capitalizedType = capitalizeFirstLetter(types);
    let capitalizedName = capitalizeFirstLetter(pokemonDetail.name);

    return /*html*/ `
        <div class="pokemonBox" id="pokemon-Box-${i}" onclick="doNotClosePokemonCard(event)">
            <h3>
                <div id="pokemon-type-font-color-${types}">${id}#</div>
                <div id="pokemon-type-font-color-${types}">${capitalizedName}</div>
                <div id="pokemon-type-font-color-${types}">${capitalizedType}</div>
                <div onclick="closePokemonDetails()" class="closeCard" id="close-card">X</div>
            </h3>
            <div class="pokemon-type-color" id="pokemon-type-color-${types}">
                <div id="img-container">
                    <img src="img/left-sign.svg" alt="left-sign" class="arrows left" id="arrow-left" onclick="previousPokemon(event, ${i})">
                    <img class="pokemon-img" src="${image}" alt="${capitalizedName}">
                    <img src="img/right-sign.svg" alt="right-sign" class="arrows right" onclick="nextPokemon(event, ${i})">
                </div>
                <div id="pokemon-detail">
                    <div>${weight}kg</div>
                    <div>Height: ${height}0 cm</div>
                </div>
            </div>
        </div>`;
}

function loadMorePokemon() {
    pokemonAmount += 20;
    currentPokemons += 20;
    savePokemon();
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function checkAndSearchPokemon() {
    let pokemonValue = document.getElementById("pokemonName").value.toLowerCase();
    if (pokemonValue.length >= 3) {
        filterPokemons(pokemonValue);
        document.getElementById("reload-icon-container").style.display = "block";
        document.getElementById("pokemonName").value = "";
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

function closePokemonDetails() {
    document.getElementById("popup-container").style.display = "none";
}

function closePokemonDetailsContainer() {
    document.getElementById("popup-container").style.display = "none";
}

function nextPokemon(event, i) {
    event.stopPropagation();
    i++;
    if (i > pokemons.length) {
        closePokemonDetailsContainer();
    } else {
        showPokemonDetails(i);
    }
}

function previousPokemon(event, i) {
    event.stopPropagation();
    i--;
    if (i <= 0) {
        closePokemonDetailsContainer();
    } else {
        showPokemonDetails(i);
    }
}

function doNotClosePokemonCard(event) {
    event.stopPropagation();
}

function reloadPage() {
    displayedPokemons = pokemons;
    loadPokemon();
    document.getElementById("reload-icon-container").style.display = "none";
}
