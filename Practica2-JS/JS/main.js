// obtener formulario
const form = document.getElementById("form");

// obtenerla barra de busqueda
const search = document.getElementById("search");

// obtener el widget del usuario
const usercard=document.getElementById("usercard");

// escuchar el evento submit del form
form.addEventListener("submit", (evt) => {
    evt.preventDefault();
    const username = search.value;
    getUserData(username);
    search.value = "";
})

// obtener la infodel usuario en GitHub
async function getUserData(username) {
    const api = "https://api.github.com/users/";
    try {
        const userRequest = await fetch(api + username);

        if (!userRequest.ok) {
            throw new Error(userRequest.status);
        }

        const UserData = await userRequest.json();

        if (UserData.public_repos) {
            const reposRequest = await fetch(api + username + "/repos");
            const reposData = await reposRequest.json();
            UserData.repos = reposData;
        }

        showUserData(UserData);
    } catch (error) {
        showError(error.message);
    }

}
// funcion para componer e hidratar el html ydel widget
function showUserData(UserData) {
    let usercontent = `
    <img src="${ UserData.avatar_url }" alt="Avatar">
    <h1>${ UserData.name }</h1>
    <p>${ UserData.bio }</p>
            <section class="data">
                <ul>
                    <li>Followers:${ UserData.followers }</li>
                    <li>Following:${ UserData.following }</li>
                    <li>Repos:${ UserData.public_repos }</li>
                </ul>
            </section>`;
            
             if (UserData.repos){
                usercontent += `<section class="repos">`
                
                    UserData.repos.slice(0, 7).forEach(repo => {
                        usercontent += `<a href="${repo.html_url}" target="_blank">${repo.name}</a>`
                    })

                usercontent += `</section>`;

            } 
 
            usercard.innerHTML = usercontent;
}

// funcion para gestionar errores
function showError(error) {
const errorContent =`<h1>Error ⚠️ ${error} </h1>`;
usercard.innerHTML = errorContent;
}