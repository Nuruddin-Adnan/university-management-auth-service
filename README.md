
## Roadmap

- Setup express server with mongodb database
- Use typescript and mongoose
- Code formate with Eslint and prettier

## Roadmap

- Setup express server with mongodb database
- Use typescript and mongoose
- Code formate with Eslint and prettier

## Steps

#### create package.json file

```bash
  npm init
  configure "entry point: src/server.ts" when ask
```

#### install typescript as dev dependency

```bash
  yarn add -D typescript
```

#### configure typescript

```bash
  tsc --init
```

#### tsconfig.json add this code

```bash
"include": ["src"], // which files to compile
"exclude": ["node_modules"], // which files to skip
"module": "commonjs",
"rootDir": "./src",
"outDir": "./dist",
```

#### install express

```bash
  yarn add express
```

#### install mongoose

```bash
   yarn add mongoose
```

#### install dotenv then create file named .env

```bash
   yarn add dotenv
```

#### install cors

```bash
   yarn add cors
```

#### create [.env] file and keep sensitive data

```bash
NODE_ENV=development
PORT=yourport
DATABASE_URL=yourdburl
```

#### create [src/config/index.ts]

```bash
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.join(process.cwd(), '.env') })

export default {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
}
```

#### create [src/app.ts] file

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

#### configure types

```bash
 yarn add -D @types/express
 yarn add -D @types/cors
```

#### create [src/server.ts] file

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

#### install ts-node-dev as dev dependency

```bash
yarn add -D ts-node-dev
```

#### add the code to the [package.json] file

```bash
  "scripts": {
    "start": "node dist/server.js",
    "build": "tsc",
    "dev": "ts-node-dev --respawn --transpile-only src/server.ts",
  }
```

#### run server

```bash
yarn start
```

#### create [.gitignore] file and add the file name that doesn't need to send github

```bash
node_modules
.env
```

### Install and configure ESlint, prettier, husky, lint-staged

run as dev dependency

```bash
yarn add -D @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint eslint-config-prettier prettier husky lint-staged
```

#### .eslintrc file

```
{
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": 13,
    "sourceType": "module"
  },
  "plugins": ["@typescript-eslint"],
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier"
  ],
  "rules": {
    "no-unused-vars": "error",
    "prefer-const": "error",
    "no-unused-expressions": "error",
    "no-undef": "error",
    "no-console": "warn",
    "@typescript-eslint/consistent-type-definitions": ["error", "type"]
  },
  "env": {
    "browser": true,
    "es2021": true,
    "node": true
  },
  "globals": {
    "process": "readonly"
  }
}
```

#### .eslintignore file

```
dist
node_modules
.env
```

#### .prettierrc file

```
{
  "semi": true,
  "singleQuote": true,
  "arrowParens": "avoid"
}
```

#### git init

<!-- if already exists ignore this  -->

```
git init
```

#### configure husky

```
yarn husky install
yarn husky add .husky/pre-commit "yarn test"
```

#### .husky/pre-commit add this code

```
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

yarn lint-staged
```

#### package.json file add this code

```
{
  "scripts": {
     "lint:check": "eslint --ignore-path .eslintignore --ext .js,.ts .",
     "lint:fix": "eslint . --fix",
     "prettier:check": "prettier --ignore-path .gitignore --write \"**/*.+(js|ts|json)\"",
     "prettier:fix": "prettier --write .",
     "lint-prettier": "yarn lint:check && yarn prettier:check"
   },
   "lint-staged": {
     "src/**/*.ts": "yarn lint-prettier"
   }
}
```

#### settings.json (vs code settings)

```
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true
}
```

#### create .vscode/settings.json (on root directory)

```
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.fixAll.tslint": true,
    "source.organizeImports": true
  }
}
```

### error handle with winston , http-status and zod

#### install as dependency

```
yarn add winston winston-daily-rotate-file http-status zod
```

#### create src/interfaces/error.ts

```
export type IGenericErrorMessage = {
  path: string | number;
  message: string;
};
```

