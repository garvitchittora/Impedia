<h1 align="center">
    <a href="https://github.com/garvitchittora/Impedia"><img src="https://i.imgur.com/uWemPNc.png" alt="impedia"></a>
</h1>

<h3 align="center">A centralized appeal management system.</h3>

---

<h4 align="center">
  <a href="#About">About</a> •
  <a href="#Installation">Installation</a> •
  <a href="#Getting-Started">Getting Started</a> •
  <a href="#Testing">Testing</a>
</h4>

---
<br>

# About

<h4>
Impedia is a centralized appeal management system or in more detail, it is a web application which will enable proper communication of issues or appeals made by students to appropriate faculty members or authorities for any organization, or in our use case, for IIITA.
</h4>
<br>

It aims to:
* Enable proper communication of issues or appeals made by students to appropriate faculty members or authorities
* Increase the efficiency of the current appeal mechanism(email) and prevent flooding of inboxes
* Give common issues a platform in the form of petitions
* Have a flexible structure so any organization can host their separate version and their admin can add their respective authorities, faculty groups and specify their email domain so students under that domain can join the platform.

<br>

# Installation

### Host System Package Dependencies

* NodeJS
* NPM
* MongoDB

<br>

```sh
git clone https://github.com/garvitchittora/Impedia
cd Impedia
```

Terminal Instance 1: Backend
```sh
cd backend
npm install
npm start
```

Terminal Instance 1: Frontend
```sh
cd frontend/impedia
npm install
npm start
```
and navigate to `localhost:3000` in your browser. The Backend API will be running at `localhost:3001`

# Getting Started

First you have to generate admin credentials. Open another terminal in the backend folder and run
```sh
npm run generate-admin
```
This will generate Admin credentials you can use to login as an admin.

As an admin you now add emails for authorities of your organization, and they will be sent invitation emails to join the platform.

You can then add your organization domain and then students with emails under that domain would be able to come and register for the platform.

And thats it! Thats all the setup needed, the students can now make appeals/petitions and authorities can respond to them while admin can overlook all activities happening on the platform.

# Testing

The project includes unit tests for testing all the routes and controllers, written using jest and supertest.

```sh
cd backend
npm install
```

Run all tests
```sh
npm run test
```

Get coverage of unit tests
```sh
npm run coverage
```