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
dragElement(document.getElementById("settings"));
dragElement(document.getElementById("files"));
dragElement(document.getElementById("code"));

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
setupWindowControls("settings", ["settingsopen", "settingsdesktopopen"], "settingsclose");
setupWindowControls("files", ["filesopen", "filesdesktopopen"], "filesclose");
setupWindowControls("code", ["codeopen", "codedesktopopen"], "codeclose");


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
addWindowTapHandling(document.getElementById("settings"));
addWindowTapHandling(document.getElementById("files"));
addWindowTapHandling(document.getElementById("code"));


// --- Settings: wallpaper, custom CSS, clear data ---
function applyWallpaper(url) {
  if (url) document.body.style.backgroundImage = "url('" + url + "')";
}

function applyCustomCss(css) {
  var styleTag = document.getElementById("customcss");
  if (!styleTag) {
    styleTag = document.createElement("style");
    styleTag.id = "customcss";
    document.head.appendChild(styleTag);
  }
  styleTag.textContent = css || "";
}

var settingsWallpaper = document.getElementById("settingswallpaper");
var settingsWallpaperApply = document.getElementById("settingswallpaperapply");
var settingsCss = document.getElementById("settingscss");
var settingsCssApply = document.getElementById("settingscssapply");
var settingsClear = document.getElementById("settingsclear");

// Load any saved settings on startup and prefill the fields.
var savedWallpaper = localStorage.getItem("wallpaper");
if (savedWallpaper) {
  applyWallpaper(savedWallpaper);
  if (settingsWallpaper) settingsWallpaper.value = savedWallpaper;
}
var savedCss = localStorage.getItem("custom_css");
if (savedCss) {
  applyCustomCss(savedCss);
  if (settingsCss) settingsCss.value = savedCss;
}

if (settingsWallpaperApply) settingsWallpaperApply.addEventListener("click", function() {
  var url = settingsWallpaper.value.trim();
  localStorage.setItem("wallpaper", url);
  applyWallpaper(url);
});

if (settingsCssApply) settingsCssApply.addEventListener("click", function() {
  var css = settingsCss.value;
  localStorage.setItem("custom_css", css);
  applyCustomCss(css);
});

if (settingsClear) settingsClear.addEventListener("click", function() {
  if (confirm("Clear all saved data? This removes your notes, wallpaper, custom CSS and Spotify login.")) {
    localStorage.clear();
    location.reload();
  }
});


// --- Notepad: NicEdit rich-text editor + persist to localStorage ---
var notepadText = document.getElementById("notepadtext");
var notepadTitleEl = document.querySelector("#notepad .notepadtitle");
var notepadEditorReady = false;
var notepadInstance = null;
// When a file from the Files app is open, edits save back to it (plain text);
// otherwise the notepad is a global rich-text scratchpad.
var notepadFile = null;

function notepadMainEl() {
  return document.querySelector("#notepad .nicEdit-main");
}

function escapeHtml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function saveNotepad() {
  if (!notepadInstance) return;
  if (notepadFile) {
    // Files are plain text — store the editor's text, not its HTML.
    var el = notepadMainEl();
    notepadFile.content = el ? el.innerText : "";
    saveFiles();
  } else {
    localStorage.setItem("notepad_content", notepadInstance.getContent());
  }
}