#### create src/interfaces/common.ts

```
import { IGenericErrorMessage } from './error';

export type IGenericErrorResponse = {
  statusCode: number;
  message: string;
  errorMessages: IGenericErrorMessage[];
};
```

#### create src/errors/ApiError.ts

```
class ApiError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string | undefined, stack = '') {
    super(message);
    this.statusCode = statusCode;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default ApiError;
```

#### create src/errors/handleValidationError.ts

```
import mongoose from 'mongoose';
import { IGenericErrorResponse } from '../interfaces/common';
import { IGenericErrorMessage } from '../interfaces/error';

const handleValidationError = (
  error: mongoose.Error.ValidationError
): IGenericErrorResponse => {
  const errors: IGenericErrorMessage[] = Object.values(error.errors).map(
    (el: mongoose.Error.ValidatorError | mongoose.Error.CastError) => {
      return {
        path: el?.path,
        message: el?.message,
      };
    }
  );
  const statusCode = 400;
  return {
    statusCode,
    message: 'Validation Error',
    errorMessages: errors,
  };
};

export default handleValidationError;
```

#### create src/errors/handleZodError.ts

```
import { ZodError, ZodIssue } from 'zod';
import { IGenericErrorResponse } from '../interfaces/common';
import { IGenericErrorMessage } from '../interfaces/error';

const handleZodError = (error: ZodError): IGenericErrorResponse => {
  const errors: IGenericErrorMessage[] = error.issues.map((issue: ZodIssue) => {
    return {
      path: issue?.path[issue.path.length - 1],
      message: issue?.message,
    };
  });

  const statusCode = 400;

  return {
    statusCode,
    message: 'Validation Error',
    errorMessages: errors,
  };
};

export default handleZodError;
```

#### create src/errors/handleCastError.ts

```
import mongoose from 'mongoose';
import { IGenericErrorMessage } from '../interfaces/error';

const handleCastError = (error: mongoose.Error.CastError) => {
  const errors: IGenericErrorMessage[] = [
    {
      path: error.path,
      message: 'Invalid Id',
    },
  ];

  const statusCode = 400;
  return {
    statusCode,
    message: 'Cast Error',
    errorMessages: errors,
  };
};

export default handleCastError;
```

#### create src/shared/logger.ts

```
/* eslint-disable no-undef */
import path from 'path';
import { createLogger, format, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
const { combine, timestamp, label, printf } = format;

//Customm Log Format

const myFormat = printf(({ level, message, label, timestamp }) => {
  const date = new Date(timestamp);
  const hour = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  return `${date.toDateString()} ${hour}:${minutes}:${seconds} } [${label}] ${level}: ${message}`;
});

const logger = createLogger({
  level: 'info',
  format: combine(label({ label: 'YOURAPP_NAME' }), timestamp(), myFormat),
  transports: [
    new transports.Console(),
    new DailyRotateFile({
      filename: path.join(
        process.cwd(),
        'logs',
        'winston',
        'successes',
        'YOURAPP_NAME-%DATE%-success.log'
      ),
      datePattern: 'YYYY-DD-MM-HH',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
    }),
  ],
});

const errorlogger = createLogger({
  level: 'error',
  format: combine(label({ label: 'YOURAPP_NAME' }), timestamp(), myFormat),
  transports: [
    new transports.Console(),
    new DailyRotateFile({
      filename: path.join(
        process.cwd(),
        'logs',
        'winston',
        'errors',
        'YOURAPP_NAME-%DATE%-error.log'
      ),
      datePattern: 'YYYY-DD-MM-HH',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
    }),
  ],
});

export { errorlogger, logger };
```

#### Change src/server.ts

