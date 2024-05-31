const inputUsername = document.querySelector(".form-username");
const inputPassword = document.querySelector(".form-password");
const btnLogin = document.querySelector(".form-loginBtn");
const btnSignup = document.querySelector(".form-signupBtn");

$(document).ready(function(){
    $('#eye').click(function(){
        $(this).toggleClass('open');
        $(this).children('i').toggleClass('fa-eye-slash fa-eye')
        if($(this).hasClass('open')){
            $(this).prev().attr('type', 'text')
        }
        else{
            $(this).prev().attr('type', 'password')
        }
    });
});

btnLogin.addEventListener("click", (e) => {
    e.preventDefault();
    if (
      inputUsername.value === "" ||
      inputPassword.value === ""
    ) {
        alert("Please enter username and password");
    } else {
      console.log(localStorage.getItem(inputUsername.value));
      const user = JSON.parse(localStorage.getItem(inputUsername.value));
      if (
        user.username == inputUsername.value &&
        user.password == inputPassword.value
      )
      {
        alert("Login successful");
        window.location.href = "main.html";
      }
      else{
        alert("Username or password is incorrect");
      }
    }
});

document.querySelector(".form-signupBtn").addEventListener("click", function(event) {
    event.preventDefault();
    window.location.href = "signup.html";
});