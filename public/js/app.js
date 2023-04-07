const HOST_LINK = "https://ione-theme-default-rtdb.firebaseio.com";
const MAIN_CONTENT = document.querySelector(".main-content");
const renderPrice = (priceRange) => {
  const { maximum_price } = priceRange || {};
  const { discount, final_price, regular_price } = maximum_price || {};
  if (discount && discount.percent_off === 0) {
    return `<span class="currentPrice">$${final_price?.value}</span>`;
  } else {
    return `<span class="oldPrice">$${regular_price?.value}</span>
                                <span class="currentPrice">$${
                                  final_price?.value
                                }</span>
                                <span class="salePercent">-${Math.ceil(
                                  discount.percent_off
                                )}%</span>`;
  }
};

const renderProductList = (DOM_ELEMENT, productData) => {
  return productData?.map((item) => {
    const { name, small_image, price_range, url_key } = item || {};

    return (DOM_ELEMENT.innerHTML += `<div class="product-item">
              <div class="product-item__imageContainer">
                  <img src=${small_image.url} alt=${name}>
              </div>
              <div class="product-item__info">
                  <div class="product-item__top">
                      <a class="product-item__name" href="/${url_key}"><span>${name}</span></a>
                      <div class="product-item__price">
                          ${renderPrice(price_range)}
                      </div>
                  </div>
                  <div class="product-item__bottom">
                      <button class="btn-addToCompare">
                          <span>Compare</span>
                      </button>
                      <button class="btn-addToCart">
                          <span>ADD TO CART</span>
                      </button>
                      <button class="btn-addToWishlist">
                          <span>Wishlist</span>
                      </button>
                  </div>
              </div>
          </div>`);
  });
};

const queryProductsData = (json) => {
  const CUSTOM_LINK = `${HOST_LINK}/${json}.json`;
  const DOM_ELEMENT = document.getElementById(json);
  const xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      if (this.response) {
        const data = JSON.parse(this.response);
        const { items } = data;
        renderProductList(DOM_ELEMENT, items);
      } else {
      }
    }
  };
  xhttp.open("GET", CUSTOM_LINK, true);
  xhttp.send();
};

queryProductsData("featured-products");
queryProductsData("hot-gaming-products");
queryProductsData("best-seller-products");

const renderCategoryPage = (category, subCategory) => {
  MAIN_CONTENT.innerHTML = "";
  const CATEGORY_LINK = `${HOST_LINK}/categories/${category}/${subCategory}.json`;
  const xhttp = new XMLHttpRequest();
  let content = `<div class="category-root">
  <h2 class="category-title main-title">${subCategory}</h2>
  <div class="category-headerButtons">
      <button class="category-gridModeClass"></button>
      <button class="category-listModeClass"></button>
  </div>
  <div class="product-list category-product-list"></div>
</div>`;
  MAIN_CONTENT.innerHTML += content;
  const CATEGORY_LIST = document.querySelector(".category-product-list");
  xhttp.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      if (this.response) {
        const data = JSON.parse(this.response);
        renderProductList(CATEGORY_LIST, data);
      }
    }
  };
  const GRID_MODE_BUTTON = document.querySelector(".category-gridModeClass");
  const LIST_MODE_BUTTON = document.querySelector(".category-listModeClass");
  GRID_MODE_BUTTON.addEventListener("click", () => {
    CATEGORY_LIST.classList.remove("list-mode");
  });
  LIST_MODE_BUTTON.addEventListener("click", () => {
    CATEGORY_LIST.classList.toggle("list-mode");
  });
  xhttp.open("GET", CATEGORY_LINK, true);
  xhttp.send();
};

const toggleSignInPopup = document.querySelector(".tooglesignInPopup");
const SIGN_IN_POPUP = document.querySelector(".signInPopup");
const ACCOUNT_TRIGGER = document.querySelector(".header-account");
const SIGN_IN_FORM = document.querySelector(".signIn-form");
const handleToggleClass = (e, element) => {
  e.stopPropagation();
  e.preventDefault();
  element.classList.toggle("content_open");
};

