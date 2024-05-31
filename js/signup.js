// validation form register and register user local storage
const inputUsernameRegister = document.querySelector(".form-username");
const inputPasswordRegister = document.querySelector(".form-password");
const inputCFPassword = document.querySelector(".form-cfpassword");
const btnRegister = document.querySelector(".form-signupBtn");
const btnLogin = document.querySelector(".form-loginBtn");
// import bcrypt from 'bcrypt';

// export default bcrypt;

$(document).ready(function(){
    $('#eye-pw').click(function(){
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

$(document).ready(function(){
  $('#eye-cf').click(function(){
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

// validation form register and register user local storage

btnRegister.addEventListener("click", (e) => {
  e.preventDefault();
  if (
    inputUsernameRegister.value === "" ||
    inputPasswordRegister.value === "" ||
    inputCFPassword.value === ""
  ) {
    alert("Please enter username and password");
  } else {
    const username = inputUsernameRegister.value;

    // Check if username already exists in local storage
    if (localStorage.getItem(username) !== null) {
      alert("Username already exists");
    } else {
      if (inputCFPassword.value !== inputPasswordRegister.value) {
        alert("Password and confirmation password do not match");
      } else {
        const user = {
          username: username,
          password: inputPasswordRegister.value,
        };

        // Uncomment the lines below if you want to hash the password
        // const salt = bcrypt.genSaltSync(10);
        // user.password = bcrypt.hashSync(user.password, salt);

        let json = JSON.stringify(user);
        localStorage.setItem(username, json);
        alert("Registration successful");
        window.location.href = "login.html";
      }
    }
  }
});

document.querySelector(".form-loginBtn").addEventListener("click", function(event) {
    event.preventDefault();
    window.location.href = "login.html";
});
