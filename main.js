function updateTime() {
    var time = new Date().toLocaleString();
    var timetext = document.querySelector("#thetime");
    timetext.innerHTML = time;
}

setInterval(updateTime, 1000);


// Make the DIV element draggable:
dragElement(document.getElementById("welcome"));
dragElement(document.getElementById("calculator"));
dragElement(document.getElementById("browser"));
dragElement(document.getElementById("spotify"));
dragElement(document.getElementById("notepad"));

// Step 1: Define a function called `dragElement` that makes an HTML element draggable.
function dragElement(element) {
  // Step 2: Set up variables to keep track of the element's position.
  var initialX = 0;
  var initialY = 0;
  var currentX = 0;
  var currentY = 0;

  // Step 3: Check if there is a special header element associated with the draggable element.
  var headerElement = document.getElementById(element.id + "header");
  if (headerElement) {
    // Step 4: If present, assign the `dragMouseDown` function to the header's `onmousedown` event.
    // This allows you to drag the window around by its header.
    headerElement.onmousedown = startDragging;
    // Don't let clicks on inputs/buttons inside the header start a drag or lose focus.
    headerElement.querySelectorAll("input, button").forEach(function(control) {
      control.addEventListener("mousedown", function(e) {
        e.stopPropagation();
      });
    });
  } else {
    // Step 5: If not present, assign the function directly to the draggable element's `onmousedown` event.
    // This allows you to drag the window by holding down anywhere on the window.
    element.onmousedown = startDragging;
  }

  // Step 6: Define the `startDragging` function to capture the initial mouse position and set up event listeners.
  function startDragging(e) {
    e = e || window.event;
    if (e.target.tagName === "INPUT" || e.target.tagName === "BUTTON") return;
    e.preventDefault();
    // Step 7: Get the mouse cursor position at startup.
    initialX = e.clientX;
    initialY = e.clientY;
    // Step 8: Set up event listeners for mouse movement (`elementDrag`) and mouse button release (`closeDragElement`).
    document.onmouseup = stopDragging;
    document.onmousemove = dragElement;
    // Iframes capture mouse events in their own document, which would otherwise
    // swallow the mousemove/mouseup needed to keep tracking the drag.
    document.querySelectorAll("iframe").forEach(function(frame) {
      frame.style.pointerEvents = "none";
    });
  }

  // Step 9: Define the `elementDrag` function to calculate the new position of the element based on mouse movement.
  function dragElement(e) {
    e = e || window.event;
    e.preventDefault();
    // Step 10: Calculate the new cursor position.
    currentX = initialX - e.clientX;
    currentY = initialY - e.clientY;
    initialX = e.clientX;
    initialY = e.clientY;
    // Step 11: Update the element's new position by modifying its `top` and `left` CSS properties.
    element.style.top = (element.offsetTop - currentY) + "px";
    element.style.left = (element.offsetLeft - currentX) + "px";
  }

  // Step 12: Define the `stopDragging` function to stop tracking mouse movement by removing the event listeners.
  function stopDragging() {
    document.onmouseup = null;
    document.onmousemove = null;
    document.querySelectorAll("iframe").forEach(function(frame) {
      frame.style.pointerEvents = "auto";
    });
  }
}



function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function closeWindow(element) {
    element.style.animation = "windowClose 0.3s ease-in forwards"
    wait(300).then(() => {
        element.style.display = "none"
        element.style.animation = ""
    });
}

function openWindow(element) {
    element.style.display = "block"
    biggestIndex++;  // Increment biggestIndex by 1
    element.style.zIndex = biggestIndex;
    topBar.style.zIndex = biggestIndex + 1;
}

function setupWindowControls(windowId, openIds, closeId) {
    var win = document.getElementById(windowId);
    var closeBtn = document.getElementById(closeId);

    closeBtn.addEventListener("click", function() {
        closeWindow(win);
    });

    var ids = Array.isArray(openIds) ? openIds : [openIds];
    ids.forEach(function(openId) {
        var openBtn = document.getElementById(openId);
        openBtn.addEventListener("click", function() {
            openWindow(win);
        });
    });
}

setupWindowControls("welcome", ["welcomeopen","welcomedesktopopen"], "welcomeclose");
setupWindowControls("calculator", ["calculatoropen", "calculatordesktopopen"], "calculatorclose");
setupWindowControls("browser", ["browseropen", "browserdesktopopen"], "browserclose");
setupWindowControls("spotify", ["spotifyopen", "spotifydesktopopen"], "spotifyclose");
setupWindowControls("notepad", ["notepadopen", "notepaddesktopopen"], "notepadclose");


