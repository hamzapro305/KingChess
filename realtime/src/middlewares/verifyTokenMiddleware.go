package middlewares

import "github.com/gofiber/fiber/v2"

func ProtectedRoute() fiber.Handler {
	return func(c *fiber.Ctx) error {
		return c.Next()
	}
}

func ProtectedRouteForWebsocket() fiber.Handler {
	return func(c *fiber.Ctx) error {
		return c.Next()
	}
}
