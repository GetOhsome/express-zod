<!-- @format -->

## Usage:

### Route middleware

```js
import { validate } = from 'express-zod'
import { z } from 'zod'

const validation = {
  body: z.object({
    username: z.string().min(1, 'username is required'),
    password: z.string().min(8, 'password must be at least 8 characters'),
  }),
  params: z.object({
    id: z.string().uuid('invalid uuid'),
  }),
  query: z.object({
    page: z.coerce.number().min(1).catch(1)
  })
}

app.get('/', validate(validation), (req, res) => {
  const { username, password } = req.body // are both strings
  const { id } = req.params // is a uuid
  const { page } = req.query // is a number or defaults to 1

  // ...do something with username password

  res.status(201).json({
      username
  })
})
```

### Error Handling

#### Default

```js
import express from 'express'
import { zodError } from 'express-zod'

const PORT = 3000
const app = express()

// ...setup express app
app.use(zodError())

app.listen(PORT, () => {
  console.log('App listening on http://localhost:${PORT}')
})
```

#### Custom Error-Handling

```js
import express from 'express'
import { zodError } from 'express-zod'

const PORT = 3000
const app = express()

// ...setup express app
app.use(
  // error is a ZodError
  // https://github.com/colinhacks/zod/blob/master/ERROR_HANDLING.md
  zodError((error, req, res, next) => {
    res.status(400).json({
      error: {
        message: err.flatten().fieldErrors,
      },
    })
  })
)

app.listen(PORT, () => {
  console.log('App listening on http://localhost:${PORT}')
})
```
