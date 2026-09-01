package services

import (
	"errors"
	"fmt"
	"os"
	"strings"

	"github.com/golang-jwt/jwt/v5"
)

func getSocketJWTSecret() string {
	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		secret = "asdhksjfhaksdgijshdkvbxkjlhsadkfhjkhsalkdjfhksjladhguihywerihfjkaksdlasd"
	}
	return secret
}

func normalizeSocketToken(rawToken string) string {
	trimmed := strings.TrimSpace(rawToken)
	trimmed = strings.TrimPrefix(trimmed, "Bearer ")
	return strings.TrimSpace(trimmed)
}

func extractUserIDFromClaims(claims jwt.MapClaims) (string, error) {
	for _, key := range []string{"sub", "id", "userId"} {
		if value, ok := claims[key].(string); ok && value != "" {
			return value, nil
		}
	}
	return "", errors.New("token does not contain user id")
}

func VerifySocketToken(rawToken string) (string, string, error) {
	if rawToken == "" {
		return "", "", errors.New("missing websocket token")
	}

	tokenString := normalizeSocketToken(rawToken)
	if tokenString == "" {
		return "", "", errors.New("missing websocket token")
	}

	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(getSocketJWTSecret()), nil
	})
	if err != nil {
		return "", "", err
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok || !token.Valid {
		return "", "", errors.New("invalid websocket token claims")
	}

	userID, err := extractUserIDFromClaims(claims)
	if err != nil {
		return "", "", err
	}

	email, _ := claims["email"].(string)
	return userID, email, nil
}
