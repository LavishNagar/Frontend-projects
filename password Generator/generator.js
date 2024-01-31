let h3 = document.querySelector("h3");
let data_length_slider = document.querySelector("[data-length-slider]");
let readonly = document.querySelector(".readonly");
let indecator = document.querySelector(".indecator");
let checkbox1 = document.querySelector("#checkbox1");
let checkbox2 = document.querySelector("#checkbox2");
let checkbox3 = document.querySelector("#checkbox3");
let checkbox4 = document.querySelector("#checkbox4");
let symbols = "`!@#$%^&*()_-=+][}{;:/?}].,<>?";
let copied = document.querySelector(".copied");
let copybutton = document.querySelector(".copybutton");
let generatepassword = document.querySelector(".generatepassword");
let allcheckbox = document.querySelectorAll("input[type=checkbox]");
let checkboxcount = 0;
let password_length=10;
let password = "";


function handleslider() {
  data_length_slider.value = (password_length);
  h3.innerHTML = password_length;
  const min=(data_length_slider.min);
  const max=(data_length_slider.max);
  let percentage= ((password_length-min)*100/(max-min)) ;
  data_length_slider.style.backgroundSize=percentage +"% 100%";
}

function setindecator(color) {
  indecator.style.backgroundColor = color;
  indecator.style.height = "15px";
  indecator.style.width = "15px";
  indecator.style.borderRadius = "50%";
  indecator.style.border = "1px solid black";
  indecator.style.boxShadow = "1px 2px 15px 6px brown";
}

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function generatesymbols() {
  let randomsymbole = getRndInteger(0, symbols.length);
  return symbols.charAt(randomsymbole);

}

function generateUppercase() {
  //UpperCase
  return String.fromCharCode(getRndInteger(65,91));
}
function generateLowercase() {
  //Lowercase
  return String.fromCharCode(getRndInteger(97, 123));
}
function generatenumbers() {
  //numbers
  return getRndInteger(0, 9);
}
function calcStrength() {
  let hasupper = false;
  let haslower = false;
  let hasnum = false;
  let hassymbol = false;
  if (checkbox1.checked) hasupper = true;
  if (checkbox2.checked) haslower = true;
  if (checkbox3.checked) hasnum = true;
  if (checkbox4.checked) hassymbol = true;

  if (hasupper && haslower && (hasnum || hassymbol) >= 8) {
    setindecator("#0f0");
  } else if (
    haslower ||
    (hasupper && (hasnum || hassymbol) && password_length >= 6)
  ) {
    setindecator("#ff0");
  } else {
    setindecator("#f00");
  }
}

async function copyContent() {
  try {
    await navigator.clipboard.writeText(readonly.value);
    copied.innerHTML = "copied";
  } catch (e) {
    copied.innerHTML = "failed";
  }

  copied.classList.add("active");
  setTimeout(() => {
    copied.classList.remove("active");
  }, 2000);
}

data_length_slider.addEventListener("input", function (e) {
  password_length = e.target.value;
  handleslider();
});

copybutton.addEventListener("click", function () {
  if (readonly.value) {
    copyContent();
  }
});

function handlecheckboxchange() {
  checkboxcount = 0;
  allcheckbox.forEach((checkbox) => {
    if (checkbox.checked) {
      checkboxcount++;
    }
  });
  if (password_length < checkboxcount) {
    password_length = checkboxcount;
    handleslider();
  }
}
allcheckbox.forEach((checkbox) => {
  checkbox.addEventListener("change", handlecheckboxchange);
});

function shufflepassword(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  let str = "";
  array.forEach((el) => (str += el));
  return str;
}

generatepassword.addEventListener("click", generate);


function generate() {
    if (checkboxcount == 0) return;

    if (password_length < checkboxcount) {
      password_length = checkboxcount;
      handleslider();
    }

    //remove old password
    password = "";

    //let puts the stuff mentoned by checkboxes
    let funcArr = [];
    
    if (checkbox1.checked) {
      funcArr.push(generateUppercase);
    }
    if (checkbox2.checked) {
      funcArr.push(generateLowercase);
    }
    if (checkbox3.checked) {
      funcArr.push(generatenumbers);
    }
    if (checkbox4.checked) {
      funcArr.push(generatesymbols);
    }

    //comparsery addition
    for (let i = 0; i < funcArr.length; i++) {
      password += funcArr[i]();
    }

    // remaining addition
    for (let i = 0; i < password_length - funcArr.length; i++) {
      let randIdx = getRndInteger(0, funcArr.length);
      password += funcArr[randIdx]();
    }

    // shuffle the password
    password = shufflepassword(Array.from(password));
    console.log(password);
    // show in UI

    readonly.value = password;

    //calculate strength
    calcStrength();
  }
