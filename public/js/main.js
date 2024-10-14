const NANONIZE_URL = '/nanonize';
const SHOW_CLASS = 'show';
const ERROR_CLASS = 'errored';
let canCopy = false;
/* - - - */
const nanonizeBtn = document.getElementById('nanonizeBtn');
const nanonizeInput = document.getElementById('nanonizeInput');
const resultInput = document.getElementById('resultInput');
const errorHolder = document.getElementById('error');
const successHolder = document.getElementById('success');

resultInput.addEventListener('click', copyNanoURL);

async function copyNanoURL(e) {
  const result = resultInput.value;
  if (canCopy) {
    await navigator.clipboard.writeText(result);
    resultInput.value = 'copied to clipboard📋';
    delay(() => {
      resultInput.value = result;
      console.log(result);
    }, 2000);
  }
}

nanonizeBtn.addEventListener('click', () => {
  nanonizeUrl(nanonizeInput.value);
});

async function nanonizeUrl(url) {
  console.log(url);
  if (!url) return showError('Url is required', 3000, true);
  const reqURL = `${NANONIZE_URL}?u=${url}`;
  const response = await fetch(reqURL);
  const responseJSON = await response.json();

  if (response.status == 400) return showError(responseJSON?.message + ' : ' + response.status, 3000, true);

  if (response.status > 400) return showError(responseJSON?.message + ' : ' + response.status, 3000);

  showSuccess(responseJSON?.message, 5000);
  resultInput.value = responseJSON?.data.nano_url;
  canCopy = true;
}

function showError(errorMsg, time, isValidation) {
  errorHolder.textContent = errorMsg;
  errorHolder.classList.add(SHOW_CLASS);
  if (isValidation) {
    changeInputState(1);
    delay(hideError, time);
    delay(changeInputState, time);
    return;
  }
  delay(hideError, time);
}

function hideError() {
  errorHolder.classList.remove(SHOW_CLASS);
  errorHolder.textContent = ' ';
}

// 0 , 1 where 1 = error and 0 the oppesite
function changeInputState(state) {
  if (state) return nanonizeInput.classList.add(ERROR_CLASS);
  nanonizeInput.classList.remove(ERROR_CLASS);
}

function showSuccess(message, time) {
  successHolder.textContent = message;
  successHolder.classList.add(SHOW_CLASS);
  delay(hideSuccess, time);
}

function hideSuccess() {
  successHolder.classList.remove(SHOW_CLASS);
  successHolder.textContent = ' ';
}

function delay(fn, time) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(fn());
    }, time);
  });
}
