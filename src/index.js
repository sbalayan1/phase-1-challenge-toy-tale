let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  addFormDisplayEvent()
  addFormSubmitEvent()
  fetchToys()
});


function addFormDisplayEvent() {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    addToy = !addToy;
    toyFormContainer.style.display = addToy ? "block" : "none"
  });
}

function fetchToys() {
  fetch('http://localhost:3000/toys')
  .then(res => res.json())
  .then(data => {
    data.forEach(toy => {renderToy(toy)})
  })
}

function renderToy(toy) {
  const container = document.getElementById('toy-collection')
  const card = document.createElement('div')
  const header = document.createElement('h2')
  const img = document.createElement('img')
  const p = document.createElement('p')
  const button = document.createElement('button')

  card.classList.add('card')
  header.textContent = toy.name
  img.src = toy.image
  img.classList.add('toy-avatar')
  p.textContent = `${toy.name} was liked ${toy.likes} times`
  button.textContent = "<3"
  button.classList.add('like-btn')
  button.id = toy.id
  button.addEventListener('click', () => {updateToyLikes(toy, p)})
  card.append(header, img, p, button)
  container.append(card)
}

function addFormSubmitEvent() {
  const form = document.querySelector('.add-toy-form')
  form.addEventListener("submit", (e) => {
    e.preventDefault()
    const newToy = {
      "name": e.target["name"].value,
      "image": e.target["image"].value,
      "likes": 0
    }
    createToy(newToy)
  })
}

function createToy(toy) {
  fetch('http://localhost:3000/toys', {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify(toy)
  })
  .then(res => res.json())
  .then(data => {renderToy(data)})
}

function updateToyLikes(toy, likeElem) {
  const likes = parseInt(likeElem.textContent.split(/liked | times/)[1]) + 1
  // console.log(parseInt(likeElem, 10))

  fetch(`http://localhost:3000/toys/${toy.id}`, {
    method: "PATCH",
    headers: {
      "Content-type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({
      "likes": likes
    })
  })
  .then(res => res.json())
  .then(data => {
    console.log(data, likeElem)
    likeElem.textContent = `${toy.name} was liked ${data.likes} times`
  })
}