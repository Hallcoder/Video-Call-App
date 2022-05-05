const button = document.getElementById("register");

button.addEventListener("click", (e) => {
  e.preventDefault();
  const username = document.getElementById("username").value;
  console.log(username);
  window.location.href = `./call.html?username=${username}`;
});
