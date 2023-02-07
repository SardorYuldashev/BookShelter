let tokenLS = localStorage.getItem("token");
if (tokenLS) {
  location.replace('pages/home.html')
}

const form = document.querySelector('.login__content-form')
const email = document.querySelector('.email');
const password = document.querySelector('.password');
const info = document.querySelector('.login__content-info');

form.addEventListener('submit', (e) => {
  e.preventDefault()
  fetch("https://reqres.in/api/login", {
    method: "POST",
    body: JSON.stringify({
      "email": email.value,
      "password": password.value
    }),
    headers: {
      "Content-Type": "application/json"
    },
  })
    .then(res => res.json())
    .then(data => {
      if (data.token) {
        localStorage.setItem("token", data.token);
        info.textContent = ``;
        location.replace('pages/home.html');

        console.log(data.token);
      } else {
        email.value = '';
        password.value = '';
        info.textContent = `Not found`;
      }
    })
    .catch((error) => { console.log(error) });
});