const input = document.querySelector("#todoInput");
const addBtn = document.querySelector("#addBtn");
const errorMessage = document.querySelector("#errorMsg");
const ul = document.querySelector("#todoList");
const emptyStateSpan = document.querySelector("#emptyStateSpan");
const emptyStatePara = document.querySelector("#emptyStatePara");
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
      iscompleted: false
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
  console.log(newTodos);
  todos = [...newTodos];
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
  saveBtn.style.display = "flex";
  saveBtn.classList.add("save-btn");
  saveBtn.type = "button";
  saveBtn.innerHTML = "<i class='fa-solid fa-check-double'></i>";

  const cancelBtn = document.createElement("button");
  cancelBtn.style.display = "flex";
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
    editBtn.style.display = "flex";
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
    editBtn.style.display = "flex";
    saveBtn.remove();
    cancelBtn.remove();
  })

  editInput.addEventListener("keydown" , function(evt){
    if(evt.key === "Enter") saveBtn.click();
    else if(evt.key === "Escape") cancelBtn.click();
  })
}