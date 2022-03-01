// const url = 'https://jovick-todo-api.herokuapp.com/api/todos'
const url = 'http://localhost:3000/api/todos'
const loading = document.querySelector('.loading')
const todoList = document.querySelector('#todo-list')

document.querySelector('#addTodo').addEventListener('click', () => {
  const todo = prompt('Enter Your Todo')
  if (todo !== '') {
    createTodo({ todo })
  }
})
// loading state on page load
onLoading()
function onLoading() {
  loading.innerHTML = 'Loading...'
  // -- get data whill page is loading
  getTodos()
}
function offLoading() {
  loading.innerHTML = ''
  // todoList
}

// Get all todos
async function getTodos() {
  try {
    let response = await fetch(url)
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
}

// Create a todo
async function createTodo(obj) {
  if (obj.length === 0) return

  const { todo } = obj

  const newTodo = { todo: todo, done: false }
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newTodo),
    })

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
      loading.innerHTML = 'Loading...'
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
