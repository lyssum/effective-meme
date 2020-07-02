/*
 * Name: Alyssa Vo
 * Date: April 1, 2020
 * Section: CSE154 AI
 *
 * This is the JS to implement the submitting
 * of the form for the MadLibs. It also generates
 * the proceeding story created from the Madlibs.
 */

"use strict";
(function() {
  window.addEventListener("load", init);

  /** Listens for click of the submit button */
  function init() {
    let button = qs("button");
    button.addEventListener("click", submit);
  }

  /** Submits the form and sends inputs to the MadLib */
  function submit() {
    let inputs = qsa("input");
    let inputtedWords = [];
    for (let i = 0; i < inputs.length; i++) {
      inputtedWords[i] = inputs[i].value;
    }
    checkBlanks(inputtedWords);
    storeWords(qsa("span.name"), inputtedWords[0]);
    storeWords(qsa(".uniq-blank"), inputtedWords);
    clearPage();
  }

  /**
   * Checks for any blank inputs
   * @param {object} inputs - array of user inputs
   */
  function checkBlanks(inputs) {
    let currWord = "";
    for (let i = 0; i < inputs.length; i++) {
      currWord += inputs[i];
      if (currWord.length === 0) {
        inputs[i] = "[WORD NOT SUBMITTED]";
      }
      currWord = "";
    }
  }

  /**
   * Stores user inputs into MadLib story
   * @param {object} blanks - array of blanks in MadLib to be filled
   * @param {object} enteredWord - user input to be stored
   */
  function storeWords(blanks, enteredWord) {
    if (blanks[0].classList.contains("uniq-blank")) {
      for (let i = 0; i < blanks.length; i++) {
        blanks[i].textContent = enteredWord[i + 1];
      }
    } else {
      for (let i = 0; i < blanks.length; i++) {
        blanks[i].textContent = enteredWord;
      }
    }
  }

  /** Clears the page to prepare for MadLib */
  function clearPage() {
    let wordEntryPage = qsa(".word-entry");
    for (let i = 0; i < wordEntryPage.length; i++) {
      wordEntryPage[i].innerHTML = "";
    }
    showMadLib();
  }

  /** Displays MadLib on page */
  function showMadLib() {
    let enteredWords = qsa("span");
    for (let i = 0; i < enteredWords.length; i++) {
      enteredWords[i].classList.add("entered-words");
    }
    let madLib = qs(".hidden");
    madLib.classList.remove("hidden");
    createHeader();
  }

  /** Created header on MadLib page */
  function createHeader() {
    let heading = gen("h1");
    heading.textContent = "Read your story!";
    qs("header").appendChild(heading);
  }

  /**
   * Shorcut for querySelector
   * @param {object} selector - desired html selector
   * @return {object} first element matching the selector
   */
  function qs(selector) {
    return document.querySelector(selector);
  }

  /**
   * Shorcut for querySelectorAll
   * @param {object} selector - desired html selector
   * @return {NodeList} all elements matching the selector
   */
  function qsa(selector) {
    return document.querySelectorAll(selector);
  }

  /**
   * Shorcut for createElement
   * @param {object} elType - element type
   * @return {object} created element
   */
  function gen(elType) {
    return document.createElement(elType);
  }
})();