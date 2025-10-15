const notification = document.querySelector("#notification");
const notificationIcon = document.querySelector("#notificationIcon");
const notificationText = document.querySelector("#notificationText");
const input = document.querySelector("#todoInput");
const addBtn = document.querySelector("#addBtn");
const errorMessage = document.querySelector("#errorMsg");
const ul = document.querySelector("#todoList");
const emptyState = document.querySelector("#emptyState");
const emptyStateSpan = emptyState.querySelector("#emptyStateSpan");
const emptyStatePara = emptyState.querySelector("#emptyStatePara");
const filterBtn = document.querySelectorAll(".filter-btn");
const totalTasks = document.querySelector("#totalTasks");
const activeTasks = document.querySelector("#activeTasks");
const completedTasks = document.querySelector("#completedTasks");
const storageKey = "todo-list";
let todos = [];

function saveTodosInLocalStorage() {
  localStorage.setItem(storageKey, JSON.stringify(todos));
}

function getTodosFromLocalStorage() {
  const storedTodos = JSON.parse(localStorage.getItem(storageKey));
  if(storedTodos){
    todos = storedTodos;

    storedTodos.forEach(todo => {
      ul.appendChild(addTodo(todo, false));
    }) 

    if(todos.length > 0) {
      emptyState.style.display = "none";
      ul.classList.add("todo-list");
    }
    
    totalTasks.textContent = todos.length;
    const completedTodos = todos.filter(element => element.completed);
    completedTasks.textContent = completedTodos.length;
    const activeTodos = todos.filter(element => !element.completed);
    activeTasks.textContent = activeTodos.length;
  }
}
getTodosFromLocalStorage();

function markTodoAsComplete(li, checkbox, editBtn) {
  const completeMessage = document.createElement("span");
  completeMessage.classList.add("complete-badge");
  completeMessage.textContent = "Complete";
  
  editBtn.replaceWith(completeMessage);
  
  const reAddBtn = document.createElement("button");
  reAddBtn.type = "button";
  reAddBtn.classList.add("edit-btn");
  reAddBtn.innerHTML = "<i class='fa-sharp fa-solid fa-arrow-rotate-left'></i>";
  reAddBtn.setAttribute("title", "Mark the task incomplete");
  
  checkbox.replaceWith(reAddBtn);
  
  reAddBtn.addEventListener("click", function(event) {
    completeMessage.replaceWith(editBtn);
    const reAddBtnLi = event.target.closest("li");
    const reAddBtnId = Number(reAddBtnLi.dataset.id);
    reAddTasks(reAddBtnId, reAddBtn, checkbox);
    notifications("info", "Task Active Again");
  });
}

function notifications(type ,message) {
  if (type === "success") {
    notificationText.textContent = message;
  } else if (type === "delete") {
    notificationText.textContent = message;
  } else if (type === "info") {
    notificationText.textContent = message;
  }
  notification.classList.add(type, 'show');

  setTimeout(() => {
    notification.classList.remove(type , 'show');
  }, 1500)
}

