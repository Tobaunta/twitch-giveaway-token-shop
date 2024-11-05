# Twitch Giveaway Token Shop

A small homepage (both backend and frontend) to handle giveaway items from twitch stream using twitch authentication with passport, database with MongoDB, and encrypting/decrypting keys with crypto.

## Backend

Using [Passport](https://www.npmjs.com/package/passport) with [Passport-Twitch-New](https://www.npmjs.com/package/passport-twitch-new) strategy to authenticate users with their [Twitch](https://www.twitch.tv) account and then adding the user to [MongoDB](https://www.mongodb.com) with [Mongoose](https://www.npmjs.com/package/mongoose) to handle giveaways and tokens.

Using crypto to encrypt and decrypt keys in [MongoDB](https://www.mongodb.com).

#### .ENV

- SESSION_SECRET="Secret Key For Sessions"
- CRYPTO_PASSPHRASE="Secret Key For Generating Public and Private Keypair"
- CRYPTO_PUBLIC_KEY="Public Key Generated with Keygen.js"
- CRYPTO_PRIVATE_KEY="Private Key Generated with Keygen.js"
- CLIENT_URL="Frontend URL"
- TWITCH_CLIENT_ID="Client ID generated from [Twitch](https://dev.twitch.tv/console/apps/)"
- TWITCH_CLIENT_SECRET="Client Secret generated from [Twitch](https://dev.twitch.tv/console/apps/)"
- MONGODB_URI="Your MongoDB connection string"

#### Routes

- /auth/login - Route for initiating the Twitch login process
- /auth/login/redirect - Callback route from Twitch after login process
- /auth/user - Route for fetching user
- /auth/logout - Route for logging out the user
- /giveaway/getGames - Fetch all available giveaway items
- /giveaway/getUsers - Fetch all users from database to handle tokens
- /giveaway/addGame - Add new giveaway item
- /giveaway/addToken/:username - Add a token to a specific user
- /giveaway/removeToken/:username - Remove a token from a specific user
- /giveaway/redeemGame - Redeem a game for a user with tokens
- /giveaway/decrypt - Decrypt an encrypted key

## Frontend

A simple Vite project using Typescript and MUI with components for all needed functions.

"ADD GAME" & "GIVE TOKENS" is only visible and accessable when logged in as an admin.

## Preview

#### Home Page

![Home Page](/preview/home.png)

#### Giveaway Page (Logged Out)

![Giveaway Page (Logged Out)](/preview/giveaway-logged-out.png)

#### Giveaway Page (Logged In without Tokens)

![Giveaway Page (Logged In without Tokens)](/preview/giveaway-logged-in-without-tokens.png)

#### Giveaway Page (Logged In with Tokens)

![Giveaway Page (Logged In with Tokens)](/preview/giveaway-logged-in-with-tokens.png)

#### Add Games Page

![Add Game](/preview/add-game.png)

#### Giveaway Tokens

![Giveaway Tokens](/preview/giveaway-token.png)
