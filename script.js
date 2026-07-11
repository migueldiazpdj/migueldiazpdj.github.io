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

    work: function (term) {
      printBlock(term, CONTENT.work);
    },

    experience: function (term) {
      printBlock(term, CONTENT.experience);
    },

    education: function (term) {
      printBlock(term, CONTENT.education);
    },

    skills: function (term) {
      printBlock(term, CONTENT.skills);
    },

    projects: function (term) {
      printBlock(term, CONTENT.projects);

      term.echo("");
      term.echo(" Loading your public GitHub repositories...");

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
              return !repo.fork;
            })
            .sort(function (a, b) {
              return new Date(b.pushed_at) - new Date(a.pushed_at);
            })
            .slice(0, 8);

          if (!visibleRepos.length) {
            term.echo(" No public repositories found.");
            return;
          }

          term.echo("");
          term.echo(" Your GitHub projects:");
          term.echo("");

          visibleRepos.forEach(function (repo) {
            const updated = repo.pushed_at ? new Date(repo.pushed_at).toLocaleDateString("en", { year: "numeric", month: "short", day: "numeric" }) : "unknown";
            const stars = repo.stargazers_count > 0 ? " ★ " + repo.stargazers_count : "";
            const language = repo.language ? " | " + repo.language : "";

            term.echo(" -> " + repo.name + stars);
            if (repo.description) {
              term.echo("    " + repo.description);
            }
            term.echo("    updated " + updated + language);
            echoLink(term, repo.html_url, repo.html_url);
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

  term.echo("", { finalize: true });
  term.echo("[status] interactive terminal ready", { finalize: true });

});
