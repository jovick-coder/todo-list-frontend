const url = 'https://jovick-todo-api.herokuapp.com/api/todos'
const loading = document.querySelector('.loading')
const todoList = document.querySelector('#todo-list')

function onLoading() {
  loading.style.display = 'block'
}
function offLoading() {
  loading.style.display = 'none'
}

// Get all todos
async function getTodos() {
  // loading state on when the todo is not yet ready
  onLoading()

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
        !done
          ? (htmlTemp = `
              <li key='${_id}'>
                  <label class='todo-name' >
                  <input type="checkbox" name="" id="" class='todo-check'"> ${todo}
                  </label>
                <div class='icon'> <img src="./img/trash.svg" alt="" srcset=""></div>
              </li>
            `)
          : (htmlTemp = `
              <li key='${_id}'>

              <label class='todo-name'style=' text-decoration: line-through' >
              <input type="checkbox" name="" id="" class='todo-check'" checked> ${todo}
              </label>
              <div class='icon'> <img src="./img/trash.svg" alt="" srcset=""></div>
              </li>
            `)

        todoList.innerHTML += htmlTemp
      })
    }

    console.log(todos)
  } catch (error) {
    console.error('Error -> ', error)
  }
}

getTodos()
// Add a todo

// Update a todo

// Delete a todo