var biggestIndex = 1;
var topBar = document.querySelector("#top")

function addWindowTapHandling(element) {
  element.addEventListener("mousedown", () =>
    handleWindowTap(element)
  )
}

function handleWindowTap(element) {
  biggestIndex++;  // Increment biggestIndex by 1
  element.style.zIndex = biggestIndex;
  topBar.style.zIndex = biggestIndex + 1;
}

addWindowTapHandling(document.getElementById("welcome"));
addWindowTapHandling(document.getElementById("calculator"));
addWindowTapHandling(document.getElementById("browser"));
addWindowTapHandling(document.getElementById("spotify"));
addWindowTapHandling(document.getElementById("notepad"));


// --- Notepad: NicEdit rich-text editor + persist to localStorage ---
var notepadText = document.getElementById("notepadtext");
var notepadEditorReady = false;

// NicEdit copies the editor size from the textarea AT INIT TIME, so we must
// initialise it only once the notepad window is visible (otherwise it's 0x0).
function initNotepadEditor() {
  if (notepadEditorReady || !notepadText) return;

  if (typeof nicEditor === "undefined") {
    // Fallback: NicEdit failed to load, behave as a plain textarea.
    notepadText.value = localStorage.getItem("notepad_content") || "";
    notepadText.addEventListener("input", function() {
      localStorage.setItem("notepad_content", notepadText.value);
    });
    notepadEditorReady = true;
    return;
  }

  // Seed the textarea so NicEdit picks up saved content when it initialises.
  notepadText.value = localStorage.getItem("notepad_content") || "";

  new nicEditor({
    iconsPath: "nicEditorIcons.gif",
    maxHeight: 520,
    buttonList: ["bold", "italic", "underline",
                 "left", "center", "right",
                 "ol", "ul", "fontSize", "fontFamily", "fontFormat", "forecolor", "bgcolor"]
  }).panelInstance("notepadtext");

  var notepadInstance = nicEditors.findEditor("notepadtext");
  function saveNotepad() {
    localStorage.setItem("notepad_content", notepadInstance.getContent());
  }
  notepadInstance.addEvent("keyup", saveNotepad);
  notepadInstance.addEvent("blur", saveNotepad);

  notepadEditorReady = true;
}

// Build the editor the first time the notepad is opened (window now has size).
["notepadopen", "notepaddesktopopen"].forEach(function(id) {
  var btn = document.getElementById(id);
  if (btn) btn.addEventListener("click", function() {
    // Run after openWindow has made the window visible.
    setTimeout(initNotepadEditor, 0);
  });
});


function evaluateExpression(expr) {
  if (!/^[0-9+\-*/.]+$/.test(expr)) return "Error";
  var tokens = expr.match(/(\d+\.?\d*)|[+\-*/]/g);
  if (!tokens || tokens.length === 0) return "Error";

  var stack = [tokens[0]];
  for (var i = 1; i < tokens.length; i += 2) {
    var op = tokens[i];
    var num = tokens[i + 1];
    if (op === "*" || op === "/") {
      var prev = parseFloat(stack.pop());
      var n = parseFloat(num);
      stack.push(op === "*" ? prev * n : prev / n);
    } else {
      stack.push(op, num);
    }
  }

  var result = parseFloat(stack[0]);
  for (var i = 1; i < stack.length; i += 2) {
    var op = stack[i];
    var num = parseFloat(stack[i + 1]);
    result = op === "+" ? result + num : result - num;
  }
  return result;
}

var calcDisplay = document.getElementById("calcdisplay");
var calcButtons = document.querySelectorAll(".calcbutton");
calcButtons.forEach(function(btn) {
  btn.addEventListener("click", function() {
    if (btn.id === "calcequals") {
      calcDisplay.value = evaluateExpression(calcDisplay.value);
    } else if (btn.id === "calcclear") {
      calcDisplay.value = "";
    } else {
      calcDisplay.value += btn.textContent;
    }
  });
});

var browserUrl = document.getElementById("browserurl");
var browserIframe = document.getElementById("browseriframe");

var BROWSER_HOME = "./start.html";
// We track history ourselves because a cross-origin iframe's own history
// isn't readable from this page (same-origin policy).
var browserHistory = [BROWSER_HOME];
var browserIndex = 0;

// Navigate to a new URL (adds a history entry, dropping any forward entries).
function navigateBrowser(url) {
  if (!browserIframe) return;
  browserHistory = browserHistory.slice(0, browserIndex + 1);
  browserHistory.push(url);
  browserIndex = browserHistory.length - 1;
  browserIframe.src = url;
}

