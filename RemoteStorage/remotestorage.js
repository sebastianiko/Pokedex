function onloadFunction() {
    postData("/citys", { ohyeah: "armin" });
    updateData("/name/citys/Los Angeles", { name: "John", country: "USA" });
}

const BASE_URL = "https://join-projekt-f44bb-default-rtdb.europe-west1.firebasedatabase.app/";

async function loadData(path = "") {
    let response = await fetch(BASE_URL + path + ".json");
    return (responseToJSON = await response.json());
}

async function postData(path = "", data = {}) {
    let response = await fetch(BASE_URL + path + ".json", {
        method: "POST",
        header: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    return (responseToJSON = await response.json());
}

async function deleteData(path = "", data = {}) {
    let response = await fetch(BASE_URL + path + ".json", {
        method: "DELETE",
    });
    return (responseToJSON = await response.json());
}

async function updateData(path = "", data = {}) {
    let response = await fetch(BASE_URL + path + ".json", {
        method: "PUT",
        header: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    return (responseToJSON = await response.json());
}
