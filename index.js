const express = require('express');
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

const app = express();
const port = 3001

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

const getIndexById = (id) => {
  return tasks.findIndex(x => x.id === parseInt(id, 10))
}

app.get('/tasks', async (req, res) => {
  return res.json(tasks)
})

app.get('/tasks/:id', async (req, res) => {
  const { id } = req.params
  const index = getIndexById(id)
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
  const { title } = req.body

  await delay();
  if(!tasks.map(x=>x.title).includes(title)){
    tasks.push({
      id: ++counter,
      title,
      completed: false
    });
    res.status(200).send()
  }else{
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

app.listen(port, () => {
  console.log('Server is running');
})