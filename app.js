// ============ GLOBAL VARIABELS ============ //
const endpoint =
  "https://race-dat-v1-default-rtdb.europe-west1.firebasedatabase.app"; // To do: paste url to endpoint
let selectedUser;

// ============ READ ============ //
// Read (GET) all users from Firebase (Database) using REST API
async function readUsers() {
  const response = await fetch(`${endpoint}/users.json`);
  const data = await response.json();
  const users = Object.keys(data).map((key) => ({ id: key, ...data[key] })); // from object to array
  return users;
}

// Create HTML and display all users from given list
function displayUsers(list) {
  // reset <section id="users-grid" class="grid-container">...</section>
  document.querySelector("#users-grid").innerHTML = "";
  //loop through all users and create an article with content for each
  for (const user of list) {
    document.querySelector("#users-grid").insertAdjacentHTML(
      "beforeend",
      /*html*/ `
            <article>
                <h2>${user.name}</h2>
                <img src="${user.image}">
                <p>${user.title}</p>
                <a href="mailto:${user.mail}">${user.mail}</a>
                <div class="btns">
                <button class="btn-update-user">Update</button>
                <button class="btn-delete-user">Delete</button>
                </div>
            </article>
        `
    );
    document
      .querySelector("#users-grid article:last-child .btn-update-user")
      .addEventListener("click", () => selectUser(user));
    document
      .querySelector("#users-grid article:last-child .btn-update-user")
      .addEventListener("click", () => selectUser(user));
    // To do: Add event listeners
  }
}

// ============ CREATE ============ //
// Create (POST) user to Firebase (Database) using REST API
async function createUser(event) {
  event.preventDefault();
  console.log("Opret bruger");
  const name = event.target.name.value;
  const mail = event.target.mail.value;
  const image = event.target.image.value;
  const title = event.target.title.value;

  // To do: add variables with reference to input fields (event.target.xxxx.value)

  // create a new user
  const newUser = { name, mail, image, title }; // To do: add all fields/ variabels
  const userAsJson = JSON.stringify(newUser);
  const response = await fetch(`${endpoint}/users.json`, {
    method: "POST",
    body: userAsJson,
  });

  if (response.ok) {
    // if success, update the users grid
    updateUsersGrid();
    // To do: make sure to update the users grid in order to display the new user
    // and scroll to top
    scrollToTop();
    // To do: call scrollToTop to scroll when created
  }
}

// ============ UPDATE ============ //
function selectUser(user) {
  console.log(user);
  // Set global varaiable
  selectedUser = user;
  // reference to update form
  const form = document.querySelector("#form-update");

  form.name.value = user.name;
  form.title.value = user.title;
  form.image.value = user.image;
  form.mail.value = user.mail;

  // To do: set form input values with user.xxxx

  form.scrollIntoView({ behavior: "smooth" });
}

async function updateUser(event) {
  event.preventDefault();

  // To do: add variables with reference to input fields (event.target.xxxx.value)
  const name = event.target.name.value;
  const mail = event.target.mail.value;
  const image = event.target.image.value;
  const title = event.target.title.value;
  // update user
  const userToUpdate = { name, mail, image, title }; // To do: add all fields/ variabels
  const userAsJson = JSON.stringify(userToUpdate);
  const response = await fetch(`${endpoint}/users/${selectedUser.id}.json`, {
    method: "PUT",
    body: userAsJson,
  });
  if (response.ok) {
    // if success, update the users grid
    updateUsersGrid();
    // To do: make sure to update the users grid in order to display the new user
    // and scroll to top
    scrollToTop();
    // To do: call scrollToTop to scroll when created
  }
}

// ================== DELETE ============ //
async function deleteUser(id) {
  console.log(id);
  const response = await fetch(`${endpoint}/users/${id}.json`, {
    method: "DELETE",
  });
  if (response.ok) {
    updateUsersGrid();
    // if success, update the users grid
    scrollToTop();
    // To do: make sure to update the users grid in order to display the new user
  }
}
document.querySelector("#form-create").addEventListener("submit", createUser);
document.querySelector("#form-update").addEventListener("submit", updateUser);
// ================== Events and Event Listeners ============ //
// To do: add submit event listener to create form (#form-create)
// To do: add submit event listener to update form (#form-update)

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

async function updateUsersGrid() {
  const users = await readUsers();
  displayUsers(users);
}

// ============ Init CRUD App ============ //
updateUsersGrid(); // To do: call/ run updateUsersGrid to initialise the app
