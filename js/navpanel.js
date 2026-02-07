class NavPanel extends HTMLElement {
  connectedCallback() {
    const main = this.getAttribute("main");
    this.innerHTML = `
      <div id='nav-panel' class="${main ? "main" : "notmain"}">
        <h1 class="title"><a href="/">Hello, I'm Jan<a></h1>

        <section class="section">
            <ul class="socials">
              <li>
                <a href="mailto:jan@nejka.net" aria-label="Email">
                  <img src="https://cdn.simpleicons.org/maildotru/666666" alt="" width="18" height="18" />
                </a>
              </li>

              <li>
                <a href="https://github.com/JanGolicnik" rel="me" aria-label="GitHub">
                  <img src="https://cdn.simpleicons.org/github/666666" alt="" width="18" height="18" />
                </a>
              </li>

              <li>
                <a href="https://discord.com/users/gjany" aria-label="Discord">
                  <img src="https://cdn.simpleicons.org/discord/666666" alt="" width="18" height="18" />
                </a>
              </li>
          </ul>
        </section>

        <section class="section">
            <p>I'm primarily a game engine dev, interested in graphics.</p>
        </section>

        <section class="section hideifnotmain">
          <a href="/work.html">Work and education</a>
        </section>

        <section class="section hideifnotmain">
            <p>These are some of my projects:</p>
            <ul id="projects-ul">
            </ul>
        </section>

        <section class="section bottom hideifnotmain">
          2026 Jan Goličnik
        </section>
      <div>
    `;
  }
}

customElements.define("nav-panel", NavPanel);
