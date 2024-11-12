let currentPageUrl = 'https://rickandmortyapi.com/api/character';

window.onload = async () => {
    try {
        await loadCharacters(currentPageUrl);
    } catch (error) {
        console.log(error);
        alert('Erro ao carregar cards');
    }

    const nextButton = document.getElementById('next-button');
    nextButton.addEventListener('click', loadNextPage);

    const backButton = document.getElementById('back-button');
    backButton.addEventListener('click', loadPreviousPage);
};

async function loadCharacters(url) {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = ''; // Limpa os resultados anteriores

    try {
        const response = await fetch(url);
        const responseJson = await response.json();

        responseJson.results.forEach((character) => {
            const card = document.createElement("div");
            card.style.backgroundImage = `url('https://rickandmortyapi.com/api/character/avatar/${character.url.replace(/\D/g, "")}.jpeg')`
            card.className = "cards"
            const characterNameBG = document.createElement("div")
            characterNameBG.className = "character-name-bg"
            const characterName = document.createElement("span")
            characterName.className = "character-name"
            characterName.innerText = `${character.name}`
            characterNameBG.appendChild(characterName)
            card.appendChild(characterNameBG)

            card.onclick = () => {
                const modal = document.getElementById("modal")
                modal.style.visibility = "visible"

                const modalContent = document.getElementById("modal-content")
                modalContent.innerHTML = ''

                const characterImage = document.createElement("div")
                characterImage.style.backgroundImage = `url('https://rickandmortyapi.com/api/character/avatar/${character.url.replace(/\D/g, "")}.jpeg')`
                characterImage.className = "character-image"

                const name = document.createElement("span")
                name.className = "character-details"
                name.innerText = `Nome: ${character.name}`

                const status =  document.createElement("span")
                status.className = "character-details"
                status.innerText = `Status: ${convertStatus(character.status)}`

                const species = document.createElement("span")
                species.className = "character-details"
                species.innerText = `Especie: ${convertSpecies(character.species)}`

                const type = document.createElement("span")
                type.className = "character-details"
                type.innerText = `Tipo: ${character.type}`

                const gender = document.createElement("span")
                gender.className = "character-details"
                gender.innerText = `Gênero: ${convertGender(character.gender)}`

                modalContent.appendChild(characterImage)
                modalContent.appendChild(name)
                modalContent.appendChild(status)
                modalContent.appendChild(species)
                modalContent.appendChild(type)
                modalContent.appendChild(gender)
            }

            mainContent.appendChild(card);
        });

        const nextButton = document.getElementById('next-button');
        const backButton = document.getElementById('back-button');
        nextButton.disabled = !responseJson.info.next;
        backButton.disabled = !responseJson.info.prev;

        backButton.style.visibility = responseJson.info.prev ? "visible" : "hidden";

        currentPageUrl = url;

    } catch (error) {
        alert('Erro ao carregar personagens');
    }
}

function hideModal() {
    const modal = document.getElementById("modal")
    modal.style.visibility = "hidden"
}

function convertStatus(status) {
    const statusDoPersonagem = {
        alive: "vivo(a)",
        dead: "morto(a)",
        unknown: "desconhecido(a)"
    };

    return statusDoPersonagem[status.toLowerCase()] || status;
}

function convertSpecies(species) {
    const especies = {
        human: "humano(a)",
        alien: "alien",
        humanoid: "humanóide",
        unknown: "desconhecida",
        mythologicalcreature: "criatura mitológica",
        robot: "robô",
        disease: "doença"
    };

    return especies[species.toLowerCase()] || species;
}

function convertGender(gender) {
    const genero = {
        female: "feminino",
        male: "masculino",
        unknown: "desconhecido"
    };

    return genero[gender.toLowerCase()] || gender;
    
}

async function loadNextPage() {
    if (!currentPageUrl) return;

    try {
        const response = await fetch(currentPageUrl);
        const responseJson = await response.json();

        if (responseJson.info.next) {
            await loadCharacters(responseJson.info.next);
        }
    } catch (error) {
        console.log(error);
        alert('Erro ao carregar a próxima página');
    }
}

async function loadPreviousPage() {
    if (!currentPageUrl) return;

    try {
        const response = await fetch(currentPageUrl);
        const responseJson = await response.json();

        if (responseJson.info.prev) {
            await loadCharacters(responseJson.info.prev);
        }
    } catch (error) {
        console.log(error);
        alert('Erro ao carregar a página anterior');
    }
}
