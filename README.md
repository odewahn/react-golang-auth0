This repo has all the required bullshit boilerplate for a react frontend with a golang backend.  It uses:

* Golang app with Gorilla mux as the backend
* react-mdl for the design
* Redux and redux-thunk for state management
* React router to route stuff

I set it up to server as a micro-lab for working with various autentication options.  So, it presents a login form that will post to the backend app on `localhost:3000/login`.  I still need to:

* Set an auth token in the frontend that gets passed in the header
* add TLS support to encrypt it

## To run it

* Clone the repo
* `npm install`
* `npm run frontend`

Open your browser to `localhost:8000/dist`
