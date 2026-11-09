// ============================================================
//  EDIT THIS FILE to update your portfolio. No HTML needed.
//
//  - Release an artifact: set status to "released", fill in
//    title / summary / tags / repo, and set the week.
//  - New class later: add another { ... } block to COURSES.
//    The FIRST course in the list is featured at the top.
//  - Personal / side projects: add them to PROJECTS.
//  - Optional: biome: "space" (or meadow, autumn, desert, snow,
//    volcano) picks the island an artifact sits on in the world map.
// ============================================================

const PROFILE = {
  name: "Ibrahim Cartan",
  tagline: "Computer Science student at the University of Washington",
  github: "https://github.com/IbrahimCart",
  email: "Ibrahim.Cartan@outlook.com",
  linkedin: "https://www.linkedin.com/in/ibrahimcartan/",
  handshake: "https://app.joinhandshake.com/profiles/any5za",
  // Shown in the About me panel when no island is selected. Write it in your own words.
  about: "Hi! I'm Ibrahim, a Computer Science student at the University of Washington. I like building practical tools that people actually use, like a Discord music bot, an AI code reviewer and an iPhone reminder app I made for my mom. This world is my TCSS 490 portfolio: every island is a project, and new ones will appear as I build them."
};

const COURSES = [
  {
    code: "TCSS 490",
    title: "Special Topics in Computing",
    term: "Autumn 2026",
    description: "Projects, AI implementation experiments and weekly progress logs completed throughout the quarter.",
    log: "https://github.com/IbrahimCart/IbrahimCart.github.io/blob/main/LOG.md", // prompt log
    repo: "https://github.com/IbrahimCart/IbrahimCart.github.io",
    artifacts: [
      {
        title: "Portfolio Setup & AI Log",
        status: "released", // "released" | "in-progress" | "upcoming"
        week: 2,
        summary: "My TCSS 490 portfolio, built as a small video-game world. This island is home base: every other artifact is its own island with its own biome, joined to this one by a bridge, and the little islets off the coast are saved for future projects. A pixel version of me walks the bridges toward your cursor, clicking an island opens its card, and the Moonshot launches a rocket to the moon. It is plain HTML, CSS and JavaScript on GitHub Pages with no framework: the islands, bridges, cards and quest log are all generated from one data file, so adding an artifact adds an island. The prompt log for the quarter is linked at the top of the map. Reflection: I started with a simple card grid and rebuilt it as a game one request at a time, checking each version on a local preview and saying what felt wrong, like the map being too zoomed in or the Earth looking too 3D. Describing exactly what was off worked much better than asking for something new from scratch.",
        tags: ["HTML", "CSS", "JavaScript", "SVG", "WebGL", "GitHub Pages"],
        repo: "https://github.com/IbrahimCart/IbrahimCart.github.io",
        demo: ""
      },
      {
        title: "Discord Music Bot",
        status: "released",
        week: 3,
        summary: "A Discord bot that plays music in voice channels. It searches YouTube with a SoundCloud fallback, accepts YouTube, SoundCloud and Spotify links, and supports slash commands for play, skip, pause, resume, queue and stop. Prefetches the next track for faster starts and works on macOS and Windows. Reflection: the hardest part was that Spotify audio cannot be streamed, so the bot has to find the same song on YouTube, and early versions often played the wrong version. Fixing that taught me to make the bot prefer saying it could not find a song over playing the wrong one, and to match tracks by length. I also learned to test the AI-written changes in Discord myself before pushing them, and to keep a log in the repository of what I asked for and what changed.",
        tags: ["Python", "discord.py", "yt-dlp", "Spotify API", "FFmpeg"],
        repo: "https://github.com/IbrahimCart/discord-music-bot",
        demo: "",
        // Slideshow shown at the top of the card. Replace these with real screenshots later:
        // put the PNG/JPG in images/ and change src (keep or edit the alt text and caption).
        images: [
          { src: "images/play-song.svg", alt: "Mockup of the /play command answered with a Now playing message", caption: "Illustration: /play with a song name starts playback" },
          { src: "images/spotify.svg", alt: "Mockup of a Spotify playlist link being queued", caption: "Illustration: paste a Spotify playlist and it queues every track" },
          { src: "images/queue.svg", alt: "Mockup of the /queue command listing upcoming songs", caption: "Illustration: /queue shows what's playing and what's next" },
          { src: "images/controls.svg", alt: "Mockup of the /skip and /pause commands", caption: "Illustration: /skip, /pause, /resume and /stop control playback" }
        ]
      },
      {
        title: "AI Inside It",
        status: "released",
        week: 4,
        summary: "AI GitHub Code Reviewer: a command-line tool that reviews a pull request or git diff with Claude Code running headless. Claude reads the change and reports bugs, security problems and missing tests, and can post them as inline comments on the PR. My own code fetches and filters the diff, then checks every finding against it and drops any that cite a file or line that was never shown. Reflection: keeping the model's job small, one call with no tools, made it easy to tell whether a bad review was the model's fault or my code's. Structured output was not enough on its own, because the model can return valid JSON that points at a line that does not exist, so the checks mattered as much as the prompt.",
        tags: ["Python", "Claude Code", "claude -p", "GitHub CLI", "Git"],
        repo: "https://github.com/IbrahimCart/ai-code-reviewer",
        demo: "",
        images: [
          { src: "images/review-terminal.svg", alt: "Mockup of a terminal running ai-review on a pull request and listing findings by severity", caption: "Illustration: one command reviews a PR and lists what it found" },
          { src: "images/review-real-pr.jpg", alt: "Real screenshot of two review comments posted by the tool on a GitHub pull request: a critical SQL injection finding and a medium finding about a connection that is never closed", caption: "Real screenshot: the tool's review posted on a practice pull request, including a critical SQL injection finding" },
          { src: "images/review-checks.svg", alt: "Mockup of the review checks list showing dropped, moved and kept model findings", caption: "Illustration: my code drops or fixes anything the model got wrong" },
          { src: "images/review-architecture.svg", alt: "Diagram showing which steps the model handles and which are plain code", caption: "Illustration: the model reviews, my code does everything else" }
        ]
      },
      {
        title: "For Someone Else",
        status: "in-progress",
        week: 5,
        summary: "Update, Nov 2: Doses is a small iPhone app I built for my mom and then made general, so anyone can use it. She takes medication twice a day, 12 hours apart, so I asked her what she needs before building anything: one gentle reminder that gets firmer if she misses it, a clear sign of whether she already took it, the date of her last missed dose, a record she can show her doctor, and everything only on her phone with her medications never named. The app starts with her two reminders, Morning and Evening. In Settings anyone can add, rename, retime, switch off or delete reminders (up to 8); the app never suggests a name and nothing leaves the phone. I also gave it a white page, green buttons and confetti when a dose is recorded. You can try a web replica of it right in your browser with the Live demo button. It is running on my own iPhone and its 20 unit tests pass. I have not yet checked that the reminders fire at the right times. I put it on my mom's phone and watched her use it: she recorded a dose, but when she tapped \"I took it\" by accident she did not see how to take it back, because Undo looked like plain text. I made it a clear button that says \"Tapped by mistake? Undo\". Getting it onto a real phone took work: the iPhone simulator would not finish starting on my Mac, so I moved Xcode's files to an external drive and installed it on my phone directly. My first attempt, a pull request to another group's Discord bot, was closed by its maintainers because I had not waited to be assigned the issue, so I switched to someone I can ask and watch. I could not find a partner, so I worked alone, and my professor has not yet replied to my question about that. The plan, team CLAUDE.md and log are in the repository. Due Sun Nov 8. Reflection: When I handed Doses to my mom, I had to show her around the app and teach her how it works. She understood quickly at first, but about two days later I had to do another quick rundown. For example, she accidentally tapped the \"I took it\" button and could not see how to undo it, because the small red Undo text did not look like a button, so I showed her where it was. I then changed it into a full-width button that says \"Tapped by mistake? Undo\". This showed me that something that looks obvious to me is not obvious to others. Next time I would test with her from the beginning: show her each screen and ask her to do one task without help, instead of having her come to me later with a problem. Claude built the app fast, but only watching her use it showed me what was wrong.",
        tags: ["Swift", "SwiftUI", "iOS", "Accessibility"],
        repo: "https://github.com/IbrahimCart/dose-reminder",
        demo: "doses-demo/",
        images: [
          { src: "images/doses-today.png", alt: "Two real screenshots of the Doses Today screen: on the left a Morning card with a green I took it late button and an Evening card not yet due, on the right confetti falling across the whole screen after a dose was recorded", caption: "Real screenshots: Today, with the green button, and the confetti that falls across the whole screen when a dose is recorded" },
          { src: "images/doses-settings.png", alt: "Two real screenshots of Doses: the Settings screen listing the Morning and Evening reminders with on/off switches and an Add a reminder button, and the editor for one reminder with a name, a time and a delete button", caption: "Real screenshots: Settings lists the reminders, and the editor lets you rename, retime or delete one" },
          { src: "images/doses-history.png", alt: "Real screenshot of the Doses History screen showing a Morning dose on Nov 2 recorded late", caption: "Real screenshot: History lists each dose and flags the late ones" }
        ]
      },
      {
        title: "The Moonshot",
        status: "upcoming",
        biome: "space", // launch island: clicking it flies a rocket to the moon
        week: null,
        summary: "Course plan: a five-week project, solo or with a team, bigger than anything I have built before and ideally deployed where real users can reach it. Due Sun Dec 13.",
        tags: [], repo: "", demo: ""
      }
    ]
  }
  // Example for a future class:
  // {
  //   code: "TCSS 4xx", title: "Course name", term: "Winter 2027",
  //   description: "...", log: "", repo: "",
  //   artifacts: [ { title: "...", status: "released", week: 1, summary: "...", tags: [], repo: "", demo: "" } ]
  // },
];

const PROJECTS = [
  // Personal projects show up in an "Other Projects" section once you add one:
  // { title: "My App", summary: "What it does.", tags: ["React"], repo: "", demo: "" }
];
