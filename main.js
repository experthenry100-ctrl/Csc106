// Mobile navigation toggle
const menuBtn = document.getElementById("menu-btn");
const nav = document.getElementById("nav");
menuBtn.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", open);
});

// Academic planner
const taskForm = document.getElementById("task-form");
if (taskForm) {
  const input = document.getElementById("task-input");
  const list = document.getElementById("task-list");
  const count = document.getElementById("task-count");
  const err = document.getElementById("task-error");
  let tasks = [];
  try { tasks = JSON.parse(localStorage.getItem("tasks")) || []; } catch (e) { tasks = []; }

  function save() {
    try { localStorage.setItem("tasks", JSON.stringify(tasks)); } catch (e) {}
  }

  function render() {
    list.innerHTML = "";
    tasks.forEach((task, index) => {
      const li = document.createElement("li");
      if (task.done) li.classList.add("done");
      const box = document.createElement("input");
      box.type = "checkbox";
      box.checked = task.done;
      box.setAttribute("aria-label", "Mark task as completed");
      box.addEventListener("change", () => toggleTask(index));
      const text = document.createElement("span");
      text.textContent = task.text;
      const del = document.createElement("button");
      del.className = "del";
      del.textContent = "Delete";
      del.addEventListener("click", () => deleteTask(index));
      li.append(box, text, del);
      list.appendChild(li);
    });
    const left = tasks.filter(t => !t.done).length;
    count.textContent = tasks.length
      ? left + " of " + tasks.length + " tasks still to do"
      : "No tasks yet. Add your first task above.";
  }

  function addTask(text) {
    tasks.push({ text: text, done: false });
    save(); render();
  }
  function toggleTask(i) { tasks[i].done = !tasks[i].done; save(); render(); }
  function deleteTask(i) { tasks.splice(i, 1); save(); render(); }

  taskForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) { err.textContent = "Type a task before adding it."; return; }
    err.textContent = "";
    addTask(text);
    input.value = "";
    input.focus();
  });
  render();
}

// Contact form validation
const contactForm = document.getElementById("contact-form");
if (contactForm) {
  const fields = ["name", "email", "phone", "message"];
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const digitsOnly = /^\d+$/;

  function check(id) {
    const el = document.getElementById(id);
    const value = el.value.trim();
    let msg = "";
    if (!value) msg = "This field cannot be empty.";
    else if (id === "email" && !emailPattern.test(value)) msg = "Enter a valid email address, like name@example.com.";
    else if (id === "phone" && !digitsOnly.test(value)) msg = "Use digits only, with no spaces, plus sign or dashes.";
    document.getElementById(id + "-err").textContent = msg;
    el.classList.toggle("bad", msg !== "");
    return msg === "";
  }

  fields.forEach(id => document.getElementById(id).addEventListener("blur", () => check(id)));

  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const ok = fields.map(check).every(Boolean);
    const status = document.getElementById("form-ok");
    if (ok) {
      status.textContent = "Thank you, " + document.getElementById("name").value.trim() + ". Your message has been sent.";
      contactForm.reset();
    } else {
      status.textContent = "";
    }
  });
}