function browserBack() {
  if (browserIndex > 0) {
    browserIndex--;
    browserIframe.src = browserHistory[browserIndex];
  }
}

function browserForward() {
  if (browserIndex < browserHistory.length - 1) {
    browserIndex++;
    browserIframe.src = browserHistory[browserIndex];
  }
}

if (browserUrl && browserIframe) {
  browserUrl.addEventListener("keydown", function(e) {
    if (e.key !== "Enter") return;
    var text = browserUrl.value.trim();
    if (text === "") return;

    if (/^https?:\/\//i.test(text)) {
      // Full URL -> load in the browser window.
      navigateBrowser(text);
    } else if (/^[^\s]+\.[^\s]+$/.test(text)) {
      // Looks like a domain -> load in the browser window.
      navigateBrowser("https://" + text);
    } else {
      // A search -> open in a real tab, since search engines block embedding.
      window.open("https://www.google.com/search?q=" + encodeURIComponent(text), "_blank");
    }
  });
}

var browserBackBtn = document.getElementById("browserback");
var browserForwardBtn = document.getElementById("browserforward");
var browserHomeBtn = document.getElementById("browserhome");
if (browserBackBtn) browserBackBtn.addEventListener("click", browserBack);
if (browserForwardBtn) browserForwardBtn.addEventListener("click", browserForward);
if (browserHomeBtn) browserHomeBtn.addEventListener("click", function() {
  navigateBrowser(BROWSER_HOME);
});


/* ============================================================
   Spotify "now playing" app
   ------------------------------------------------------------
   Each user supplies their OWN Spotify Client ID in the app's
   input field (stored in their browser's localStorage).

   To get one: create an app at
   https://developer.spotify.com/dashboard and add this page's
   URL as a Redirect URI (shown in the app), e.g.
   https://os.native.beer/index.html
   ============================================================ */
var SPOTIFY_SCOPES = "user-read-currently-playing user-read-playback-state";
// Redirect back to this exact page (without query string).
var SPOTIFY_REDIRECT_URI = window.location.origin + window.location.pathname;

function spotifyClientId() {
  return localStorage.getItem("spotify_client_id") || "";
}

var spotifyLoginView = document.getElementById("spotifylogin");
var spotifyPlayingView = document.getElementById("spotifyplaying");
var spotifyConnectBtn = document.getElementById("spotifyconnect");
var spotifyLogoutBtn = document.getElementById("spotifylogout");
var spotifyConfigNote = document.getElementById("spotifyconfignote");
var spotifyClientInput = document.getElementById("spotifyclientid");
var spotifyRedirectNote = document.getElementById("spotifyredirect");
var spotifyArt = document.getElementById("spotifyart");
var spotifyTrack = document.getElementById("spotifytrack");
var spotifyArtist = document.getElementById("spotifyartist");
var spotifyStatus = document.getElementById("spotifystatus");
var spotifyPollTimer = null;

// --- PKCE helpers ---
function spotifyRandomString(length) {
  var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var values = crypto.getRandomValues(new Uint8Array(length));
  return Array.from(values).map(function(v) { return chars[v % chars.length]; }).join("");
}

function spotifyBase64Url(buffer) {
  var bytes = new Uint8Array(buffer);
  var str = "";
  for (var i = 0; i < bytes.length; i++) str += String.fromCharCode(bytes[i]);
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function spotifyChallengeFromVerifier(verifier) {
  var data = new TextEncoder().encode(verifier);
  var digest = await crypto.subtle.digest("SHA-256", data);
  return spotifyBase64Url(digest);
}

// --- Auth flow ---
async function spotifyLogin() {
  var clientId = spotifyClientInput ? spotifyClientInput.value.trim() : "";
  if (!clientId) {
    spotifyConfigNote.textContent = "Enter your Spotify Client ID first.";
    return;
  }
  if (window.location.protocol === "file:") {
    spotifyConfigNote.textContent =
      "Spotify login needs an http(s) page, not file://. Serve this folder or open it on its hosted URL.";
    return;
  }
  localStorage.setItem("spotify_client_id", clientId);

  var verifier = spotifyRandomString(64);
  var challenge = await spotifyChallengeFromVerifier(verifier);
  localStorage.setItem("spotify_verifier", verifier);

  var params = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    scope: SPOTIFY_SCOPES,
    redirect_uri: SPOTIFY_REDIRECT_URI,
    code_challenge_method: "S256",
    code_challenge: challenge
  });
  window.location.href = "https://accounts.spotify.com/authorize?" + params.toString();
}