const handleSignIn = (e) => {
  e.preventDefault();
  const USER_LINK = HOST_LINK + "/customers/accounts.json";
  const email = document.querySelector(".input-email").value;
  const password = document.querySelector(".input-password").value;
  if (!email || !password) {
    throw new Error("Please check your form again !");
  }
  const xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      const data = JSON.parse(this.response);
      if (data) {
        let checkAccount = false;
        for (const account in data) {
          if (
            data[account].email === email &&
            data[account].password === password
          ) {
            checkAccount = true;
            break;
          }
        }
        if (checkAccount) {
          localStorage.setItem("user", JSON.stringify({ email }));
          alert("Login successfully !");
          window.location.reload();
        } else {
          alert("Please check your email and password again !");
        }
      }
    }
  };
  xhttp.open("GET", USER_LINK, true);
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.send();
};

const handleSignUp = (e) => {
  e.preventDefault();
  const USER_LINK = HOST_LINK + "/customers/accounts.json";
  const email = document.querySelector(".input-email.signUp").value;
  const password = document.querySelector(".input-password.signUp").value;
  const confirmPassword = document.querySelector(
    ".input-confirmPassword.signUp"
  ).value;
  if (!email || !password || !confirmPassword || password !== confirmPassword) {
    throw new Error("Please check your form again !");
  }
  const xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      alert("Create account successfully !");
      renderSignInPage();
    }
  };
  xhttp.open("POST", USER_LINK, true);
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.send(JSON.stringify({ email, password }));
};
const renderSignUpPage = () => {
  SIGN_IN_POPUP.classList.toggle("content_open");
  MAIN_CONTENT.innerHTML = ` <div class="signUpPage">
  <h2 class="account-title">SIGN UP</h2>
  <form class="signUp-form">
      <div class="input-field">
          <label class="input-label" for="email">Email</label>
          <input class="input-email signUp" id="email" type="text" required />
      </div>
      <div class="input-field">
          <label class="input-label" for="password">Password</label>
          <input class="input-password signUp" id="password" type="password" required />
      </div>
      <div class="input-field">
          <label class="input-label" for="confirmPassword">Confirm Password</label>
          <input class="input-confirmPassword signUp" id="confirmPassword" type="password" required />
      </div>
      <button class="btn-summit" type="submit">SIGN UP</button>
  </form>
  <div class="signIn-rootBottom">
      <span>Don't have an account ?</span>
      <a onclick=("renderSignInPage()")><span>Log In</span></a>
  </div>
</div>`;
  const SIGN_UP_FORM = document.querySelector(".signUp-form");
  SIGN_UP_FORM.addEventListener("submit", handleSignUp);
};

const renderSignInPage = () => {
  MAIN_CONTENT.innerHTML = ` <div class="signInPage">
  <h2 class="account-title">LOG IN</h2>
  <form class="signIn-form">
      <div class="input-field">
          <label class="input-label" for="email">Email</label>
          <input class="input-email" id="email" type="text" required />
          <p class="message-error"></p>
      </div>
      <div class="input-field">
          <label class="input-label" for="password">Password</label>
          <input class="input-password" id="password" type="password" required />
          <p class="message-error"></p>
      </div>
      <button class="btn-summit" type="submit">LOG IN</button>
  </form>
  <div class="signIn-rootBottom">
      <span>Don't have an account ?</span>
      <a onclick=("renderSignUpPage()")><span>Sign Up</span></a>
  </div>
</div>`;
};
SIGN_IN_FORM.addEventListener("submit", handleSignIn);

const ACCOUNT_NAME = document.querySelector(".header-accountName");
if (localStorage.getItem("user")) {
  ACCOUNT_NAME.innerHTML = JSON.parse(localStorage.getItem("user")).email;
  ACCOUNT_TRIGGER.classList.add("isSigned");
} else {
  ACCOUNT_NAME.innerHTML = "Account";
  ACCOUNT_TRIGGER.classList.remove("isSigned");
}

// Toggle Sign In Popup
document.addEventListener("click", (e) => {
  if (!SIGN_IN_POPUP.contains(e.target)) {
    SIGN_IN_POPUP.classList.remove("content_open");
  }
});
ACCOUNT_TRIGGER.addEventListener("click", (e) =>
  handleToggleClass(e, SIGN_IN_POPUP)
);
toggleSignInPopup.addEventListener("click", (e) =>
  handleToggleClass(e, SIGN_IN_POPUP)
);
