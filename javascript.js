document.addEventListener("DOMContentLoaded", function() {
  const todoList = new TodoList();

  const url = "http://localhost:3000/tasks";

  const httpMethods = {
    GET: "GET",
    POST: "POST",
    PUT: "PUT",
    DELETE: "DELETE"
  };

  fetch(`${url}`, {
    method: httpMethods.PUT,
    body: JSON.stringify({
      name: "Получать данные с сервера GETTTTTTTT",
      id: "2",
      completed: "true"
    }),
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(result => console.log(result))
    .catch(error => {
      console.error(error, "1 error");
      return error;
    });

  const addButton = document.querySelector(".add-task__button");
  const taskList = document.querySelector(".task-list");
  const input = document.querySelector(".add-task__input");
  const completeButton = document.querySelector(".action__completed");
  const activeButton = document.querySelector(".action__active");
  const allTasks = document.querySelector(".action__alltasks");
  const actionButtons = document.querySelector(".action");

  let id = 0;

  addButton.addEventListener("click", addTask);
  input.addEventListener("keydown", addEnter);
  completeButton.addEventListener("click", renderCompletedTasks);
  activeButton.addEventListener("click", renderActive);
  allTasks.addEventListener("click", renderAlltasks);

  render(todoList.getAll());

  function addTask() {
    if (input.value.trim() == "") {
      return;
    }

    const taskName = input.value;

    todoList.add(taskName, id);

    id++;

    render(todoList.getAll());
    deleteClassFocus();
  }

  function addEnter(e) {
    if (e.code == "Enter") {
      addTask();
    }
  }

  function render(tasks) {
    removeTasks();

    tasks.forEach(item => {
      const li = document.createElement("li");

      li.classList.add("task-list__item");
      li.setAttribute("data-index", item.id);
      li.innerHTML = `<input type="checkbox" ${
        item.completed ? "checked" : ""
      }><span>${
        item.name
      }</span><input type="text" class="hide"><button class="hide">save</button><i class="fa fa-trash-o delete-task"></i>
      `;

      if (item.completed) {
        li.classList.add("_completed");
      }

      const iconDelete = li.lastElementChild;
      const copmleteCheckbox = li.firstElementChild;
      const taskName = li.firstElementChild.nextSibling;
      const taskNameNew = taskName.nextSibling;
      const saveNewNameTask = taskNameNew.nextSibling;

      iconDelete.addEventListener("click", deleteTask);
      copmleteCheckbox.addEventListener("change", changeStatusTask);
      taskName.addEventListener("dblclick", editTask);
      saveNewNameTask.addEventListener("click", saveNewTask);

      taskList.appendChild(li);
    });

    renderCountTasks();
    resetInputValue();
  }

  // TODO: refactor me (без е)
  function renderCompletedTasks(e) {
    deleteClassFocus();
    e.currentTarget.classList.add("focusButton");

    render(todoList.getCompleted());
  }

  // TODO: refactor me (без е)
  function renderActive(e) {
    deleteClassFocus();
    e.currentTarget.classList.add("focusButton");

    render(todoList.getActive());
  }

  // TODO: refactor me
  function renderAlltasks(e) {
    deleteClassFocus();
    e.currentTarget.classList.add("focusButton");

    render(todoList.getAll());
  }

  function deleteTask(event) {
    const id = +event.target.parentElement.getAttribute("data-index");

    todoList.remove(id);
    render(todoList.getAll());
  }

  function resetInputValue() {
    input.value = "";
  }

  function removeTasks() {
    // TODO: без while
    while (taskList.firstChild) {
      taskList.removeChild(taskList.firstChild);
    }
  }

  function changeStatusTask(event) {
    // TODO: убрать дублирование кода
    if (event.target.checked) {
      const id = +event.target.parentElement.getAttribute("data-index");
      todoList.changeStatus(id, true);
      render(todoList.getAll());

      return;
    }

    const id = +event.target.parentElement.getAttribute("data-index");
    todoList.changeStatus(id, false);
    render(todoList.getAll());
  }

  function renderCountTasks() {
    allTasks.innerHTML = `<span>AllTasks:</span> <span>${
      todoList.getAll().length
    }</span>`;
    activeButton.innerHTML = `<span>Active:</span> <span>${
      todoList.getActive().length
    }</span>`;
    completeButton.innerHTML = `<span>Completed:</span> <span>${
      todoList.getCompleted().length
    }</span>`;
  }

  function deleteClassFocus() {
    // TODO: без for
    for (let i = 0; i < actionButtons.children.length; i++) {
      actionButtons.children[i].classList.remove("focusButton");
    }
  }

  // TODO: refactor me
  function editTask(e) {
    e.target.classList.add("hide");
    e.currentTarget.nextSibling.classList.remove("hide");
    e.currentTarget.nextSibling.nextSibling.classList.remove("hide");
    e.currentTarget.nextSibling.value = event.target.innerHTML;
  }

  function saveNewTask(e) {
    const id = +e.target.parentElement.getAttribute("data-index");
    const newName = e.currentTarget.previousSibling.value;
    todoList.changeTaskName(id, newName);

    render(todoList.getAll());
  }
});

// TODO: переделать на Class
function TodoList() {
  this.list = JSON.parse(localStorage.getItem("todoList")) || [];

  this.add = function(name, id) {
    this.list.push({ name: name, completed: false, id: id });

    this.saveTaskToLocalStorage();
  };

  this.getAll = function() {
    return this.list;
  };

  this.getActive = function() {
    const activeTasks = this.list.filter(item => !item.completed);

    return activeTasks;
  };

  this.getCompleted = function() {
    const completedTasks = this.list.filter(item => item.completed);

    return completedTasks;
  };

  this.remove = function(id) {
    const indexDelete = this.list.findIndex(item => item.id == id);
    this.list.splice(indexDelete, 1);

    this.saveTaskToLocalStorage();
  };

  this.changeStatus = function(id, boolean) {
    this.list.forEach(item => {
      if (item.id == id) {
        item.completed = boolean;
      }
    });

    this.saveTaskToLocalStorage();
  };

  this.changeTaskName = function(id, newName) {
    this.list.forEach(item => {
      if (item.id == id) {
        item.name = newName;
      }
    });
    this.saveTaskToLocalStorage();
  };

  this.saveTaskToLocalStorage = function() {
    localStorage.setItem("todoList", JSON.stringify(this.getAll()));
  };

  // this.removeFromLocalStorage = function(id) {};
}
