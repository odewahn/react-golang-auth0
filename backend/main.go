package main

import (
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/odewahn/react-mdl-boilerplate/backend/handler"
)

// Login captures the data posted to the /login route
func Login(env *handler.Env, w http.ResponseWriter, r *http.Request) error {
	dat, _ := ioutil.ReadAll(r.Body) // Read the body of the POST request
	// Unmarshall this into a map
	var params map[string]string
	json.Unmarshal(dat, &params)

	log.Println("login from", params["username"], "with password", params["password"])
	return nil
}

func main() {
	// Initialise our app-wide environment data we'll send to the handler
	env := &handler.Env{
		Secret: "biscuits and gravy",
	}

	r := mux.NewRouter()

	// Test this with
	//    curl -v -X POST -d "{\"username\":\"odewahn\", \"password\":\"password\"}" localhost:3000/login
	r.Handle("/login", handler.Handler{env, Login}).Methods("POST")

	port := "3001" // this is the gin port, but the app port is exposed at 3000
	http.ListenAndServe(":"+port, r)

}
