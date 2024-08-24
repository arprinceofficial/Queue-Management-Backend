## Node Express Prisma Queue Management System

Starter project for Node.js with Express, Prisma, MySQL, and Queue Management System.

## 🍔 Stack Specs

- Node.js
- Express
- Prisma
- MySQL

## 🧬 Dependencies Install

```
yarn install / npm install

npm i prisma

npm i body-parser

npm i express

npm i bcrypt

npm i path

npm i multer

npm install nodemailer prisma

npm i cors

npm install @prisma/client@5.18.0

```

## Create a Database in MySQL (or) You can use GUI to create a database

```
mysql> CREATE DATABASE express;
```

- Copy the `.env.sample` file as `.env`

```
cp .env.sample .env
```
```
cp ".env(example)" .env
```

- Edit the MySQL Details in the `.env` file

```
DATABASE_URL="mysql://USERNAME:PASSWORD@localhost:3306/DBNAME"
```

- Push the Prisma Schema into Database

```
npx prisma migrate dev
```

- Seed the Database with some data

```
npm run seed
```

- Run Custom Seed File

```
npx ts-node ./prisma/seed-custom.js
```

- Generate the Prisma Client

```
npx prisma generate
```

## Add New Model (Table) in Prisma Schema

```
npx prisma migrate dev --create-only
npx prisma migrate deploy

```

## Update/Add New Column the Prisma Schema

```
npx prisma migrate dev updateDB or 
```
```
npx prisma migrate dev addNewColoumn 
```
## Executed the Migration Command if you make relation (table) changes in the Prisma Schema

```
npx prisma migrate dev
```
## Apply the changes to the database without generating a migration file(if needed)

```
npx prisma migrate deploy
```

## Run the development server

```
yarn dev

npm run dev

```

## 🚀 Start the production server

```
yarn start
npm run start

```

## 🚀 assets folders

- /assets/images
- /assets/images/profile_images

```