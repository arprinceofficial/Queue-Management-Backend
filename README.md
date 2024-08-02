## Node Express Prisma Boilerplate

Starter template for your Express Prisma MySQL API

## 🍔 Stack Specs

- Node.js
- Express
- Prisma
- MySQL

## 🧬 Install dependencies

```
yarn install / npm install

npm i prisma

npm i body-parser

npm i express

npm i bcrypt

npm i path

npm i multer

npm i @babel/core

npm i @babel/cli

npm install nodemailer prisma

npm i cors

npm i exceljs

npm i pdfkit

```

## Create a Database in MySQL (or) You can use GUI to create a database

```
mysql> CREATE DATABASE express;
```

- Copy the `.env.sample` file as `.env`

```
cp .env.sample .env
```

- Edit the MySQL Details in the `.env` file

```
DATABASE_URL="mysql://USERNAME:PASSWORD@localhost:3306/DBNAME?schema=public"
```

- Push the Prisma Schema into Database

```
npx prisma migrate dev
```

- Seed the Database with some data

```
npm run seed
```

- Update/Add New Column the Prisma Schema into Database

```
npx prisma migrate dev updateDB addNewColoumn
```
- Apply the changes to the database without generating a migration file(if needed)

```
npx prisma migrate deploy
```

- Generate the Prisma Client

```
npx prisma generate
```

## Run the development server

```
yarn dev

npm run dev

```

## 🚀 Production Build

- Run the production build

```
yarn build
npm run build
```

## 🚀 Start the production server

```
yarn start
npm run start

```

> Your production build is available on `dist` folder


## 🚀 assets folders

- /assets/images
- /assets/images/profile_images
- /assets/images/passport_images

```