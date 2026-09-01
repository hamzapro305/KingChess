package main

import (
	"fmt"
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/hamzapro305/GoLangChatApp/src/routes"
	"github.com/joho/godotenv"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, continuing with environment variables")
	}

	app := fiber.New(fiber.Config{
		BodyLimit: 100 * 1024 * 1024,
	})

	app.Use(cors.New())
	routes.SetupRoutes(app)

	if err := app.Listen(":3001"); err != nil {
		fmt.Printf("Error starting server: %v\n", err)
	}
}