async function spotifyExchangeCode(code) {
  var verifier = localStorage.getItem("spotify_verifier");
  var body = new URLSearchParams({
    client_id: spotifyClientId(),
    grant_type: "authorization_code",
    code: code,
    redirect_uri: SPOTIFY_REDIRECT_URI,
    code_verifier: verifier
  });
  var res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body
  });
  var data = await res.json();
  if (data.access_token) spotifyStoreToken(data);
}

async function spotifyRefreshToken() {
  var refresh = localStorage.getItem("spotify_refresh");
  if (!refresh) return false;
  var body = new URLSearchParams({
    client_id: spotifyClientId(),
    grant_type: "refresh_token",
    refresh_token: refresh
  });
  var res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body
  });
  var data = await res.json();
  if (data.access_token) {
    spotifyStoreToken(data);
    return true;
  }
  return false;
}

function spotifyStoreToken(data) {
  localStorage.setItem("spotify_token", data.access_token);
  localStorage.setItem("spotify_expires", Date.now() + (data.expires_in * 1000));
  if (data.refresh_token) localStorage.setItem("spotify_refresh", data.refresh_token);
}

function spotifyLogout() {
  localStorage.removeItem("spotify_token");
  localStorage.removeItem("spotify_expires");
  localStorage.removeItem("spotify_refresh");
  localStorage.removeItem("spotify_verifier");
  if (spotifyPollTimer) clearInterval(spotifyPollTimer);
  spotifyShowLogin();
}

// --- Now playing ---
async function spotifyValidToken() {
  var token = localStorage.getItem("spotify_token");
  var expires = parseInt(localStorage.getItem("spotify_expires") || "0", 10);
  if (!token) return null;
  if (Date.now() > expires - 10000) {
    var ok = await spotifyRefreshToken();
    if (!ok) return null;
    token = localStorage.getItem("spotify_token");
  }
  return token;
}

async function spotifyFetchNowPlaying() {
  var token = await spotifyValidToken();
  if (!token) { spotifyLogout(); return; }

  var res = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
    headers: { Authorization: "Bearer " + token }
  });

  if (res.status === 204 || res.status === 202) {
    spotifyTrack.textContent = "Nothing playing";
    spotifyArtist.textContent = "";
    spotifyStatus.textContent = "Play something on Spotify";
    spotifyArt.removeAttribute("src");
    return;
  }
  if (!res.ok) return;

  var data = await res.json();
  if (!data || !data.item) {
    spotifyTrack.textContent = "Nothing playing";
    spotifyArtist.textContent = "";
    return;
  }

  spotifyTrack.textContent = data.item.name;
  spotifyArtist.textContent = data.item.artists.map(function(a) { return a.name; }).join(", ");
  spotifyStatus.textContent = data.is_playing ? "▶ Now playing" : "❚❚ Paused";
  if (data.item.album && data.item.album.images && data.item.album.images.length) {
    spotifyArt.src = data.item.album.images[0].url;
  }
}

// --- View switching ---
function spotifyShowLogin() {
  spotifyLoginView.style.display = "flex";
  spotifyPlayingView.style.display = "none";
}

function spotifyShowPlaying() {
  spotifyLoginView.style.display = "none";
  spotifyPlayingView.style.display = "flex";
  spotifyFetchNowPlaying();
  if (spotifyPollTimer) clearInterval(spotifyPollTimer);
  spotifyPollTimer = setInterval(spotifyFetchNowPlaying, 5000);
}

// --- Init ---
if (spotifyConnectBtn) spotifyConnectBtn.addEventListener("click", spotifyLogin);
if (spotifyLogoutBtn) spotifyLogoutBtn.addEventListener("click", spotifyLogout);

// Prefill a previously-entered Client ID and show the redirect URI to register.
if (spotifyClientInput) spotifyClientInput.value = spotifyClientId();
if (spotifyRedirectNote) {
  spotifyRedirectNote.textContent = "Add this as a Redirect URI in your Spotify app: " + SPOTIFY_REDIRECT_URI;
}

(async function spotifyInit() {
  var urlParams = new URLSearchParams(window.location.search);
  var code = urlParams.get("code");
  if (code) {
    // Returned from Spotify auth — exchange code, then clean the URL.
    await spotifyExchangeCode(code);
    window.history.replaceState({}, document.title, SPOTIFY_REDIRECT_URI);
  }
  if (localStorage.getItem("spotify_token")) {
    spotifyShowPlaying();
  } else {
    spotifyShowLogin();
  }
})();

