const url = 'https://jovick-todo-api.herokuapp.com/api/todos'
// const url = 'http://localhost:3000/api/todos'
const loading = document.querySelector('.loading')
const todoList = document.querySelector('#todo-list')
addTodoBtn = document.querySelector('.add-todo-btn')
formDiv = document.querySelector('.form-div')
todoInput = document.querySelector('#todo-input')
error = document.querySelector('.error')

addTodoBtn.addEventListener('click', (e) => {
  formDiv.style.display = 'block'
  addTodoBtn.style.display = 'none'
})

document.querySelector('#addTodo').addEventListener('click', (e) => {
  e.preventDefault()

  const token = localStorage.getItem('todoAuthToken')
  
  if (!token || token === '') { 
    return
  }
  if (todoInput.value === '') {
    error.innerHTML = 'Enter a todo input'
    return
  }

  const todo = todoInput.value
  createTodo({ todo, token })
})
// loading state on page load
onLoading()
function onLoading() {
  todoList.innerHTML = ''
  loading.innerHTML = 'Loading...'
  formDiv.style.display = 'none'
  addTodoBtn.style.display = 'inline-block'
  error.innerHTML = ''
  todoInput.value = ''
  // -- get data whill page is loading
  getTodos()
}
function offLoading() {
  loading.innerHTML = ''
  // todoList
}

// Get all todos
async function getTodos() {
  const token = localStorage.getItem('todoAuthToken')
  
  if (!token || token === '') { 
    return
  }
  try {
    let response = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({token:token}),
    })
    let todos = await response.json()
    if (todos.length === 0) {
      // -- message when datatbase is empty
      loading.innerHTML = "<div class='message'>No Todo found Add some</div>"
      return
    }

    if (todos) {
      // -- loading state off when the todo is ready
      offLoading()

      todos.forEach((t) => {
        const { _id, todo, done } = t
        htmlTemp = `
              <li key='${_id}'>
                <label class='todo-name' ${
                  done ? ` style='text-decoration: line-through'` : ''
                } >
                  <input type="checkbox" class='todo-check' ${
                    done ? 'checked' : ''
                  }> ${todo}
                </label>
                <div class='icon'> <img src="./img/trash.svg" alt="" srcset=""></div>
              </li>
            `

        todoList.innerHTML += htmlTemp
      })
    }
  } catch (error) {
    console.error('Error -> ', error)
  }
  checkboxNode()
  trachNode()
}

// Create a todo
async function createTodo(obj) {
  if (obj.length === 0) return
  const { todo, token } = obj

  const newTodo = { todo: todo, token:token , done: false }
  try {
    const response = await fetch(url+'/newTodo', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newTodo),
    })
// console.log(await response.json());
    if (response.ok) {
      onLoading()
    }
  } catch (error) {
    console.error('Error -> ', error)
  }
}

// Update a todo
function checkboxNode() {
  const checkboxs = document.querySelectorAll('#todo-list>li>label>input')

  checkboxs.forEach((checkbox) =>
    checkbox.addEventListener('click', (c) => {
      const done = c.target.checked
      const liElement = c.path[2]
      const key = liElement.getAttribute('key')
      done
        ? (liElement.style.textDecoration = 'line-through')
        : (liElement.style.textDecoration = 'none')

      const updateTodo = !done ? { done: false } : { done: true }
      // loading.innerHTML = 'Loading...'
      updateTodos(key, updateTodo)
    }),
  )
}

async function updateTodos(id, updateTodo) {
  const request = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updateTodo),
  }
  const responce = await fetch(`${url}/${id}`, request)

  if (responce.ok) {
    offLoading()
  }
}

// Delete a todo
function trachNode() {
  const tash = document.querySelectorAll('#todo-list>li>.icon>img')

  tash.forEach((checkbox) =>
    checkbox.addEventListener('click', (c) => {
      const liElement = c.path[2]
      const key = liElement.getAttribute('key')
      deleteTodo(key)
    }),
  )
}

async function deleteTodo(id) {
  let checkConfirm = confirm('Delete Todo!')
  if (checkConfirm === false) {
    return
  }
  const request = {
    method: 'DELETE',
    header: {
      'Content-Type': 'application/json',
    },
  }

  const responce = await fetch(`${url}/${id}`, request)

  if (responce.ok) {
    onLoading()
  }
}


const logout = () => {
  const logout = confirm('Do you want to logout...')
  let token = localStorage.getItem('todoAuthToken')
  if (!logout) return
  
  console.log(token);
  localStorage.removeItem('todoAuthToken')
  location.replace('/')

}