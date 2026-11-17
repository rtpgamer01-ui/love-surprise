/* PERSONALISE THIS FILE FIRST. Replace the names, message, captions and photos. */
const VERSION = "1.0";

const CONFIG = {
  herName: "My love",
  myName: "Your person",
  photos: [
    {
      file: `photo-1.jpg?v=${VERSION}`,
      caption: "A little moment, forever",
      sub: "EXHIBIT 1 · FROM OUR COLLECTION",
    },
    {
      file: `photo-2.jpg?v=${VERSION}`,
      caption: "The way you make me smile",
      sub: "EXHIBIT 2 · A FAVOURITE MEMORY",
    },
    {
      file: `photo-3.jpg?v=${VERSION}`,
      caption: "My favourite place is beside you",
      sub: "EXHIBIT 3 · THE LITTLE THINGS",
    },
    {
      file: `photo-4.jpg?v=${VERSION}`,
      caption: "One for the memory book",
      sub: "EXHIBIT 4 · JUST US",
    },
    {
      file: `photo-5.jpg?v=${VERSION}`,
      caption: "A day I would live twice",
      sub: "EXHIBIT 5 · OUR COLLECTION",
    },
    {
      file: `photo-6.jpg?v=${VERSION}`,
      caption: "You, being wonderfully you",
      sub: "EXHIBIT 6 · MY FAVOURITE VIEW",
    },
    {
      file: `photo-7.jpg?v=${VERSION}`,
      caption: "More moments, more us",
      sub: "EXHIBIT 7 · ALWAYS",
    },
    {
      file: `photo-8.jpg?v=${VERSION}`,
      caption: "And a thousand more to come",
      sub: "EXHIBIT 8 · TO BE CONTINUED",
    },
  ],
  letter: "...",
};
const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];
const screens = [
  "intro",
  "roses",
  "dedication",
  "preview",
  "door",
  "gallery",
  "puzzle",
  "letter",
  "promises",
];
let current = "intro";
let knocks = 0;
let photoIndex = 0;
let selected = null;
let tiles = [];
let moves = 0;
let startedAt = 0;
let timerHandle = null;
let completed = false;
function personalise() {
  $$("[data-her]").forEach((e) => (e.textContent = CONFIG.herName));
  $$("[data-my]").forEach((e) => (e.textContent = CONFIG.myName));
  $("#letterText").textContent = CONFIG.letter;
}
function go(id) {
  if (!screens.includes(id)) return;
  current = id;
  screens.forEach((s) => $("#" + s).classList.toggle("active", s === id));
  const roomProgress = {
    intro: 0,
    roses: 0,
    dedication: 0,
    preview: 0,
    door: 0,
    gallery: 1,
    puzzle: 2,
    letter: 3,
    promises: 4,
  };
  $$(".progress-dots span").forEach((d, i) =>
    d.classList.toggle("done", i <= roomProgress[id]),
  );
  window.scrollTo({ top: 0, behavior: "smooth" });
  if (id === "puzzle" && !startedAt) shuffle();
}
$$("[data-go]").forEach((b) =>
  b.addEventListener("click", () => go(b.dataset.go)),
);
for (let i = 0; i < 54; i++) {
  const r = document.createElement("i");
  r.textContent = "✿";
  r.style.left = Math.random() * 100 + "%";
  r.style.animationDelay = -Math.random() * 9 + "s";
  r.style.animationDuration = 7 + Math.random() * 8 + "s";
  $("#roseRain").append(r);
}
CONFIG.photos.slice(0, 8).forEach((p) => {
  const im = document.createElement("img");
  im.src = "assets/photos/" + p.file;
  im.alt = "A memory from our collection";
  im.onerror = () => (im.src = "assets/photos/photo-placeholder.svg");
  $("#previewCollage").append(im);
});
$("#preview").addEventListener("click", (e) => {
  if (e.target.closest("button")) return;
  go("door");
});
// Heart blossom tree
for (let i = 0; i < 48; i++) {
  const h = document.createElement("span");
  h.className = "tree-heart";
  h.textContent = i % 5 === 0 ? "♥" : "♥";
  h.style.left = 12 + Math.random() * 76 + "%";
  h.style.top = 15 + Math.random() * 72 + "%";
  h.style.fontSize = 10 + Math.random() * 18 + "px";
  h.style.animationDelay = -Math.random() * 3 + "s";
  $("#treeHearts").append(h);
}
$("#museumDoor").addEventListener("click", () => {
  if (knocks >= 3) return;
  knocks++;
  $("#knockHint").textContent = `Tap the door three times · ${knocks} / 3`;
  $("#museumDoor").animate(
    [
      { transform: "translateX(0)" },
      { transform: "translateX(-5px) rotate(-1deg)" },
      { transform: "translateX(4px) rotate(1deg)" },
      { transform: "translateX(0)" },
    ],
    { duration: 230 },
  );
  if (knocks === 3) {
    $("#museumDoor").classList.add("open");
    $("#knockHint").textContent = "The door is opening for you…";
    setTimeout(() => go("gallery"), 1050);
  }
});
// Gallery with scratch/reveal cover and arrows
function renderPhoto() {
  const p = CONFIG.photos[photoIndex];
  $("#galleryImage").src = "assets/photos/" + p.file;
  $("#galleryImage").onerror = () => {
    $("#galleryImage").src = "assets/photos/photo-placeholder.svg";
  };
  $("#photoCover").classList.remove("revealed");
  $("#photoCaption").textContent = p.caption;
  $("#photoSub").textContent = p.sub;
  $("#galleryCount").textContent =
    `${photoIndex + 1} / ${CONFIG.photos.length}`;
  $("#galleryDots").innerHTML = "";
  CONFIG.photos.forEach((_, i) => {
    const b = document.createElement("button");
    b.className = i === photoIndex ? "active" : "";
    b.setAttribute("aria-label", `Show photo ${i + 1}`);
    b.onclick = () => {
      photoIndex = i;
      renderPhoto();
    };
    $("#galleryDots").append(b);
  });
}
function reveal() {
  $("#photoCover").classList.add("revealed");
}
$("#photoCover").addEventListener("pointerdown", (e) => {
  reveal();
  $("#photoCover").setPointerCapture?.(e.pointerId);
});
$("#photoCover").addEventListener("click", reveal);
$("#photoPrev").onclick = () => {
  photoIndex = (photoIndex + CONFIG.photos.length - 1) % CONFIG.photos.length;
  renderPhoto();
};
$("#photoNext").onclick = () => {
  photoIndex = (photoIndex + 1) % CONFIG.photos.length;
  renderPhoto();
};
renderPhoto();
// Nine-piece sliding-free swap puzzle
const solved = [0, 1, 2, 3, 4, 5, 6, 7, 8];
function shuffle() {
  tiles = [...solved];
  for (let i = tiles.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
  }
  if (tiles.every((v, i) => v === i))
    [tiles[0], tiles[1]] = [tiles[1], tiles[0]];
  moves = 0;
  completed = false;
  startedAt = Date.now();
  $("#moveCount").textContent = "0";
  $("#puzzleMessage").textContent = "Put the pieces back together ♥";
  renderPuzzle();
  if (timerHandle) clearInterval(timerHandle);
  timerHandle = setInterval(updateTimer, 1000);
  updateTimer();
}
function renderPuzzle() {
  const grid = $("#puzzleGrid");
  const probe = new Image();
  probe.onerror = () =>
    $$(".puzzle-tile").forEach(
      (t) =>
        (t.style.backgroundImage =
          "url('assets/photos/photo-placeholder.svg')"),
    );
  probe.src = "assets/photos/photo-1.jpg?v=" + VERSION;
  grid.innerHTML = "";
  tiles.forEach((tile, pos) => {
    const b = document.createElement("button");
    b.className = "puzzle-tile";
    b.dataset.pos = pos;
    b.dataset.index = tile + 1;
    b.style.backgroundPosition = `${(tile % 3) * 50}% ${Math.floor(tile / 3) * 50}%`;
    b.style.backgroundImage = `url('assets/photos/photo-1.jpg?v=${VERSION}')`;
    b.onerror = () => {};
    b.setAttribute(
      "aria-label",
      `Puzzle piece ${tile + 1}, position ${pos + 1}`,
    );
    if (selected === pos) b.classList.add("selected");
    b.addEventListener("click", () => selectTile(pos));
    b.draggable = true;
    b.addEventListener("dragstart", (e) =>
      e.dataTransfer.setData("text/plain", String(pos)),
    );
    b.addEventListener("dragover", (e) => e.preventDefault());
    b.addEventListener("drop", (e) => {
      e.preventDefault();
      const from = Number(e.dataTransfer.getData("text/plain"));
      swap(from, pos);
    });
    grid.append(b);
  });
}
function selectTile(pos) {
  if (completed) return;
  if (selected === null) {
    selected = pos;
    renderPuzzle();
    return;
  }
  if (selected === pos) {
    selected = null;
    renderPuzzle();
    return;
  }
  swap(selected, pos);
}
function swap(a, b) {
  if (a === b) return;
  [tiles[a], tiles[b]] = [tiles[b], tiles[a]];
  selected = null;
  moves++;
  $("#moveCount").textContent = moves;
  renderPuzzle();
  if (tiles.every((v, i) => v === i)) {
    completed = true;
    clearInterval(timerHandle);
    $("#puzzleMessage").textContent =
      `You put us back together in ${moves} moves. ♥`;
    toast("Beautifully restored! ♥");
  }
}
function updateTimer() {
  if (!startedAt) return;
  const s = Math.floor((Date.now() - startedAt) / 1000);
  $("#timer").textContent =
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}
$("#shufflePuzzle").onclick = shuffle;
const peek = () => {
  $$(".puzzle-tile").forEach((b) => (b.style.filter = "brightness(1.2)"));
  $("#puzzleGrid").style.backgroundImage = `url('assets/photos/photo-1.jpg?v=${VERSION}')`;
};
const unpeek = () => {
  $$(".puzzle-tile").forEach((b) => (b.style.filter = ""));
  $("#puzzleGrid").style.backgroundImage = "none";
};
$("#peekBtn").addEventListener("pointerdown", peek);
["pointerup", "pointerleave", "pointercancel"].forEach((ev) =>
  $("#peekBtn").addEventListener(ev, unpeek),
);
// Envelope + letter
$("#envelope").onclick = () => {
  if ($("#envelope").classList.contains("open")) return;
  $("#envelope").classList.add("open");
  $("#envelopeHint").textContent = "A little note, from my heart…";
  setTimeout(() => {
    $("#letterPaper").classList.add("show");
    $("#letterPaper").setAttribute("aria-hidden", "false");
    $("#letterNext").style.display = "inline-block";
  }, 650);
};
$("#letterNext").style.display = "none";
$("#voiceUpload").addEventListener("change", (e) => {
  const f = e.target.files[0];
  if (!f) return;
  const url = URL.createObjectURL(f);
  $("#voicePlayer").src = url;
  $("#voicePlayer").hidden = false;
  $("#audioStatus").textContent = `Ready to play: ${f.name}`;
  $(".upload-btn").textContent = "✓ Voice note added";
});
// Promises seal interaction
$("#sealBtn").onclick = () => {
  const checked = $$("#promiseList input:checked").length;
  $("#sealedStamp").parentElement.classList.add("sealed");
  $("#sealedNote").textContent =
    checked === 5
      ? "Five little promises. One big forever. ♥"
      : `${checked} promise${checked === 1 ? "" : "s"} sealed with love. ♥`;
  $("#sealedStamp").innerHTML = "SEALED<br><small>WITH LOVE</small>";
  $("#sealBtn").textContent = "Sealed with love ♥";
  $("#sealBtn").disabled = true;
  $("#sealBtn").style.opacity = ".8";
  toast("Your promises are sealed ♥");
};
$("#restart").onclick = () => {
  knocks = 0;
  $("#knockHint").textContent = "Tap the door three times · 0 / 3";
  $("#museumDoor").classList.remove("open");
  $("#letterPaper").classList.remove("show");
  $("#letterPaper").setAttribute("aria-hidden", "true");
  $("#envelope").classList.remove("open");
  $("#sealBtn").disabled = false;
  $("#sealBtn").style.opacity = "1";
  $("#sealBtn").textContent = "Seal it ♥";
  $(".promise-card").classList.remove("sealed");
  go("intro");
};
function toast(t) {
  $("#toast").textContent = t;
  $("#toast").classList.add("show");
  setTimeout(() => $("#toast").classList.remove("show"), 2400);
}
$("#howBtn").onclick = () => $("#howDialog").showModal();
$("#closeHow").onclick = () => $("#howDialog").close();
$("#howDialog").addEventListener("click", (e) => {
  if (e.target === $("#howDialog")) $("#howDialog").close();
});
for (let i = 0; i < 42; i++) {
  const c = document.createElement("i");
  c.style.left = Math.random() * 100 + "%";
  c.style.animationDelay = -Math.random() * 8 + "s";
  c.style.animationDuration = 5 + Math.random() * 7 + "s";
  $("#confetti").append(c);
}
personalise();
go("intro");
