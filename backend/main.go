package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/odewahn/react-golang-auth/backend/handler"
)

// Creds holds the credentials we send back
type Creds struct {
	Status      string
	APIKey      string
	AccountType string
	Email       string
	IsLoggedIn  bool
}

// GetCredentials determines if the username and password is valid
// This is where logic would go to validate and return account info
func GetCredentials(env *handler.Env, username, password string) Creds {
	credentials := Creds{
		Status:      "UNAUTHORIZED",
		APIKey:      "",
		AccountType: "",
		Email:       "",
		IsLoggedIn:  false,
	}
	if (username == "admin") && (password == "admin") {
		credentials.Status = "OK"
		credentials.APIKey = "12345"
		credentials.AccountType = "admin"
		credentials.Email = "admin@example.com"
		credentials.IsLoggedIn = true
	}
	return credentials
}

// Login captures the data posted to the /login route
func Login(env *handler.Env, w http.ResponseWriter, r *http.Request) error {
	dat, _ := ioutil.ReadAll(r.Body) // Read the body of the POST request
	// Unmarshall this into a map
	var params map[string]string
	json.Unmarshal(dat, &params)

	credentials := GetCredentials(env, params["Username"], params["Password"])

	//secret := r.Header.Get("x-authentication")

	out, _ := json.MarshalIndent(&credentials, "", "  ")
	fmt.Fprintf(w, string(out))

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