function addTodo(newTodoObject, showNotification = true){
  emptyState.style.display = "none";

  ul.classList.add("todo-list");
  const li = document.createElement("li");
  li.classList.add("todo-item");
  li.dataset.id = newTodoObject.id;
  
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.classList.add("checkbox");
  checkbox.setAttribute("title", "Mark the task complete");

  checkbox.addEventListener("click", function(event){
  const toCheckLi = event.target.closest("li");
  const id = Number(toCheckLi.dataset.id);
  const liEditBtn = toCheckLi.querySelector(".edit-btn");
  
  markTodoAsComplete(toCheckLi, checkbox, liEditBtn);
  
  isCompleted(id);
  notifications("info", "Task Completed");
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
  editBtn.setAttribute("title", "Edit the task");
  editBtn.addEventListener("click", function(evt){
    const toEditLi = evt.target.closest("li");
    checkbox.disabled = true;
    const id = Number(toEditLi.dataset.id);
    editTodo(id);
  })

  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("delete-btn");
  deleteBtn.innerHTML = "<i class='fa-solid fa-trash' aria-hidden='true'></i>"; 
  deleteBtn.setAttribute("aria-label" , "Delete todo");
  deleteBtn.setAttribute("title", "Delete the task");
  deleteBtn.addEventListener("click" , function(evt){ 
    const toDeleteLi = evt.target.closest("li");
    const id = Number(toDeleteLi.dataset.id);
    deleteTodo(id); 
    notifications("delete" , "Task Successfully Deleted");
  });
  
  actionsDiv.append(editBtn, deleteBtn);
  li.append(checkbox, span, actionsDiv);

  if(showNotification) {
    notifications("success", "Task Successfully Added");
  }

  if(newTodoObject.completed) {
    markTodoAsComplete(li, checkbox, editBtn);
  }
  
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

    ul.appendChild(addTodo(newTodoObject));
    const activeFilterBtn = document.querySelector(".filter-btn.active");
    const filter = activeFilterBtn.dataset.filter;
    if(filter === "completed") {
      const completedTodos = todos.filter(element => element.completed);
      const newTodoObjectLi = document.querySelector(`[data-id = '${newTodoObject.id}']`);
      newTodoObjectLi.style.display = 'none';
      if(completedTodos.length === 0) {
        emptyState.style.display = "block";
        ul.classList.remove("todo-list");
      }
      else emptyState.style.display = "none"; 
    }  
    input.value = "";
    input.focus();

  todos.push(newTodoObject);
  saveTodosInLocalStorage();

  totalTasks.textContent = todos.length;
  const activeTodos = todos.filter(element => !element.completed);
  activeTasks.textContent = activeTodos.length;
  return todos;
  }
})

input.addEventListener("keydown" , function(evt){
    if(evt.key === "Enter") addBtn.click();
})

function deleteTodo(id) {
  ul.querySelector(`[data-id = '${id}']`).remove();
  todos = todos.filter(element => id !== element.id);

  totalTasks.textContent = todos.length;
  const completedTodos = todos.filter(element => element.completed);
  completedTasks.textContent = completedTodos.length;
  const activeTodos = todos.filter(element => !element.completed);
  activeTasks.textContent = activeTodos.length;

  const activeFilterBtn = document.querySelector(".filter-btn.active");
  const filter = activeFilterBtn.dataset.filter;

  if(filter === "all") {
    if(todos.length === 0) {
      emptyState.style.display = "block";
      ul.classList.remove("todo-list");
    } 
  }
  else if(filter === "active") {
    if(activeTodos.length === 0) {
      emptyState.style.display = "block";
      ul.classList.remove("todo-list");
    } 
  }
  else if(filter === "completed") {
    if(completedTodos.length === 0) {
      emptyState.style.display = "block";
      ul.classList.remove("todo-list");
    }
  }
saveTodosInLocalStorage();
return todos;                      
}

function editTodo(id) {
  const editLi = ul.querySelector(`[data-id = '${id}']`);
  const editSpan = editLi.querySelector(".todo-text");
  const actionsDiv = editLi.querySelector(".todo-actions");
  const editBtn = editLi.querySelector(".edit-btn");
  const deleteBtn = editLi.querySelector(".delete-btn");
  const checkbox = editLi.querySelector(".checkbox");

  editBtn.style.display = "none";

  const saveBtn = document.createElement("button");
  saveBtn.style.display = "";
  saveBtn.classList.add("save-btn");
  saveBtn.type = "button";
  saveBtn.innerHTML = "<i class='fa-solid fa-check-double'></i>";
  saveBtn.setAttribute("title", "Save the edited task");

  const cancelBtn = document.createElement("button");
  cancelBtn.style.display = "";
  cancelBtn.classList.add("cancel-btn");
  cancelBtn.type = "button";
  cancelBtn.innerHTML = "<i class='fa-solid fa-xmark'></i>";
  cancelBtn.setAttribute("title", "Cancel the edit");

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
    checkbox.disabled = false;
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
    notifications("success" , "Task Successfully Edited");

    todos = todos.map(element => { 
      if(element.id === id){
        return{
          ...element,
          text: editText
        }
      } return element;
    })
  saveTodosInLocalStorage();
  return todos;
  })

  cancelBtn.addEventListener("click", function(){
    checkbox.disabled = false;
    editInput.replaceWith(editSpan);
    editBtn.style.display = "";
    saveBtn.remove();
    cancelBtn.remove();
  })
}

