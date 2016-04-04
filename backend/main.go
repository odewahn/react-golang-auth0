package main

import (
	"encoding/base64"
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"math/rand"
	"net/http"
	"os"
	"strconv"
	"time"

	jwt "github.com/dgrijalva/jwt-go"
	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
	"github.com/odewahn/react-golang-auth/backend/handler"
)

func myLookupKey(key string) []byte {
	decoded, err := base64.URLEncoding.DecodeString(key)
	if err != nil {
		return nil
	}
	return []byte(decoded)
}

func hasValidToken(jwtToken, key string) bool {
	ret := false
	token, err := jwt.Parse(jwtToken, func(token *jwt.Token) (interface{}, error) {
		// Don't forget to validate the alg is what you expect:
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("Unexpected signing method: %v", token.Header["alg"])
		}
		log.Println("token is", token)
		return myLookupKey(key), nil
	})

	if err == nil && token.Valid {
		ret = true
	}
	return ret
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
	log.Println("header key is:", secret)

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

func main() {

	// Initialise our app-wide environment data we'll send to the handler
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	log.Println("Key is: ", os.Getenv("AUTH0_CLIENT_SECRET"))
	env := &handler.Env{
		Secret: os.Getenv("AUTH0_CLIENT_SECRET"),
	}

	r := mux.NewRouter()

	//This returns some fake data
	r.Handle("/data", handler.Handler{env, FakeData}).Methods("GET", "OPTIONS")

	port := "3001" // this is the gin port, but the app port is exposed at 3000
	http.ListenAndServe(":"+port, r)

}
