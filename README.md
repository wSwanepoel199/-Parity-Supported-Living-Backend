# Parity Supported Living Notes Backend

The backend server for Parity Supported Living Notes web application created with the express-generator script from [ExpressJS](https://expressjs.com/en/starter/generator.html). Created for use by Parity Supported Living Pty Lmt.

## Running PSL Notes Backend

Clone the [PSL Notes Backend](https://github.com/wSwanepoel199/-Parity-Supported-Living-Backend) repo.

Ensure node has been installed by running the following command in a console/terminal.

```bash
node --version
```

navigate into the cloned repo and run

```bash
npm i
```

Once installed create a .env file using

```bash
touch .env
```

Once the .env file is created open in and define the following values

```text
ACCESS_TOKEN_SECRET: A generated token used for signing access tokens
REFRESH_TOKEN_SECRET: A generated token used for signing refresh tokens

PORT: the port for the server to use

DATABASE_URL: The uri for database intended to be used with the server, a PostgreSQL database is recommended

FRONT_END: A list of front end URLs for CORS, each url should be seperated by a ', '
```

Once these values have been defined in your .env you can follow the steps in Starting the Server below.

### Starting the Server

Webpack dev and prod servers are setup to use https protocol, follow [mkcert]("https://github.com/FiloSottile/mkcert") instructions to install and generate the required key.pem and cert.pem in the certs folder

To run the dev server use

```bash
npm run dev
```

To run the production server use

```bash
npm run start
```

To access Prisma Studio

```bash
npm run studio
```

## Usage

PSL Notes Backend is intended to be used with [psl-notes](https://github.com/wSwanepoel199/Parity-Supported-Living), The front end application.

PSL Notes Backend provides several services for the front end;

- Auth Service: Allows for the creation user details and management of signed in users via an Authentication Token system that employes short term Auth Tokens with can be freely refreshed if a much more long term Refresh Token is provided. It also allows for users to be edited and deleted from the db, in addition to which clients are linked to specific users.
- Refresh Token Service: This service allows for the creation and storage of refresh tokens. It tracks exisiting refresh tokesn via storing them in the database. It also allows for deleting refresh tokens when a user signs out inorder to clear it from the db as well as any expired tokens to prevent old tokens from being used. It also allows for early clearing in any tokens when a user is updated inorder to force a clean signin.
- Post Service: This service controls the creation, editing and deleting of the various notes that get saved in the database. It also controls links between notes their carers and the linked clients.
- Client Service: This controls the creation, editing and deletion of clients from the database. It also controls which clients and linked to which users.
- Icon Service: This is a simple service that is reponsible for custom icon generations, which are generated as SVG's which are able to be saved to the database. When a user is deleted their Icon will be deleted as well inorder to avoid data bloat.
- File Service: This service allows for the processing of uploaded data from the front end. Including skipping over existing entries if only 1 of them are able to exisit at a time.

## Technologies Used

[Express](https://expressjs.com/) is used as the main backend server and [PostgreSQL](https://www.postgresql.org/) as the database. [Prisma.IO](https://www.prisma.io/) is used as the middle man between the Express server and the PostgreSQL database. [Nodemon](https://nodemon.io/) is used for an easier development experience and [Dicebear](https://www.dicebear.com/) is used for the user icon generation.

[JSONWebToken](https://jwt.io/) is used for auth and refresh token registration and validation and [BcryptJS](https://github.com/kelektiv/node.bcrypt.js/) is used for password encryption.

## Contributions

Contributions and suggestions welcome.
