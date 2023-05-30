
## Roadmap

- Setup express server with mongodb database
- Use typescript and mongoose
- Code formate with Eslint and prettier


## Steps

create package.json file

```bash
  npm init
```
install typescript as dev dependency

```bash
  yarn add -D typescript
```
configure typescript

```bash
  tsc --init
```
tsconfig.json add this code
```bash
"module": "commonjs", 
"rootDir": "./src",
"outDir": "./dist", 
```


install express
```bash
  yarn add express
```

install  mongoose
```bash
   yarn add mongoose
```

install  dotenv then create file named .env 
```bash
   yarn add dotenv 
```

install  cors 
```bash
   yarn add cors 
```

create [.env] file and keep sensitive data
```bash
NODE_ENV=development
PORT=yourport
DATABASE_URL=yourdburl
```


create [config/idex.ts]
```bash
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.join(process.cwd(), '.env') })

export default {
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL
}
```

create [app.ts] file
```bash
import express, { Application, Request, Response } from 'express'
import cors from 'cors'
const app: Application = express()

app.use(cors())

//parser
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Application routes

//Testing
app.get('/', async (req: Request, res: Response) => {
  res.send('Working Successfully')
})

export default app
```

configure types
```bash
 yarn add -D @types/express
 yarn add -D @types/cors
```

create [server.ts] file
```bash
import mongoose from 'mongoose'
import config from './config/index'
import app from './app'

async function dbConnect() {
  try {
    await mongoose.connect(config.database_url as string)
    console.log(`🛢   Database is connected successfully`)

    app.listen(config.port, () => {
      console.log(`Application  listening on port ${config.port}`)
    })
  } catch (err) {
    console.log('Failed to connect database', err)
  }
}

dbConnect()
```


install ts-node-dev as dev dependency
```bash
yarn add ts-node-dev --dev
```

add the code to the [package.json] file 
```bash
  "scripts": {
    "start": "ts-node-dev --respawn --transpile-only src/server.ts"
  }
```

run server
```bash
yarn start
```

create [.gitignore] file and add the file name that doesn't need to send github
```bash
node_modules
.env
```

