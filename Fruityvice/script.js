async function loadFruits() {
    let url = "https://www.fruityvice.com/api/fruit/all";
    let response = await fetch(url);
    let responseAsJSON = await response.json();

    let fruits = document.getElementById("fruit");
    fruits.innerHTML += /*html*/ `<p>Dir werden <b>${responseAsJSON.length}</b> Früchte angezeigt:</p><ul>`;

    for (let i = 0; i < responseAsJSON.length; i++) {
        fruits.innerHTML += /*html*/ `<ul><b>${i + 1}.</b> ${responseAsJSON[i].name} ${responseAsJSON[i].family}  kcal: ${responseAsJSON[i].nutritions["calories"]} ${responseAsJSON[i].order} ${responseAsJSON[i].nutritions["protein"]}</ul>`;
    }

    fruits.innerHTML += "</ul>";
}
