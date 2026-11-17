# A Little Surprise — Romantic Website

A responsive, single-page romantic gift website inspired by the supplied reference video. It includes an animated pink intro, photo placeholders, blossom tree illustration, photo gallery, letter, optional voice-note player, and an opening-envelope final message.

## Run it

1. Extract the ZIP.
2. Open the `love-surprise` folder in VS Code.
3. Install the **Live Server** extension (if you do not already have it).
4. Right-click `index.html` → **Open with Live Server**.

You can also open `index.html` directly in a browser, but Live Server is recommended.

## Personalize it

Open `script.js` and edit the `CONFIG` values at the top:

- `herName`
- `myName`
- `finalMessage`

## Add your photos

Put your own images in `assets/photos/` and name them exactly:

- `photo-1.jpg` — main photo
- `photo-2.jpg` through `photo-7.jpg` — gallery photos

JPG, PNG, and WebP are supported by modern browsers. If you use another extension, update the matching `src` in `index.html`.

## Add a voice note

Open the website, scroll to the letter section, click **Add voice note**, and select an audio file from your computer. The audio is loaded locally in that browser session; it is not uploaded anywhere.

To include the audio permanently for anyone opening the site, place an audio file in `assets/audio/` and add a `<source>` element inside the `audio#voicePlayer` element in `index.html`.

## Customize the words

Edit the paragraphs in the letter section of `index.html`. No real dates or relationship memories have been invented; replace the sample copy with your own words.

## Project files

- `index.html` — page structure and content
- `style.css` — layout, colors, typography, responsive styles, and animations
- `script.js` — personalization and interactions
- `assets/photos/` — your images
- `assets/audio/` — optional permanent voice note
