package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/odewahn/react-golang-auth/backend/handler"
)

// Login captures the data posted to the /login route
func Login(env *handler.Env, w http.ResponseWriter, r *http.Request) error {
	dat, _ := ioutil.ReadAll(r.Body) // Read the body of the POST request
	// Unmarshall this into a map
	var params map[string]string
	json.Unmarshal(dat, &params)

	secret := r.Header.Get("x-authentication")

	log.Println("login from", params["Username"], "with password", params["Password"])
	log.Println("secret from the header is", secret)
	fmt.Fprintf(w, "{\"token\": \""+env.Secret+"\"}\n")

	return nil
}

func main() {
	// Initialise our app-wide environment data we'll send to the handler
	env := &handler.Env{
		Secret: "biscuits and gravy",
	}

	r := mux.NewRouter()

	// Test this with
	//    curl -v -X POST -d "{\"username\":\"odewahn\", \"password\":\"password\"}" --header "X-Authentication: eddieTheYeti" localhost:3000/login
	r.Handle("/login", handler.Handler{env, Login}).Methods("POST", "OPTIONS")

	port := "3001" // this is the gin port, but the app port is exposed at 3000
	http.ListenAndServe(":"+port, r)

}
