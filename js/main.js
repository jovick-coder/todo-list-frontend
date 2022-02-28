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
onLoading()
function onLoading() {
  todoList.innerHTML = ''
  todoList.innerHTML = '<div class="loading">Loading...</div>'
  getTodos()
}
function offLoading() {
  todoList.innerHTML = ''
}

// Get all todos
async function getTodos() {
  // loading state on when the todo is not yet ready

  try {
    let response = await fetch(url)
    let todos = await response.json()
    if (todos.length === 0) {
      // message when datatbase is empty
      todoList.innerHTML = "<div class='message'>No Todo found Add some</div>"
      return
    }

    if (todos) {
      // loading state off when the todo is ready
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
}

// Create a todo

async function createTodo(obj) {
  if (obj.length === 0) return

  const { todo } = obj

  const newTodo = { todo: todo, done: false }
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

  // console.log('New Todo Added -> ', newTodo)
}

// Update a todo

// Delete a todo
