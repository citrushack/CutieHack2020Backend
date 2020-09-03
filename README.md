# Cutie Hack Frontend

Backend for cutie hack 2020, created using [Strapi](https://strapi.io).

## Get started

You must have node and yarn installed.

Clone the repository 

```bash
git clone https://github.com/citrushack/CutieHack2020Backend.git
cd CutieHack2020Frontend
```

## Set up a free MongoDB atlas database

[From the strapi docs:](https://strapi.io/documentation/3.0.0-beta.x/guides/databases.html#mongodb-installation)

Follow these steps to configure a local Strapi project to use a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) free 512 MB account in production. (Please see [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/getting-started/) if you have any questions.)

- You must have already [created your Strapi project using MongoDB](databases.md#install-strapi-locally-with-mongodb).
- You must have already created a [free MongoDB Atlas account](https://www.mongodb.com/cloud/atlas).

#### 1. Log in to your account to create a **Project** and a **Cluster**

- First you need to `Create a new Project`.
- Then click `Build a Cluster`, from the options page:
  - Choose **AWS** as your **Cloud Provider & Region**.
  - Select a **Region**. (Note: some **Regions** do not have a _free tier_.)
  - In **Cluster Tier**, select **Shared Sandbox**, _Tier_ `MO`.
  - In **Cluster Name**, name your cluster.
- Click the green `Create Cluster` button. You will get a message that says, "_Your cluster is being created..._"

#### 2. Next, click on the `Database Access` in the left menu (under `Overview`):

- Click the green `+ ADD NEW USER` button:
  - Enter a `username`.
  - Enter a `password`.
  - Under `User Privileges` ensure **`Read and write to any database`** is selected. Then click `Add User` to save.

#### 3. Then `whitelist` your IP address. Click into `Network Access`, under `Security` in the left menu:

- Click the green `+ ADD IP ADDRESS`

  - Click `ADD CURRENT IP ADDRESS` or **manually** enter in an IP address to `whitelist`.
  - Leave a comment to label this IP Address. E.g. `Office`.
  - Then click the green `Confirm` button.
  - Delete the `0.0.0.0/0` configuration after testing the connection.

#### 4. Retrieve database credentials

MongoDB Atlas automatically exposes the database credentials into a single environment variable accessible by your app. To locate it, follow these steps:

- Under `Atlas` in the left-hand, click on `Clusters`. This should take you to your `cluster`. Next, click `CONNECT` and then `Connect Your Application`.
- Under `1. Choose your driver version`, select **DRIVER** as `Node.js` and **VERSION** as `2.2.12 or later`.
  ::: warning
  You **must** use `Version: 2.2.12 or later`.
  :::
- This should show a **Connection String Only** similar to this:

`mongodb://paulbocuse:<password>@strapi-heroku-shard-00-00-oxxxo.mongodb.net:27017,strapi-heroku-shard-00-01-oxxxo.mongodb.net:27017,strapi-heroku-shard-00-02-oxxxo.mongodb.net:27017/test?ssl=true&replicaSet=Strapi-Heroku-shard-0&authSource=admin&retryWrites=true&w=majority`


Now, fill in the details from this string into `config/database.js`

```
module.exports = ({ env }) => ({
  defaultConnection: 'default',
  connections: {
    default: {
      connector: 'mongoose',
      settings: {
        host: '' /* '.....-00-00-oxxxo.mongodb.net:27017,....-00-01-oxxxo.mongodb.net:27017,....-00-02-oxxxo.mongodb.net:27017'
                  all 3 hosts seperated by commas here */ ,
        srv: false,
        port: 27017,
        database:  '' /*your database name here */ ,,
        username:  '' /*your username here */ ,
        password:  '' /*<password> here*/,
      },
      options: {
        ssl: env.bool('DATABASE_SSL', true),
      },
    },
  },
});

```


::: warning
Please note the `<password>` after your `username`. In this example, after `mongodb://paulbocuse:`. You will need to replace the `<password>` with the password you created earlier for this user in your **MongoDB Atlas** account.
:::


#### Install dependencies and start the server

```bash
# Using yarn
yarn install
yarn build
yarn develop
```

The server should launch at [http://localhost:1337](http://localhost:1337).