// NicEdit copies the editor size from the textarea AT INIT TIME, so we must
// initialise it only once the notepad window is visible (otherwise it's 0x0).
function initNotepadEditor() {
  if (notepadEditorReady || !notepadText) return;

  if (typeof nicEditor === "undefined") {
    // Fallback: NicEdit failed to load, behave as a plain textarea.
    notepadText.value = localStorage.getItem("notepad_content") || "";
    notepadText.addEventListener("input", function() {
      if (notepadFile) { notepadFile.content = notepadText.value; saveFiles(); }
      else localStorage.setItem("notepad_content", notepadText.value);
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

  notepadInstance = nicEditors.findEditor("notepadtext");
  notepadInstance.addEvent("keyup", saveNotepad);
  notepadInstance.addEvent("blur", saveNotepad);

  notepadEditorReady = true;
}

// Put the notepad back into its plain global-scratchpad mode.
function notepadShowScratchpad() {
  notepadFile = null;
  if (notepadTitleEl) notepadTitleEl.textContent = "Notepad";
  if (notepadInstance) {
    notepadInstance.setContent(localStorage.getItem("notepad_content") || "");
  }
}

// Load a Files-app file into the notepad as editable text.
function openFileInNotepad(node) {
  openWindow(document.getElementById("notepad"));
  setTimeout(function() {
    initNotepadEditor();
    notepadFile = node;
    if (notepadTitleEl) notepadTitleEl.textContent = node.name;
    var html = escapeHtml(node.content || "").replace(/\n/g, "<br>");
    if (notepadInstance) notepadInstance.setContent(html);
    else if (notepadText) notepadText.value = node.content || "";
  }, 0);
}

// Opening the notepad from its own icon shows the global scratchpad.
["notepadopen", "notepaddesktopopen"].forEach(function(id) {
  var btn = document.getElementById(id);
  if (btn) btn.addEventListener("click", function() {
    // Run after openWindow has made the window visible.
    setTimeout(function() {
      initNotepadEditor();
      notepadShowScratchpad();
    }, 0);
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


/* ============================================================
   Files app — a tiny file manager stored entirely in localStorage.
   The tree is a nested structure of folders and files:
     { name, type: "folder", open: true, children: [...] }
     { name, type: "file" }
   ============================================================ */
var filesTreeEl = document.getElementById("filestree");

function loadFiles() {
  var raw = localStorage.getItem("files_data");
  if (raw) {
    try { return JSON.parse(raw); } catch (e) { /* fall through */ }
  }
  // Default starter tree.
  return {
    name: "root", type: "folder", open: true, children: [
      { name: "Documents", type: "folder", open: true, children: [
        { name: "readme.txt", type: "file", content: "Welcome to NativeOS Files!\n\nDouble-click a .txt file to choose Notepad or the Code editor.\nOther files (like .js or .html) open straight in the Code editor." },
        { name: "hello.js", type: "file", content: "console.log('hello from NativeOS');" }
      ]},
      { name: "Pictures", type: "folder", open: false, children: [] }
    ]
  };
}

function saveFiles() {
  localStorage.setItem("files_data", JSON.stringify(filesRoot));
}

var filesRoot = loadFiles();
var filesSelected = filesRoot; // currently selected node (root by default)

// Walk the tree to find a node's parent (needed for deletion).
function findParent(node, target) {
  if (!node.children) return null;
  for (var i = 0; i < node.children.length; i++) {
    if (node.children[i] === target) return node;
    var found = findParent(node.children[i], target);
    if (found) return found;
  }
  return null;
}

function renderFiles() {
  if (!filesTreeEl) return;
  filesTreeEl.innerHTML = "";
  // Render the root's children (root itself stays implicit).
  filesRoot.children.forEach(function(child) {
    renderNode(child, 0);
  });
}

function renderNode(node, depth) {
  var row = document.createElement("div");
  row.className = "filesrow" + (node === filesSelected ? " selected" : "");
  row.style.paddingLeft = (8 + depth * 16) + "px";

  var caret = document.createElement("span");
  caret.className = "filescaret";
  caret.textContent = node.type === "folder" ? (node.open ? "▾" : "▸") : "";
  row.appendChild(caret);

  var icon = document.createElement("span");
  icon.className = "filesicon";
  icon.textContent = node.type === "folder" ? "📁" : "📄";
  row.appendChild(icon);

  var label = document.createElement("span");
  label.textContent = node.name;
  row.appendChild(label);

  row.addEventListener("click", function(e) {
    e.stopPropagation();
    filesSelected = node;
    if (node.type === "folder") node.open = !node.open;
    saveFiles();
    renderFiles();
  });

  if (node.type === "file") {
    row.addEventListener("dblclick", function(e) {
      e.stopPropagation();
      filesSelected = node;
      openFile(node);
    });
  }

  filesTreeEl.appendChild(row);

  if (node.type === "folder" && node.open) {
    node.children.forEach(function(child) {
      renderNode(child, depth + 1);
    });
  }
}

// Where new items go: into the selected folder, or the selected file's parent.
function targetFolder() {
  if (filesSelected === filesRoot) return filesRoot;
  if (filesSelected.type === "folder") return filesSelected;
  return findParent(filesRoot, filesSelected) || filesRoot;
}

function addItem(type) {
  var name = prompt("Name of new " + type + ":");
  if (!name) return;
  name = name.trim();
  if (!name) return;
  var folder = targetFolder();
  folder.open = true;
  var node = { name: name, type: type };
  if (type === "folder") { node.open = true; node.children = []; }
  folder.children.push(node);
  filesSelected = node;
  saveFiles();
  renderFiles();
}

var filesNewFileBtn = document.getElementById("filesnewfile");
var filesNewFolderBtn = document.getElementById("filesnewfolder");
var filesDeleteBtn = document.getElementById("filesdelete");

if (filesNewFileBtn) filesNewFileBtn.addEventListener("click", function() { addItem("file"); });
if (filesNewFolderBtn) filesNewFolderBtn.addEventListener("click", function() { addItem("folder"); });
if (filesDeleteBtn) filesDeleteBtn.addEventListener("click", function() {
  if (filesSelected === filesRoot) { alert("Select a file or folder to delete."); return; }
  var label = filesSelected.type === "folder"
    ? 'folder "' + filesSelected.name + '" and everything inside it'
    : 'file "' + filesSelected.name + '"';
  if (!confirm("Delete " + label + "?")) return;
  var parent = findParent(filesRoot, filesSelected);
  if (parent) {
    parent.children.splice(parent.children.indexOf(filesSelected), 1);
    filesSelected = filesRoot;
    saveFiles();
    renderFiles();
  }
});

renderFiles();


/* ============================================================
   Opening files: .txt offers a choice of Notepad or Code editor;
   anything else opens straight in the code editor.
   ============================================================ */
var openChooser = document.getElementById("openchooser");
var openChooserTitle = document.getElementById("openchoosertitle");
var openInNotepadBtn = document.getElementById("openinnotepad");
var openInCodeBtn = document.getElementById("openincode");
var openChooserCancel = document.getElementById("openchoosercancel");
var fileAwaitingChoice = null;

function fileExtension(name) {
  var i = name.lastIndexOf(".");
  return i >= 0 ? name.slice(i + 1).toLowerCase() : "";
}

function openFile(node) {
  if (!node || node.type !== "file") return;
  if (fileExtension(node.name) === "txt") {
    // Let the user pick how to open plain-text files.
    fileAwaitingChoice = node;
    if (openChooserTitle) openChooserTitle.textContent = "Open " + node.name;
    if (openChooser) openChooser.style.display = "flex";
  } else {
    openFileInCode(node);
  }
}

if (openInNotepadBtn) openInNotepadBtn.addEventListener("click", function() {
  if (openChooser) openChooser.style.display = "none";
  if (fileAwaitingChoice) openFileInNotepad(fileAwaitingChoice);
  fileAwaitingChoice = null;
});
if (openInCodeBtn) openInCodeBtn.addEventListener("click", function() {
  if (openChooser) openChooser.style.display = "none";
  if (fileAwaitingChoice) openFileInCode(fileAwaitingChoice);
  fileAwaitingChoice = null;
});
if (openChooserCancel) openChooserCancel.addEventListener("click", function() {
  if (openChooser) openChooser.style.display = "none";
  fileAwaitingChoice = null;
});

// "Open" toolbar button opens the selected file (same as double-click).
var filesOpenBtn = document.getElementById("filesopenbtn");
if (filesOpenBtn) filesOpenBtn.addEventListener("click", function() {
  if (filesSelected && filesSelected.type === "file") openFile(filesSelected);
  else alert("Select a file to open.");
});


/* ============================================================
   Code editor — Monaco (the engine behind VS Code), CDN-loaded.
   ============================================================ */
var monacoEditor = null;
var codeCurrentFile = null;
var codeTitleEl = document.getElementById("codetitle");
var codeStatusEl = document.getElementById("codestatus");

// Map file extensions to Monaco language ids.
function monacoLanguage(name) {
  var ext = fileExtension(name);
  var map = {
    js: "javascript", ts: "typescript", json: "json", html: "html", htm: "html",
    css: "css", md: "markdown", py: "python", java: "java", c: "c", cpp: "cpp",
    cs: "csharp", go: "go", rs: "rust", rb: "ruby", php: "php", sh: "shell",
    xml: "xml", yml: "yaml", yaml: "yaml", sql: "sql", txt: "plaintext"
  };
  return map[ext] || "plaintext";
}

function withMonaco(callback) {
  if (monacoEditor) { callback(); return; }
  if (typeof require === "undefined") return; // Monaco loader failed to load.
  // Configure the AMD loader and the cross-origin worker proxy (needed when
  // Monaco is served from a CDN).
  require.config({ paths: { vs: "https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs" } });
  window.MonacoEnvironment = {
    getWorkerUrl: function() {
      var base = "https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/";
      var proxy = "self.MonacoEnvironment={baseUrl:'" + base + "'};" +
                  "importScripts('" + base + "vs/base/worker/workerMain.js');";
      return "data:text/javascript;charset=utf-8," + encodeURIComponent(proxy);
    }
  };
  require(["vs/editor/editor.main"], function() {
    monacoEditor = monaco.editor.create(document.getElementById("monacocontainer"), {
      value: "",
      language: "plaintext",
      theme: "vs-dark",
      automaticLayout: true,
      fontSize: 14,
      minimap: { enabled: true }
    });
    monacoEditor.onDidChangeModelContent(function() {
      if (codeCurrentFile) {
        codeCurrentFile.content = monacoEditor.getValue();
        saveFiles();
        if (codeStatusEl) codeStatusEl.textContent = "saved";
      }
    });
    callback();
  });
}

function openFileInCode(node) {
  openWindow(document.getElementById("code"));
  withMonaco(function() {
    codeCurrentFile = node;
    monaco.editor.setModelLanguage(monacoEditor.getModel(), monacoLanguage(node.name));
    monacoEditor.setValue(node.content || "");
    if (codeTitleEl) codeTitleEl.textContent = node.name;
    if (codeStatusEl) codeStatusEl.textContent = "";
    monacoEditor.layout();
  });
}

// Opening the code editor from its own icon just shows the current buffer.
["codeopen", "codedesktopopen"].forEach(function(id) {
  var btn = document.getElementById(id);
  if (btn) btn.addEventListener("click", function() {
    setTimeout(function() {
      withMonaco(function() {
        if (!codeCurrentFile && codeTitleEl) codeTitleEl.textContent = "Code";
        monacoEditor.layout();
      });
    }, 0);
  });
});
