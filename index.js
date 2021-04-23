const express = require('express');
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

const app = express();
const port = process.env.PORT || 3001

app.use(bodyParser.json())
app.use(morgan('combined'))
app.use(cors({ origin: '*' }))

const delay = (timer = 300) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, timer)
  })
}

let counter = 0;
let tasks = []
let authors = [
  {
    id: 1,
    name: 'Marcus Freire'
  },
  {
    id: 2,
    name: 'Thiago Firmo'
  },
  {
    id: 3,
    name: 'Rafael Nunes'
  }
]

const getIndexById = (id) => {
  return tasks.findIndex(x => x.id === parseInt(id, 10))
}

app.get('/tasks', async (req, res) => {
  const result = tasks.map(task => {
    const author = authors.find(a => a.id === task.author_id)
    task.author = author;
    return {
      ...task,
      author
    }
  })

  return res.json(result)
})

app.get('/tasks/:id', async (req, res) => {
  const { id } = req.params
  const index = getIndexById(id)
  const task = tasks[index]
  const author = authors.find(a => a.id === task.author_id)
  task.author = author;
  return res.json(tasks[index])
})

app.patch('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const { complete } = req.body

  const index = getIndexById(id);
  if (index > -1) {
    tasks[index].completed = complete
    res.send()
  } else {
    res.status(404).send()
  }
})

app.post('/tasks', async (req, res) => {
  const { title, description, author_id } = req.body

  await delay();
  if (!tasks.map(x => x.title).includes(title)) {
    tasks.push({
      id: ++counter,
      title,
      description,
      author_id,
      completed: false
    });
    res.status(200).send()
  } else {
    res.status(500).send('Não é possivel adicionar tarefas com o mesmo titulo.')
  }
})

app.delete('/tasks/:id', async (req, res) => {
  const { id } = req.params
  const index = getIndexById(id)
  if (!!tasks[index]) {
    tasks.splice(index, 1);
    res.status(200).send()
  } else {
    res.status(404).send()
  }
})

app.delete('/tasks-all', async (req, res) => {
  tasks = []
  res.status(200).send()
})

app.get('/', (req, res) => {
  res.send('Task API running')
})

app.get('/authors', (req, res) => {
  res.json(authors)
})

app.listen(port, () => {
  console.log('Server is running');
})