```
import { Server } from 'http';
import mongoose from 'mongoose';
import app from './app';
import config from './config/index';
import { errorlogger, logger } from './shared/logger';

process.on('uncaughtException', error => {
  errorlogger.error(error);
  process.exit(1);
});

let server: Server;

async function dbConnect() {
  try {
    await mongoose.connect(config.database_url as string);
    logger.info(`🛢   Database is connected successfully`);

    server = app.listen(config.port, () => {
      logger.info(`Application  listening on port ${config.port}`);
    });
  } catch (err) {
    errorlogger.error('Failed to connect database', err);
  }

  process.on('unhandledRejection', error => {
    if (server) {
      server.close(() => {
        errorlogger.error(error);
        process.exit(1);
      });
    } else {
      process.exit(1);
    }
  });
}

dbConnect();

process.on('SIGTERM', () => {
  logger.info('SIGTERM is received');
  if (server) {
    server.close();
  }
});
```

#### create src/app/middlewares/globalErrorHandler.ts

```
/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable no-unused-expressions */
import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import config from '../../config';
import ApiError from '../../errors/ApiError';
import handleValidationError from '../../errors/handleValidationError';

import { ZodError } from 'zod';
import handleCastError from '../../errors/handleCastError';
import handleZodError from '../../errors/handleZodError';
import { IGenericErrorMessage } from '../../interfaces/error';
import { errorlogger } from '../../shared/logger';

const globalErrorHandler: ErrorRequestHandler = (
  error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  config.env === 'development'
    ? console.log(`🐱‍🏍 globalErrorHandler ~~`, { error })
    : errorlogger.error(`🐱‍🏍 globalErrorHandler ~~`, error);

  let statusCode = 500;
  let message = 'Something went wrong !';
  let errorMessages: IGenericErrorMessage[] = [];

  if (error?.name === 'ValidationError') {
    const simplifiedError = handleValidationError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorMessages = simplifiedError.errorMessages;
  } else if (error instanceof ZodError) {
    const simplifiedError = handleZodError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorMessages = simplifiedError.errorMessages;
  } else if (error?.name === 'CastError') {
    const simplifiedError = handleCastError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorMessages = simplifiedError.errorMessages;
  } else if (error instanceof ApiError) {
    statusCode = error?.statusCode;
    message = error.message;
    errorMessages = error?.message
      ? [
          {
            path: '',
            message: error?.message,
          },
        ]
      : [];
  } else if (error instanceof Error) {
    message = error?.message;
    errorMessages = error?.message
      ? [
          {
            path: '',
            message: error?.message,
          },
        ]
      : [];
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorMessages,
    stack: config.env !== 'production' ? error?.stack : undefined,
  });
};

export default globalErrorHandler;

```

#### create src/app/middlewares/validateRequest.ts

```
import { NextFunction, Request, Response } from 'express';
import { AnyZodObject, ZodEffects } from 'zod';

const validateRequest =
  (schema: AnyZodObject | ZodEffects<AnyZodObject>) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
        cookies: req.cookies,
      });
      return next();
    } catch (error) {
      next(error);
    }
  };

export default validateRequest;
```

#### Add this code to src/app.ts

```
import express, { Application, NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import globalErrorHandler from './app/middlewares/globalErrorHandler';

//global error handler
app.use(globalErrorHandler);

//handle not found
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: 'Not Found',
    errorMessages: [
      {
        path: req.originalUrl,
        message: 'API Not Found',
      },
    ],
  });
  next();
});
```

#### How to use handle error

src/app.ts

```
//global error handler
app.use(globalErrorHandler);
```

use of error and error/success log

```
//success logger
 logger.info('success message here')

 //Error logger
 errorlogger.error('Error message here')

 //Use of globalErrorHandler
 next('Error message here');

 //Use of Api error
throw new ApiError(400, 'Your error message here');

 <!-- Example -->
import { RequestHandler } from 'express';
import { createUserService } from './user.service';
import { errorlogger } from '../../../shared/logger';

const createUser: RequestHandler = async (req, res, next) => {
  try {
    const result = await createUserService(req.body);
    res.status(200).json({
      status: 'success',
      message: 'User created successfully',
      data: result,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      errorlogger.error(error);
      next(error);
    }
  }
};

export const userController = {
  createUser,
};
```

### Validation schema using zod before going controller

zod Validation use in the router lavel

