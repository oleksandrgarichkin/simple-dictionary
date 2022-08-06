"use strict";
const inputWord = document.querySelector(".input_search");
const searchForm = document.querySelector(".search");
const resultBlock = document.querySelector(".result");

//Render result of search
const renderResult = function (markup) {
  resultBlock.innerHTML = "";
  resultBlock.insertAdjacentHTML("afterbegin", markup);
};

//Generate Error Markup
const generateErrorMarkup = function (err) {
  const markup = `<div class='heading-block'>
  <h2 class="word">We can't find this word</h2>
  </div>
  <div class='phonetic-block'>
  <p>Please, try another one</p>
  </div>`;
  renderResult(markup);
};

//Generate Markup of search result
const generateMarkup = function (data) {
  let markup = `
    <div class='heading-block'>
    <h2 class="word">${data.word}</h2>
    </div>
    
    <div class='phonetic-block'>`;

  //adding to markup audio
  data.phonetics.forEach((phonetic) => {
    return phonetic.audio
      ? (markup += `
      <div class='phonetic-row'>
        <p class='country'>${phonetic.audio.slice(-6, -4)}:</p>
          <p class="transcription">${phonetic.text}</p>
          <p class="audio-pronanciation" data-mp3="${phonetic.audio}">
          <svg xmlns="http://www.w3.org/2000/svg" class="icon-audio" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
        </svg>
        </p></div>`)
      : "";
  });
  markup += `</div>`;

  //Adding to markup definition
  data.meanings.forEach((meaning) => {
    return (markup += `<div class ='definition-block'>
                <p class="part_of_speech">${meaning.partOfSpeech}</p>
                <ul class='definition-list'>
               
                ${meaning.definitions
                  .map((def) => {
                    return `<li class="definition" > ${def.definition}</li>`;
                  })
                  .join("")}
                </ul>
                </div>`);
  });
  renderResult(markup);
};

//API functionality
const apiConnect = async function (request) {
  try {
    let result = {};
    const res = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${request}`
    );
    console.log(res);
    const [data] = await res.json();
    console.log(data);
    if (!res.ok) throw new Error(`${res.status}`);
    console.log(data);
    generateMarkup(data);
  } catch (err) {
    console.error(`${err}`);
    generateErrorMarkup(err);
  }
};

//Event handlers
searchForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const request = inputWord.value;
  apiConnect(request);
  inputWord.value = "";
  resultBlock.vale = "";
  header.scrollIntoView({
    behavior: "smooth",
  });
  inputWord.focus();
});

resultBlock.addEventListener("click", function (e) {
  if (!e.target.closest(".icon-audio")) return;

  const audio = new Audio(e.target.closest(".audio-pronanciation").dataset.mp3);
  audio.play();
  inputWord.focus();
});

////sticky search block
const header = document.querySelector(".header");
const searchBlock = document.querySelector(".search-block");
const searchBlockHeight = searchBlock.getBoundingClientRect().height;
const options = {
  root: null,
  threshold: 0,
  rootMargin: `-${searchBlockHeight}px`,
};
const callback = function (entries, ovserver) {
  const [entry] = entries;
  if (!entry.isIntersecting) {
    searchBlock.classList.add("sticky");
  } else {
    searchBlock.classList.remove("sticky");
  }
};
const observer = new IntersectionObserver(callback, options);
observer.observe(header);

window.addEventListener("load", function (event) {
  inputWord.focus();
});