function isCompleted(id) {
  todos = todos.map(element => {
    if (element.id === id) {
      return { ...element, completed: true };
    }
    return element;
  });

  const activeFilterBtn = document.querySelector(".filter-btn.active");
  const filter = activeFilterBtn.dataset.filter;
  if(filter === "active"){
    const li = Array.from(ul.children);
    const todoIds = todos.filter(element => element.completed)
                          .map(element => { return element.id })
      li.forEach(element => {
      const liIds = Number(element.dataset.id);
      if(todoIds.includes(liIds)){
        element.style.display = "none";
      } else element.style.display = "";
    })

    const activeTodos = todos.filter(element => !element.completed)
    if(activeTodos.length === 0) {
        emptyState.style.display = "block";
        ul.classList.remove("todo-list");
      } else emptyState.style.display = "none"; 
  }

  const completedTodos = todos.filter(element => element.completed);
  completedTasks.textContent = completedTodos.length;
  const activeTodos = todos.filter(element => !element.completed);
  activeTasks.textContent = activeTodos.length;

saveTodosInLocalStorage();
return todos;
}

function reAddTasks(id, reAddBtn, checkbox) {
  reAddBtn.replaceWith(checkbox);
  checkbox.checked = false;
  todos = todos.map(element => {
    if(element.id === id) {
      return{
        ...element,
        completed: false
      }
    } else return element;
  })

  const activeFilterBtn = document.querySelector(".filter-btn.active");
  const filter = activeFilterBtn.dataset.filter;
  if(filter === "completed"){
    const li = Array.from(ul.children);
    const todoIds = todos.filter(element => !element.completed)
                          .map(element => { return element.id })
    li.forEach(element => {
      const liIds = Number(element.dataset.id);
      if(todoIds.includes(liIds)){
        element.style.display = "none";
      } else {
        element.style.display = "";
      }
    })
    const completedTodos = todos.filter(element => element.completed);
    if(completedTodos.length === 0) {
      emptyState.style.display = "block";
      ul.classList.remove("todo-list");
    } else emptyState.style.display = "none";                      
  }
  const completedTodos = todos.filter(element => element.completed);
  completedTasks.textContent = completedTodos.length;
  const activeTodos = todos.filter(element => !element.completed);
  activeTasks.textContent = activeTodos.length;

saveTodosInLocalStorage();  
return todos;
}

function filterButtons (){
  filterBtn.forEach(button => {
    button.addEventListener("click", function() {

      filterBtn.forEach(i => {
        i.classList.remove("active");
      })

      const filter = button.dataset.filter;
      const li = Array.from(ul.children);
      const completedTodos = todos.filter(element => element.completed);

      if(filter === "all") {
        button.classList.add("active");
        li.forEach(element => {
        element.style.display = "";
        })
        if(todos.length === 0) {
          emptyState.style.display = "block";
          ul.classList.remove("todo-list");
        }  
        else {
          emptyState.style.display = "none";
          ul.classList.add("todo-list");
        }
      }
      else if(filter === "active") {
        button.classList.add("active");
        const activeTodos = todos.filter(element => !element.completed)
        const completedIds = activeTodos.map(element => { return element.id })
      
        li.forEach(element => {
          const liIds = Number(element.dataset.id);
          if(completedIds.includes(liIds)) element.style.display = "";
          else element.style.display = "none"; 
        })
        if(todos.length === 0 || activeTodos.length === 0) {
          emptyState.style.display = "block";
          ul.classList.remove("todo-list");
        }  
        else {
          emptyState.style.display = "none";
          ul.classList.add("todo-list");
        }
      }
      else if(filter === "completed") {
        button.classList.add("active");
        const completedIds = completedTodos.map(element =>{ return element.id});
 
        li.forEach(element => {
          const liIds = Number(element.dataset.id);
          if(completedIds.includes(liIds)) element.style.display = "";
          else element.style.display = "none"; 
        });
        if(completedTodos.length === 0) {
          emptyState.style.display = "block";
          ul.classList.remove("todo-list")
        }  
        else { 
          emptyState.style.display = "none";
          ul.classList.add("todo-list");
        }
      }
    })
  });
}
filterButtons();


