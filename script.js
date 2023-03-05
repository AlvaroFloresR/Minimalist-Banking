"use strict";

// -----------------------------------------
//                  ACCOUNT DATA
// -----------------------------------------
// Data
const account1 = {
  owner: "Alvaro Flores",
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2020-05-27T17:01:17.194Z",
    "2020-07-11T23:36:17.929Z",
    "2020-07-12T10:51:36.790Z",
  ],
  currency: "EUR",
  locale: "en-GB", // de-DE
};

const account2 = {
  owner: "Jessica Simpson",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const accounts = [account1, account2];

// -----------------------------------------
//                  Elements
// -----------------------------------------

const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

// -----------------------------------------
//              CUSTOM FUNCTIONS
// -----------------------------------------

const formatCurrency = function (acc, money) {
  // Currency Formatting
  const moneyOptions = {
    style: "currency",
    currency: acc.currency,
  };
  const formattedMov = new Intl.NumberFormat(acc.locale, moneyOptions).format(
    money
  );
  return formattedMov;
};

const calcDaysPassed = function (date1, date2) {
  return Math.abs(date2 - date1) / (1000 * 60 * 60 * 24);
};

const formatMovementDate = function (date) {
  // Days Passed
  const daysPassed = Math.round(calcDaysPassed(new Date(), date));
  const strDate = "";
  if (daysPassed === 0) return "Today";
  if (daysPassed === 1) return "Yesterday";
  if (daysPassed <= 7) return `Days Passed ${daysPassed}`;
  else {
    // Internationalization API
    const dateOptions = {
      // hour: "numeric",
      // minute: "numeric",
      day: "numeric",
      month: "numeric",
      year: "numeric",
      // weekday: "long",
    };
    let locale = navigator.language;
    locale = currentAccount.locale;
    return new Intl.DateTimeFormat(locale, dateOptions).format(date);
  }
};

const displayMovements = function (acc, sort = false) {
  const movements = acc.movements;
  // Sorting Logic with Array Copy
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  // Empty current HTML Container
  containerMovements.innerHTML = "";

  // Iterate for each Element
  movs.forEach(function (element, index, _) {
    // Movement Type
    const type = element > 0 ? "deposit" : "withdrawal";

    // Dates
    const nowDate = new Date(acc.movementsDates[index]);

    const displayDate = formatMovementDate(nowDate);

    // Currency Formatting
    const formattedMov = formatCurrency(acc, element);

    // Template Literal
    let html_template = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      index + 1
    } ${type}</div>
      <div class="movements__date">${displayDate}</div>
      <div class="movements__value">${formattedMov}</div>
    </div>
    `;

    // Insert html to Current view
    containerMovements.insertAdjacentHTML("afterbegin", html_template);
  });
};

const createUsernames = function (accountsArray) {
  accountsArray.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(" ")
      .map((name) => name[0])
      .join("");
  });
};

const calPrintBalance = function (acc) {
  const movements = acc.movements;
  const balance = movements.reduce((acc, curr) => acc + curr, 0);
  // Currency Formatting
  const formattedMov = formatCurrency(acc, balance);

  labelBalance.textContent = `${formattedMov}`;

  // Update Balance in Account
  acc.balance = balance;
};

const calcDisplaySummary = function (acc) {
  // Get data from accounts
  const movements = acc.movements;
  const interestRate = acc.interestRate / 100;

  const incomes = movements
    .filter((ele) => ele > 0)
    .reduce((acc, curr) => acc + curr);

  const out = movements
    .filter((ele) => ele < 0)
    .reduce((acc, curr) => acc + curr);

  const interest = movements
    .filter((ele) => ele >= 0)
    .map((ele) => ele * interestRate)
    .filter((ele) => ele >= 1)
    .reduce((acc, curr) => acc + curr);

  // Display Text
  // Currency Formatting

  labelSumIn.textContent = `${formatCurrency(acc, incomes)}`;
  labelSumOut.textContent = `${formatCurrency(acc, Math.abs(out))}`;
  labelSumInterest.textContent = `${formatCurrency(acc, interest)}`;
};

createUsernames(accounts);

const updateUI = function (acc) {
  displayMovements(acc);

  calPrintBalance(acc);

  calcDisplaySummary(acc);
};

const startLogOutTimer = function () {
  let time = 60 * 5;

  const tick = function () {
    let minutes = String(Math.trunc(time / 60)).padStart(2, "0");
    let seconds = String(time % 60).padStart(2, "0");
    labelTimer.textContent = `${minutes}:${seconds}`;

    // Stop timer
    if (time === 0) {
      clearInterval(bankTimer);
      // Hide Data
      labelWelcome.textContent = "Log in to get started";
      containerApp.style.opacity = 0;
    }
    time--;
  };

  // First Execution
  tick();
  // Update Label Every second
  const bankTimer = setInterval(tick, 1000);

  return bankTimer;
};

// -----------------------------------------
//          EVENT LISTENER & HANDLERS
// -----------------------------------------

let currentAccount; // GLOBAL
let sortState = false;
let globalTimer;

// ! Delete --------   Below ----------
// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 100;
// ! Delete --------   ABOVE ----------

btnLogin.addEventListener("click", function (e) {
  // Prevent form from Reloading Page
  e.preventDefault();

  currentAccount = accounts.find(
    (acc) => acc.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    console.log("LOGIN");

    // Remove Text from login fields
    inputLoginUsername.value = "";
    inputLoginPin.value = "";
    inputLoginPin.blur();

    // Display UI and Welcome Message
    labelWelcome.textContent = `Welcome Back, ${
      currentAccount.owner.split(" ")[0]
    }`;
    containerApp.style.opacity = 100;

    // Internationalization API
    const now = new Date();
    const dateOptions = {
      hour: "numeric",
      minute: "numeric",
      day: "numeric",
      month: "long",
      year: "numeric",
      weekday: "long",
    };
    let locale = navigator.language;
    locale = currentAccount.locale;
    labelDate.textContent = new Intl.DateTimeFormat(locale, dateOptions).format(
      now
    );

    // Start timer and reset if existing
    if (globalTimer) clearInterval(globalTimer);
    globalTimer = startLogOutTimer();

    // Display Movements and summary
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener("click", function (e) {
  // Prevent form from Reloading Page
  e.preventDefault();

  // Amount to Transfer
  const amount = Number(inputTransferAmount.value);
  // Find Username name Object Account
  const receiverAccount = accounts.find(
    (acc) => inputTransferTo.value === acc.username
  );

  // Check if Money is enough
  if (
    amount > 0 &&
    receiverAccount &&
    currentAccount.balance >= amount &&
    receiverAccount?.username !== currentAccount.username
  ) {
    // Transfer Money to Account History
    currentAccount.movements.push(-amount);
    receiverAccount.movements.push(amount);

    // Add Transfer Date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAccount.movementsDates.push(new Date().toISOString());

    // Display Movements and summary
    updateUI(currentAccount);

    // Reset Timer
    clearInterval(globalTimer);
    globalTimer = startLogOutTimer();
  }

  // Clear Buttons
  inputTransferTo.value = inputTransferAmount.value = "";
});

btnLoan.addEventListener("click", function (e) {
  // Prevent form from Reloading Page
  e.preventDefault();

  // Get Loan
  const loanAmount = Math.floor(inputLoanAmount.value);

  // Check condition for loan
  if (
    loanAmount > 0 &&
    currentAccount.movements.some((ele) => ele >= loanAmount * 0.1)
  ) {
    // Add Registry of Loan
    currentAccount.movements.push(loanAmount);

    // Add Transfer Date
    currentAccount.movementsDates.push(new Date().toISOString());

    // Display Movements and summary
    updateUI(currentAccount);

    // Clear Fields
    inputLoanAmount.value = "";

    // Reset Timer
    clearInterval(globalTimer);
    globalTimer = startLogOutTimer();
  }
});

btnClose.addEventListener("click", function (e) {
  // Prevent form from Reloading Page
  e.preventDefault();

  // Check Credentials
  if (
    currentAccount.pin === Number(inputClosePin.value) &&
    currentAccount.username === inputCloseUsername.value
  ) {
    // Find Index of Current Account
    const index = accounts.findIndex(
      (ele) => ele.username === currentAccount.username
    );

    console.log(index);
    // Mutate Account Array
    accounts.splice(index, 1);

    // Hide Data
    labelWelcome.textContent = "Log in to get started";
    containerApp.style.opacity = 0;

    // Clear Buttons
    inputClosePin.value = inputCloseUsername.value = "";
  }
});

btnSort.addEventListener("click", function (e) {
  // Prevent form from Reloading Page
  e.preventDefault();

  // Request Sort
  sortState = !sortState;
  displayMovements(currentAccount, sortState);
});

// -----------------------------------------
//                  MOVEMENTS
// -----------------------------------------

const currencies = new Map([
  ["USD", "United States dollar"],
  ["EUR", "Euro"],
  ["GBP", "Pound sterling"],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
