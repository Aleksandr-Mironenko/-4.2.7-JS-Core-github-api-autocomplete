class ViewInput {
  constructor() {
    this.app = document.getElementById("app");

    this.searchline = this.createElement("div", "search-line");
    this.searchInput = this.createElement("input", "search-input");
    this.searchline.append(this.searchInput);
    this.app.append(this.searchline);

    this.usersWrapper = this.createElement("div", "users-wrapper");
    this.usersList = this.createElement("div", "users-list");
    this.usersWrapper.append(this.usersList);

    this.main = this.createElement("div", "main");
    this.main.append(this.usersWrapper);

    this.app.append(this.searchline);
    this.app.append(this.usersWrapper);

    this.elOtvet = this.createElement("div", "el-otvet");
    this.thisName = this.createElement("div", "this-name");
    this.thisOwner = this.createElement("div", "this-owner");
    this.thisStars = this.createElement("div", "this-stars");

    this.main.append(this.elOtvet);

    this.app.append(this.main);
  }

  createElement(elementTag, elementClass) {
    const element = document.createElement(elementTag);
    if (elementClass) {
      element.classList.add(elementClass);
    }
    return element;
  }

  createUser(userData) {
    const userElement = this.createElement("div", "user-repos");
    userElement.innerHTML = `<div class="name-in-search">${userData.name}</div>`;
    this.usersList.append(userElement);
    userElement.addEventListener("click", (e) => {
      const reposInfo = this.createElement("div", "repos-info");
      reposInfo.innerHTML = `<div class="info-block">
      <div class="info-full-name">Name: ${userData.name}</div>
      <div class="info-login">Owner: ${userData.owner.login}</div>
      <div class="info-stargazers-count">Stars: ${userData.stargazers_count}</div>
      </div>
      <div class="info-closed"><img src="closed.png"></div>`;

      this.elOtvet.append(reposInfo);

      const infoClosed = reposInfo.querySelector(".info-closed");
      infoClosed.addEventListener("click", (e) => {
        reposInfo.remove();
      });

      this.searchInput.value = "";

      let lists = document.querySelectorAll(".users-list");
      for (let list of lists) {
        list.innerHTML = "";
      }
      this.view.searchInput.dispatchEvent(new Event("input"));
    });
  }
}

class Search {
  constructor(view) {
    this.view = view;
    this.view.searchInput.addEventListener(
      "input",
      this.debounce(this.searchRep.bind(this), 500)
    );
  }
  async searchRep() {
    const searchValue = this.view.searchInput.value;
    if (searchValue) {
      return await fetch(
        `https://api.github.com/search/repositories?q=${searchValue}&per_page=5`
      ).then((res) => {
        if (res.ok) {
          res.json().then((res) => {
            this.clearUsers();
            res.items.forEach((user) => {
              this.view.createUser(user);
            });
          });
        } else {
          this.clearUsers();
        }
      });
    } else {
      this.clearUsers();
      let lists = document.querySelectorAll(".users-list");
      for (let list of lists) {
        list.innerHTML = "";
      }
    }

    //
  }

  clearUsers() {
    this.view.usersList.innerHTML = "";
  }

  debounce(fn, debounceTime) {
    let timeout;
    return function () {
      const fg = () => {
        fn.apply(this, arguments);
      };

      clearTimeout(timeout);

      timeout = setTimeout(fg, debounceTime);
    };
  }
}

const app = new Search(new ViewInput());