#### Stepes:

— Create zod schema

— Make `validateRequest` middleware function to receive `Any Zod Object` and parseAsync req, res and next before going controller

— Use the middleware in router lavel

#### Create src/app/modules/user/user.validation.ts file (zod schema)

```
import { z } from 'zod';

const createUserZodSchema = z.object({
 body: z.object({
   role: z.string({
     required_error: 'Role is required',
   }),
   password: z.string().optional(),
 }),
});

export const UserValidation = {
 createUserZodSchema,
};
```

#### Create src/app/middlewares/validateRequest.ts file (validateRequest middleware)

```
import { NextFunction, Request, Response } from 'express';
import { AnyZodObject, ZodEffects } from 'zod';

const validateRequest =
 (schema: AnyZodObject | ZodEffects<AnyZodObject>) =>
 async (req: Request, res: Response, next: NextFunction): Promise<void> => {
   try {
     await schema.parseAsync({
       body: req.body,
       query: req.query,
       params: req.params,
       cookies: req.cookies,
     });
     return next();
   } catch (error) {
     next(error);
   }
 };

export default validateRequest;
```

#### Use the middleware in router lavel

```
import express from 'express';
import { UserController } from './user.controller';
import validateRequest from '../../middlewares/validateRequest';
import { UserValidation } from './user.validation';

const router = express.Router();

router.post(
 '/create-user',
 validateRequest(UserValidation.createUserZodSchema),
 UserController.createUser
);

export const UserRoutes = router;
```

### Optimize controller code

#### create src/shared/catchAsync.ts

```
import { NextFunction, Request, RequestHandler, Response } from 'express';

const catchAsync =
 (fn: RequestHandler) =>
 async (req: Request, res: Response, next: NextFunction): Promise<void> => {
   try {
     await fn(req, res, next);
   } catch (error) {
     next(error);
   }
 };

export default catchAsync;
```

#### create src/shared/sendResponse.ts

```
import { Response } from 'express';

type IApiReponse<T> = {
 statusCode: number;
 success: boolean;
 message?: string | null;
 meta?: {
   page: number;
   limit: number;
   total: number;
 };
 data?: T | null;
};

const sendResponse = <T>(res: Response, data: IApiReponse<T>): void => {
 const responseData: IApiReponse<T> = {
   statusCode: data.statusCode,
   success: data.success,
   message: data.message || null,
   meta: data.meta || null || undefined,
   data: data.data || null,
 };

 res.status(data.statusCode).json(responseData);
};

export default sendResponse;
```

#### uses in controller

//Example user.controller.ts

```
import { Request, Response } from 'express';
import { UserService } from './user.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { IUser } from './user.interface';
import httpStatus from 'http-status';

const createUser = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.createUser(req.body);

  sendResponse<IUser>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User created successfully',
     // meta: result.meta,
    data: result,
  });
});

export const UserController = {
  createUser,
};
```

### Optimize routes

#### create src/app/Router/index.ts

```
import express from 'express';
import { UserRoutes } from '../modules/user/user.route';academicSemester.route';

const router = express.Router();

const moduleRoutes = [
  {
    path: '/users',
    route: UserRoutes,
  }
];

moduleRoutes.forEach(route => router.use(route.path, route.route));

export default router;
```

#### Change src/app.ts/

```
// Application routes
app.use('/api/v1', routes);
```

## Filters query

#### create src/interfaces/queryFilters.ts
```
export type IFilters = {
  sort?: string;
  page?: string;
  limit?: string;
  fields?: string;
  [key: string]: string | number | undefined;
};

export type IQueries = {
  fields?: string;
  sort?: string;
  skip?: number;
  limit?: number;
  [key: string]: string | number | undefined;
};
```

