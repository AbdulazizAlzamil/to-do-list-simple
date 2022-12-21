const taskAdder = document.getElementById("task_adder");
const inputTxt = document.getElementById("input_text");
const btnAdd = document.getElementById("btn_add");
const currentTasks = document.querySelector(".current_tasks");

let hint = document.createElement("div");
hint.classList.add("hint");
hint.appendChild(document.createTextNode(currentTasks.dataset.hint));
currentTasks.appendChild(hint);
hint.style.cssText = `color: var(--clr-light-gray);
                      user-select: none;`;

class Task {
  constructor(text, id) {
    this.text = text;
    this.id = id;
  }
}

inputTxt.focus();
let tasks = [];
tasks.push(...getLocalStorage());
loadUI();

// Adding task
btnAdd.addEventListener("click", (e) => {
  e.preventDefault();
  if (inputTxt.value.trim()) {
    let newTask = new Task(inputTxt.value, Date.now());
    tasks.push(newTask);
    addTaskToUI(newTask);
    setLocalStorage(tasks);
    if (currentTasks.children.length) {
      document.querySelector(".hint").style.display = "none";
    }
    inputTxt.value = "";
    inputTxt.focus();
    
  } else if(inputTxt.value.length != inputTxt.value.trim().lenght) {
    inputTxt.value = "";
    showErrorMsg();
  } else {
    showErrorMsg();
  }
});

// Deleting task
currentTasks.addEventListener("click", (e) => {
  if (e.target.classList.contains("btn_delete")) {
    e.target.parentElement.remove();
    deleteTaskFromLocalStorage(e.target.parentElement.dataset.id);
    if (
      document.querySelector(".hint").style.display == "none" &&
      getLocalStorage().length < 1
    ) {
      document.querySelector(".hint").style.display = "block";
    }
  }
});

onkeydown = (e) => {
  if (e.key == "Enter") {
    btnAdd.click();
  }
};

function addTaskToUI(task) {
  let newTask = `
      <div class="task" data-id="${task.id}">
        <p class="task_text">${task.text}</p>
        <div class="btn_delete"></div>
      </div>
    `;
  currentTasks.innerHTML += newTask;
}

function deleteTaskFromLocalStorage(taskId) {
  let tmp = getLocalStorage();
  tmp = tmp.filter((task) => task.id != taskId);
  setLocalStorage(tmp);
  tasks = tmp;
}

function getLocalStorage() {
  return localStorage.getItem("tasks")
    ? JSON.parse(localStorage.getItem("tasks"))
    : "";
}

function setLocalStorage(data) {
  localStorage.setItem("tasks", JSON.stringify(data));
}

function showErrorMsg() {
  let errorMsg = document.createElement("div");
  errorMsg.classList.add("err");
  errorMsg.style.cssText = "color: var(--clr-red);";
  errorMsg.textContent = "Please fill in the field";
  if (!taskAdder.lastElementChild.classList.contains("err"))
    taskAdder.lastChild.after(errorMsg);

  setTimeout(() => {
    if (taskAdder.children.length > 2)
      taskAdder.children[taskAdder.children.length - 1].remove();
  }, 3000);
}

function loadUI() {
  if (getLocalStorage()) {
    getLocalStorage().forEach((task) => {
      addTaskToUI(task);
    });

    if (getLocalStorage().length)
      document.querySelector(".hint").style.display = "none";
  }
}
