/*
 * Name: Alyssa Vo
 * Date: May 6 2020
 * Section: CSE 154 AI
 *
 * This is the JS that retrieves the requested lyrics using the lyrics.ovh
 * API and retrieves the song's information using the last.fm
 * API.
 */

"use strict";
(function() {

  const LYRICS_API_URL = "https://api.lyrics.ovh/v1/";
  const LASTFM_API_KEY = "b0045fa2e3f3936027d02c198f783524";
  const LASTFM_API_URL = "http://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=";
  window.addEventListener("load", init);

  /** Initailizes the submit button for the form*/
  function init() {
    let submitButton = qs("button");
    submitButton.addEventListener("click", submit);
  }

  /** Submits the form and requests the song's information*/
  function submit() {
    toggleViews();
    let artistAndSong = getInputs();
    makeLyricsRequest(artistAndSong[0], artistAndSong[1]);
  }

  /** Toggles between search view and lyrics view */
  function toggleViews() {
    let search = id("search");
    search.classList.toggle("hidden");
    let lyricView = id("lyric-view");
    lyricView.classList.toggle("hidden");
  }

  /**
   * Gathers the user-inputted artist and song title
   * @return {array} array containing user entered artist and song
   */
  function getInputs() {
    let inputs = qsa("input");
    let artistAndSong = [];
    for (let i = 0; i < inputs.length; i++) {
      artistAndSong[i] = inputs[i].value;
    }
    return artistAndSong;
  }

  /**
   * Requests the a given song's lyrics and then displays them
   * @param {String} artist - Artist of the song
   * @param {String} song - title of the song
   */
  function makeLyricsRequest(artist, song) {
    fetch(LYRICS_API_URL + artist + "/" + song)
      .then(checkStatus)
      .then(resp => resp.json())
      .then(buildLyricsPage)
      .catch(handleError);
  }

  /**
   * Constructs the lyrics page
   * @param {JSON} json - a json file containing a song's lyrics
   */
  function buildLyricsPage(json) {
    buildLyrics(json);
    makeSongInfoRequest();
  }

  /**
   * Generates a back button which bring the user back to the search page
   * @return {Element} a button linking back to the search page
   */
  function backButton() {
    let button = gen("button");
    button.setAttribute("type", "button");
    button.textContent = "Back to Search";
    button.addEventListener("click", backToSearch);
    return button;
  }

  /** Switches view back to search and clears lyrics to prepare for next request*/
  function backToSearch() {
    toggleViews();
    let lyricView = id("lyric-view");
    lyricView.innerHTML = "";
  }

  /**
   * Constructs the song information displayed on the right side of the page
   * @param {JSON} json - A json file from last.fm API containing a song's information
   */
  function buildSongInfoDisplay(json) {
    let songDisplay = gen("section");
    songDisplay.id = "song-info";
    id("lyric-view").appendChild(songDisplay);

    let songTitle = gen("h1");
    songTitle.textContent = json.track["name"];
    songDisplay.appendChild(songTitle);

    let artist = gen("h2");
    artist.textContent = "by " + json.track.artist["name"];
    songDisplay.appendChild(artist);

    let tagsTitle = gen("h3");
    tagsTitle.textContent = "Top Tags for this song:";
    songDisplay.appendChild(tagsTitle);

    let tags = generateTags(json);
    songDisplay.appendChild(tags);
    let button = backButton();
    songDisplay.appendChild(button);
  }

  /**
   * Populates the song information display with a song's top tags
   * @param {JSON} json - a JSON file containing the tags of a given song
   * @return {Element} a paragraph containing a song's top tags
   */
  function generateTags(json) {
    let tags = gen("p");
    tags.id = "tags";
    tags.textContent = json.track.toptags.tag[0].name;
    for (let i = 1; i < json.track.toptags.tag.length - 1; i++) {
      tags.textContent += ", " + json.track.toptags.tag[i].name;
    }
    return tags;
  }

  /** Requests a track's info from the last.fm API */
  function makeSongInfoRequest() {
    let artistAndSong = getInputs();
    let artistParam = "&artist=" + artistAndSong[0];
    let songParam = "&track=" + artistAndSong[1];
    fetch(LASTFM_API_URL + LASTFM_API_KEY + artistParam + songParam + "&format=json")
      .then(checkStatus)
      .then(resp => resp.json())
      .then(buildSongInfoDisplay)
      .catch(handleError);
  }

  /**
   * Retrieves a song's lyrics from the API and displays it on the page
   * @param {JSON} json - A JSON file containing a song's lyrics
   */
  function buildLyrics(json) {
    let lyricsPage = gen("section");
    lyricsPage.id = "lyrics";
    let lyricsText = gen("p");
    lyricsText.textContent = json.lyrics;
    id("lyric-view").appendChild(lyricsPage);
    lyricsPage.appendChild(lyricsText);
  }

  /**
   * Displays the user a message when an error occurs
   * @param {Error} err - error generated when an error occurs
   */
  function handleError(err) {
    let message = gen("section");
    let error = gen("p");
    error.textContent = err;
    message.appendChild(error);
    let response = gen("p");
    let resposeText = "Looks like there was an error in finding that song! It might not " +
                      "exist in the database or there might have been a typo. " +
                      "Feel free to try again!";
    response.textContent = resposeText;
    message.appendChild(response);
    let button = backButton();
    message.appendChild(button);
    id("lyric-view").appendChild(message);
  }

  /**
   * Helper function to return the response's result text if successful, otherwise
   * returns the rejected Promise result with an error status and corresponding text
   * @param {object} response - response to check for success/error
   * @return {object} - valid response if response was successful, otherwise rejected
   *                    Promise result
   */
  function checkStatus(response) {
    if (response.ok) {
      return response;
    } else {
      throw Error("Error in request: " + response.statusText);
    }
  }

  /**
   * Shortcut for getElementByID
   * @param {string} id - element ID
   * @return {object} DOM object associated with id.
   */
  function id(id) {
    return document.getElementById(id);
  }

  /**
   * Shortcut for querySelector
   * @param {string} selector - CSS query selector
   * @return {Element} the first element matching the query
   */
  function qs(selector) {
    return document.querySelector(selector);
  }

  /**
   * Shortcut for querySelectorAll
   * @param {string} query - CSS query selector
   * @returns {object[]} array of DOM objects matching the query
   */
  function qsa(query) {
    return document.querySelectorAll(query);
  }

  /**
   * Shortcut for createElement
   * @param {String} elType - type of element to be generated
   * @return {Element} - newly generated element
   */
  function gen(elType) {
    return document.createElement(elType);
  }

})();