#### create src/shared/queryFilters.ts
```
import { Request } from 'express';
import { IFilters, IQueries } from '../interfaces/queryFilters';

const queryFilters = (
  query: Record<string, string | undefined>,
  req: Request
) => {
  let filters: IFilters = { ...query };
  const queries: IQueries = {};

  // sort, page, limit -> exclude
  const excludeFields: string[] = ['sort', 'page', 'limit', 'fields'];
  excludeFields.forEach((field: string) => delete filters[field]);

  // gt, gte, lt, lte
  let filtersString: string = JSON.stringify(filters);
  filtersString = filtersString.replace(
    /\b(gt|gte|lt|lte)\b/g,
    (match: string) => `$${match}`
  );

  filters = JSON.parse(filtersString);

  if (req.query.fields) {
    const fields: string = (req.query.fields as string).split(',').join(' ');
    queries.fields = fields;
  }

  if (req.query.sort) {
    const sort: string = (req.query.sort as string).split(',').join(' ');
    queries.sort = sort;
  }

  if (req.query.page || req.query.limit) {
    const { page = '1', limit = '10' } = req.query as {
      page?: string;
      limit?: string;
    };
    const skip: number = (parseInt(page, 10) - 1) * parseInt(limit, 10);

    queries.skip = skip;
    queries.limit = parseInt(limit, 10);
  }

  return {
    filters,
    queries,
  };
};

export default queryFilters;

```

### using queryFilters

#### in controller file
<!-- Example -->
```
import { Request, Response } from 'express';
import { UserService } from './user.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { IUser } from './user.interface';
import httpStatus from 'http-status';
import queryFilters from '../../../shared/queryFilters';


const getAllUsers = catchAsync(async (req: Request, res: Response) => {

  // filters by using queryFilters function
  const filters = queryFilters(
    req.query as Record<string, string | undefined>,
    req
  );

  const result = await UserService.getAllUsers(
    filters.filters,
    filters.queries
  );

  sendResponse<IUser[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Semesters retrieved successfully !',
    meta: result.meta,
    data: result.data,
  });
});

export const UserController = {
  getAllUsers,
};

```

#### in service file
```
import { IUser } from './user.interface';
import { User } from './user.model';
import { IFilters, IQueries } from '../../../interfaces/queryFilters';
import { IGenericResponse } from '../../../interfaces/common';


const getAllUsers = async (
  filters: IFilters,
  queries: IQueries
): Promise<IGenericResponse<IUser[]>> => {
  const { limit = 0, skip, fields, sort } = queries;

  const resultQuery = User.find(filters)
    .skip(skip as number)
    .select(fields as string)
    .sort(sort)
    .limit(limit as number);

  const [result, total] = await Promise.all([
    resultQuery.exec(),
    User.countDocuments(filters),
  ]);

  const page = Math.ceil(total / limit);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

export const UserService = {
  getAllUsers,
};

```

## Search function

#### create src/shared/searcher.ts
```
import { IFilters } from '../interfaces/queryFilters';

const searcher = (filters: IFilters, arrayOfSearchFields: string[]) => {
  const { search, ...filtersData } = filters;
  const andConditions = [];

  if (search) {
    andConditions.push({
      $or: arrayOfSearchFields.map((field: string) => ({
        [field]: {
          $regex: search,
          $options: 'i',
        },
      })),
    });
  }

  if (Object.keys(filtersData).length) {
    andConditions.push({
      $and: Object.entries(filtersData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  const conditions = andConditions.length > 0 ? { $and: andConditions } : {};

  return conditions;
};

export default searcher;

```

#### using search with queryFilters in service file
<!-- Example user service -->
```
import { IUser } from './user.interface';
import { User } from './user.model';
import { IFilters, IQueries } from '../../../interfaces/queryFilters';
import searcher from '../../../shared/searcher';
import { IGenericResponse } from '../../../interfaces/common';


const getAllUsers = async (
  filters: IFilters,
  queries: IQueries
): Promise<IGenericResponse<IUser[]>> => {
  const conditions = searcher(filters, ['role', 'id']);
  const { limit = 0, skip, fields, sort } = queries;

  const resultQuery = User.find(conditions)
    .skip(skip as number)
    .select(fields as string)
    .sort(sort)
    .limit(limit as number);

  const [result, total] = await Promise.all([
    resultQuery.exec(),
    User.countDocuments(conditions),
  ]);

  const page = Math.ceil(total / limit);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

export const UserService = {
  getAllUsers,
};

```

