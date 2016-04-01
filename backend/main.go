package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"time"

	jwt "github.com/dgrijalva/jwt-go"
	"github.com/gorilla/mux"
	"github.com/odewahn/react-golang-auth/backend/handler"
)

// Creds holds the credentials we send back
type Creds struct {
	Status      string
	APIKey      string
	AccountType string
	Email       string
	AuthToken   string
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
		AuthToken:   "",
		IsLoggedIn:  false,
	}
	if (username == "admin") && (password == "admin") {
		credentials.Status = "OK"
		credentials.APIKey = "12345"
		credentials.AccountType = "admin"
		credentials.Email = "admin@example.com"
		credentials.IsLoggedIn = true
		// Now create a JWT for user
		// Create the token
		token := jwt.New(jwt.SigningMethodHS256)
		// Set some claims
		token.Claims["sub"] = username
		token.Claims["iss"] = "example.com"
		token.Claims["exp"] = time.Now().Add(time.Hour * 72).Unix()
		var err error
		credentials.AuthToken, err = token.SignedString([]byte(env.Secret))
		if err != nil {
			log.Println(err)
		}
	}
	return credentials
}

// FakeData provides some fake data for testing...
func FakeData(env *handler.Env, w http.ResponseWriter, r *http.Request) error {
	secret := r.Header.Get("x-authentication")
	log.Println("Fake data called with header", secret)
	data := []int{3, 1, 4, 5, 9, 2, 7}
	out, _ := json.MarshalIndent(&data, "", "  ")
	fmt.Fprintf(w, string(out))
	return nil
}

// Login captures the data posted to the /login route
func Login(env *handler.Env, w http.ResponseWriter, r *http.Request) error {
	dat, _ := ioutil.ReadAll(r.Body) // Read the body of the POST request
	// Unmarshall this into a map
	var params map[string]string
	json.Unmarshal(dat, &params)

	credentials := GetCredentials(env, params["Username"], params["Password"])

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

	//This returns some fake data
	r.Handle("/data", handler.Handler{env, FakeData}).Methods("GET", "OPTIONS")

	port := "3001" // this is the gin port, but the app port is exposed at 3000
	http.ListenAndServe(":"+port, r)

}
