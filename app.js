const input = document.querySelector("#todoInput");
const addBtn = document.querySelector("#addBtn");
const errorMessage = document.querySelector("#errorMsg");
const ul = document.querySelector("#todoList");
const emptyStateSpan = document.querySelector("#emptyStateSpan");
const emptyStatePara = document.querySelector("#emptyStatePara");
const filterBtn = document.querySelectorAll(".filter-btn");
const totalTasks = document.querySelector("#totalTasks");
const activeTasks = document.querySelector("#activeTasks");
const completedTasks = document.querySelector("#completedTasks");
let todos = [];

function addTodo(newTodoObject){
  emptyStateSpan.style.display = "none";
  emptyStatePara.style.display = "none";

  const li = document.createElement("li");
  li.classList.add("todo-item");
  li.dataset.id = newTodoObject.id;
  
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.classList.add("checkbox");
  checkbox.addEventListener("click", function(event){
    const toCheckLi = event.target.closest("li");
    const id = toCheckLi.dataset.id;
    isCompleted(id);
  })
  
  const span = document.createElement("span");
  span.classList.add("todo-text");
  span.textContent = newTodoObject.text;
  
  const actionsDiv = document.createElement("div");
  actionsDiv.classList.add("todo-actions");
  
  const editBtn = document.createElement("button");
  editBtn.classList.add("edit-btn");
  editBtn.innerHTML = "<i class='fa-solid fa-pen-to-square' aria-hidden='true'></i>"; 
  editBtn.setAttribute("aria-label", "Edit todo");
  editBtn.addEventListener("click", function(evt){
    const toEditLi = evt.target.closest("li");
    const id = toEditLi.dataset.id;
    editTodo(id);
  })

  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("delete-btn");
  deleteBtn.innerHTML = "<i class='fa-solid fa-trash' aria-hidden='true'></i>"; 
  deleteBtn.setAttribute("aria-label" , "Delete todo");
  deleteBtn.addEventListener("click" , function(evt){ 
    const toDeleteLi = evt.target.closest("li");
    const id = toDeleteLi.dataset.id;
    deleteTodo(id); 
  });
  
  actionsDiv.appendChild(editBtn);
  actionsDiv.appendChild(deleteBtn);
  li.appendChild(checkbox);
  li.appendChild(span);
  li.appendChild(actionsDiv);

  totalTasks.textContent = todos.length;
  activeTasks.textContent = todos.length;
  
  return li;
}

function emptyInput() {
  errorMsg.classList.add("show");
  input.classList.add("error");
  input.addEventListener("input", () => {
    input.classList.remove("error");
    errorMsg.classList.remove("show");
  });
}

addBtn.addEventListener("click" , function(){
    const todoInput = input.value.trim();
    if(!todoInput) emptyInput();
    else{
    const newTodoObject = {
      id: Date.now(),
      text: todoInput,
      completed: false
    }
    addTodoToArray(newTodoObject);
    ul.appendChild(addTodo(newTodoObject));
    input.value = "";
    input.focus();
    }
})

input.addEventListener("keydown" , function(evt){
    if(evt.key === "Enter") addBtn.click();
})

function addTodoToArray(newTodo) {
  todos.push(newTodo);
  return todos;
}

function deleteTodo(id) {
  ul.querySelector(`[data-id = '${id}']`).remove();
  const newTodos = todos.filter(i => Number(id) !== i.id)
                      
  if(ul.children.length === 0) {
    emptyStateSpan.style.display = "block";
    emptyStatePara.style.display = "block";
  }    

  todos = [...newTodos];

  totalTasks.textContent = todos.length;
  const completedTodos = todos.filter(elements => elements.completed);
  completedTasks.textContent = completedTodos.length;
  const activeTodos = todos.filter(elements => !elements.completed);
  activeTasks.textContent = activeTodos.length;

  return todos;                      
}

