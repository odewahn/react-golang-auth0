package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"log"
	"math/rand"
	"net/http"
	"strconv"
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

func myLookupKey(key string) []byte {
	return []byte(key)
}

func hasValidToken(jwtToken, key string) bool {
	ret := false
	token, err := jwt.Parse(jwtToken, func(token *jwt.Token) (interface{}, error) {
		// Don't forget to validate the alg is what you expect:
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("Unexpected signing method: %v", token.Header["alg"])
		}
		return myLookupKey(key), nil
	})

	if err == nil && token.Valid {
		ret = true
	}
	return ret
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

	// If this is an OPTION method, then we don't do anything since it's just
	// validating the preflight info
	if r.Method == "OPTIONS" {
		return nil
	}

	// Validate the API call
	secret := r.Header.Get("x-authentication")
	isValid := hasValidToken(secret, env.Secret)
	if !isValid {
		return handler.StatusError{401, errors.New("Invalid authorization token")}
	}

	// If we get here, then we've got a valid call.  So, go ahead and
	// process the request.  In this instance, all we want to do
	// is pass back a list of integers that is N items long
	N, err := strconv.Atoi(r.FormValue("N"))
	if err != nil {
		N = 10
	}

	// Create N random integers
	rand.Seed(time.Now().UTC().UnixNano())
	var data []int
	for i := 0; i < N; i++ {
		data = append(data, rand.Intn(100))
	}

	time.Sleep(1 * time.Second) // just for fun, pause a bit

	// return the results
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
