$(function () {

  function printBlock(term, lines) {
    lines.forEach(function (line) {
      if (line && typeof line === "object" && line.type === "link") {
        const link = $("<a>", {
          href: line.url,
          target: "_blank",
          rel: "noopener noreferrer",
          text: line.label
        });
        term.echo(link);
      } else if (line && typeof line === "object" && line.type === "styled") {
        const span = $("<span>", {
          class: line.className,
          text: line.text
        });
        term.echo(span);
      } else {
        term.echo(line);
      }
    });
  }

  function echoLink(term, label, url) {
    const link = $("<a>", {
      href: url,
      target: "_blank",
      rel: "noopener noreferrer",
      text: label.trim()
    });
    term.echo(link);
  }

  const commands = {

    explore: function (term) {
      printBlock(term, CONTENT.explore);
    },

    help: function (term) {
      printBlock(term, CONTENT.explore);
    },

    about: function (term) {
      printBlock(term, CONTENT.about);
    },

    current: function (term) {
      printBlock(term, CONTENT.current);
    },

    projects: function (term) {
      printBlock(term, CONTENT.projects);

      const EXCLUDED_REPOS = ["migueldiazpdj.github.io", "migueldiazpdj"];
 
      fetch("https://api.github.com/users/migueldiazpdj/repos?per_page=100&type=owner")
        .then(function (response) {
          if (!response.ok) {
            throw new Error("GitHub request failed");
          }
          return response.json();
        })
        .then(function (repos) {
          const visibleRepos = repos
            .filter(function (repo) {
              return !repo.fork && EXCLUDED_REPOS.indexOf(repo.name) === -1;
            })
            .sort(function (a, b) {
              return new Date(b.pushed_at) - new Date(a.pushed_at);
            })
            .slice(0, 8);
 
          if (!visibleRepos.length) {
            term.echo(" No public repositories found.");
            return;
          }
 
          visibleRepos.forEach(function (repo) {
            const updated = repo.pushed_at ? new Date(repo.pushed_at).toLocaleDateString("en", { year: "numeric", month: "short", day: "numeric" }) : "unknown";
 
            const metaParts = [];
            if (repo.language) {
              metaParts.push(repo.language);
            }
            if (repo.stargazers_count > 0) {
              metaParts.push("★ " + repo.stargazers_count);
            }
            metaParts.push("updated " + updated);
 
            term.echo($("<span>", { class: "project-name", text: "◆ " + repo.name }));
            if (repo.description) {
              term.echo($("<span>", { class: "project-desc", text: "  " + repo.description }));
            }
            term.echo($("<span>", { class: "project-meta", text: "  " + metaParts.join("  ·  ") }));
            echoLink(term, "  " + repo.html_url, repo.html_url);
            term.echo("");
          });
        })
        .catch(function () {
          term.echo(" Unable to load repositories right now.");
        });
    },

    email: function (term) {
      printBlock(term, CONTENT.email);
    },

    linkedin: function (term) {
      printBlock(term, CONTENT.linkedin);
    },

    github: function (term) {
      printBlock(term, CONTENT.github);
    },

    timeline: function (term) {
      printBlock(term, CONTENT.timeline);
    },

    secret: function (term) {
      printBlock(term, CONTENT.secret);
      window.open("https://www.youtube.com/watch?v=nqAvFx3NxUM&t=48s", "_blank", "noopener,noreferrer");
    }

  };

  const term = $("#term").terminal(
    function (cmd) {
      const clean = cmd.trim().toLowerCase();

      if (clean === "clear" || clean === "cls") {
        this.clear();
        return;
      }

      if (commands[clean]) {
        commands[clean](this);
        return;
      }

      if (clean === "") {
        return;
      }

      this.echo(" unknown command: '" + cmd + "'. try 'explore' for a list of ideas.");
    },
    {
      greetings: false,
      name: "miguel_terminal",
      height: "100%",
      prompt: "> ",
      onInit: function (term) {
        printBlock(term, CONTENT.welcome);
      }
    }
  );

});