function editTodo(id) {
  const editLi = ul.querySelector(`[data-id = '${id}']`);
  const editSpan = editLi.querySelector(".todo-text");
  const actionsDiv = editLi.querySelector(".todo-actions");
  const editBtn = editLi.querySelector(".edit-btn");
  const deleteBtn = editLi.querySelector(".delete-btn");

  editBtn.style.display = "none";

  const saveBtn = document.createElement("button");
  saveBtn.style.display = "";
  saveBtn.classList.add("save-btn");
  saveBtn.type = "button";
  saveBtn.innerHTML = "<i class='fa-solid fa-check-double'></i>";

  const cancelBtn = document.createElement("button");
  cancelBtn.style.display = "";
  cancelBtn.classList.add("cancel-btn");
  cancelBtn.type = "button";
  cancelBtn.innerHTML = "<i class='fa-solid fa-xmark'></i>";

  actionsDiv.insertBefore(saveBtn, deleteBtn);
  actionsDiv.insertBefore(cancelBtn, deleteBtn);

  const editInput = document.createElement("input");
  editInput.classList.add("edit-input");
  editInput.type = "text";
  editInput.value = editSpan.textContent;
  
  const editErrorMsg = document.createElement("span");
  editErrorMsg.className = "edit-error-msg";
  editErrorMsg.textContent = "⚠️ Field cannot be empty.";
  
  editSpan.replaceWith(editInput);
  editLi.appendChild(editErrorMsg); 
  editInput.focus();
  editInput.select();

  editInput.addEventListener("input", () => {
    editInput.classList.remove("error");
    editErrorMsg.classList.remove("show");
  });

  editInput.addEventListener("keydown" , function(evt){
    if(evt.key === "Enter") saveBtn.click();
    else if(evt.key === "Escape") cancelBtn.click();
  })

  saveBtn.addEventListener("click", function(){
    const editText = editInput.value.trim(); 
    if(!editText) {
      editInput.classList.add("error");
      editErrorMsg.classList.add("show");
      editInput.focus();
      return; 
    }

    const editedSpan = document.createElement("span");
    editedSpan.classList.add("todo-text");
    editedSpan.textContent = editText;
    editInput.replaceWith(editedSpan);
    editBtn.style.display = "";
    saveBtn.remove();
    cancelBtn.remove();

    const newTodos = todos.map(i => { 
      if(i.id === Number(id)){
        return{
          ...i,
          text: editText
        }
      } return i;
    })
    return todos = [...newTodos];
  })

  cancelBtn.addEventListener("click", function(){
    editInput.replaceWith(editSpan);
    editBtn.style.display = "";
    saveBtn.remove();
    cancelBtn.remove();
  })
}

function isCompleted(id) {
  const newTodos = todos.map(i => {
    if (i.id === Number(id)) {
      return { ...i, completed: true };
    }
    return i;
  });

  todos = [...newTodos];

  const completedTodos = todos.filter(elements => elements.completed);
  completedTasks.textContent = completedTodos.length;
  const activeTodos = todos.filter(elements => !elements.completed);
  activeTasks.textContent = activeTodos.length;
  
  return todos;
}

filterBtn.forEach(button => {
  button.addEventListener("click", function() {

    filterBtn.forEach(i => {
      i.classList.remove("active");
    })

    const filter = button.dataset.filter;
    const li = Array.from(ul.children);

    if(filter === "all") {
      button.classList.add("active");
      li.forEach(elements => {
        elements.style.display = "";
      })
    }

    else if(filter === "active") {
      button.classList.add("active");
      const todosIds = todos.filter(elements => !elements.completed)
                            .map(elements => { return elements.id })
      
      li.forEach(elements => {
        const liIds = Number(elements.dataset.id);
        if(todosIds.includes(liIds)) elements.style.display = "";
        else elements.style.display = "none"; 
      })
    }

    else if(filter === "completed") {
      button.classList.add("active");
      const todosIds = todos.filter(elements => elements.completed)
                            .map(elements =>{ return elements.id})

      li.forEach(elements => {
        const liIds = Number(elements.dataset.id);
        if(todosIds.includes(liIds)) elements.style.display = "";
        else elements.style.display = "none"; 
      });
    }
  })
});