#### Some Example Api for filters and search
```
await fetch("http://localhost:5000/api/v1/academic-semesters");
await fetch("http://localhost:5000/api/v1/academic-semesters?title=Summer&code=02&year[gte]=2024");
await fetch("http://localhost:5000/api/v1/academic-semesters?title=Summer&limit=2&page=1");
await fetch("http://localhost:5000/api/v1/academic-semesters?title=Summer&sort=-year,code");// sort by multiple filed name with descending and  ascending order

await fetch("http://localhost:5000/api/v1/academic-semesters?title=Summer&fields=-_id,title,year");// show and hide single filed or multiple fields or using together

<!-- output -->
 "  "data": [
    {
      "title": "Summer",
      "year": "2023"
    },
    {
      "title": "Summer",
      "year": "2024"
    },
    {
      "title": "Summer",
      "year": "2026"
    },
    {
      "title": "Summer",
      "year": "2028"
    }
  ]

  <!-- Search -->
  await fetch("http://localhost:5000/api/v1/academic-semesters?search=sum");
 <!-- Search with filters combine-->
 await fetch("http://localhost:5000/api/v1/academic-semesters?search=sum&startMonth=January&year[gte]=2023&sort=-year&page=2&limit=2");
```
# JWT
#### install jsonwebtoken, @types/jsonwebtoken and @types/cookie-parser
```
yarn add jsonwebtoken @types/jsonwebtoken @types/cookie-parser
```

#### src/app.ts
```
import cookieParser from 'cookie-parser';

//parser
app.use(cookieParser());
```

#### .env file
```
JWT_SECRET= 'very-secret'
JWT_EXPIRES_IN=1d
JWT_REFRESH_SECRET='very-refresh-secret'
JWT_REFRESH_EXPIRES_IN=365d
```

#### src/config/index.ts
```
  jwt: {
    secret: process.env.JWT_SECRET,
    refresh_secret: process.env.JWT_REFRESH_SECRET,
    expires_in: process.env.JWT_EXPIRES_IN,
    refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
  },
  ```
#### src/enums/user.ts
```
/* eslint-disable no-unused-vars */
export enum ENUM_USER_ROLE {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  STUDENT = 'student',
  FACULTY = 'faculty',
}
```
#### src/interfaces/index.d.ts
```
/* eslint-disable @typescript-eslint/consistent-type-definitions */
import { JwtPayload } from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      user: JwtPayload | null;
    }
  }
}
```

#### src/helpers/jwtHelpers.ts
```
import jwt, { JwtPayload, Secret } from 'jsonwebtoken';

const createToken = (
  payload: Record<string, unknown>,
  secret: Secret,
  expireTime: string
): string => {
  return jwt.sign(payload, secret, {
    expiresIn: expireTime,
  });
};

const verifyToken = (token: string, secret: Secret): JwtPayload => {
  return jwt.verify(token, secret) as JwtPayload;
};

export const jwtHelpers = {
  createToken,
  verifyToken,
};
```
#### src/app/middlewares/auth.ts
```
import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { Secret } from 'jsonwebtoken';
import config from '../../config';
import ApiError from '../../errors/ApiError';
import { jwtHelpers } from '../../helpers/jwtHelpers';

const auth =
  (...requiredRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      //get authorization token
      const token = req.headers.authorization;
      if (!token) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'You are not authorized');
      }
      // verify token
      let verifiedUser = null;

      verifiedUser = jwtHelpers.verifyToken(token, config.jwt.secret as Secret);

      req.user = verifiedUser; // role  , userid

      // role diye guard korar jnno
      if (requiredRoles.length && !requiredRoles.includes(verifiedUser.role)) {
        throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');
      }
      next();
    } catch (error) {
      next(error);
    }
  };

export default auth;
```

### Uses of JWT
#### Check the user and auth module for details







