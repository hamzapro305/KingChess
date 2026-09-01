package routes

import (
	"log"

	"github.com/gofiber/contrib/websocket"
	"github.com/gofiber/fiber/v2"
	"github.com/hamzapro305/GoLangChatApp/src/services"
)

func webSocketRoute(app *fiber.App) {
	app.Get("/ws", websocket.New(func(c *websocket.Conn) {
		token := c.Query("token")
		userID, _, err := services.VerifySocketToken(token)
		if err != nil {
			_ = c.WriteMessage(websocket.TextMessage, []byte(`{"type":"error","message":"Unauthorized"}`))
			_ = c.Close()
			return
		}

		services.SocketHubService.AddConnection(userID, c)
		log.Println("Socket connected for user:", userID)

		defer func() {
			services.SocketHubService.RemoveConnection(userID)
			_ = c.Close()
			log.Println("Socket disconnected for user:", userID)
		}()

		if err := c.WriteMessage(websocket.TextMessage, []byte(`{"type":"connected"}`)); err != nil {
			log.Println("Failed to send connected message:", err)
			return
		}

		for {
			messageType, msg, err := c.ReadMessage()
			if err != nil {
				log.Println("Socket read error:", err)
				break
			}

			switch messageType {
			case websocket.TextMessage:
				services.SocketHubService.HandleIncoming(userID, msg)
			case websocket.BinaryMessage:
				log.Println("Binary websocket payload ignored")
			default:
				log.Println("Unsupported websocket message type:", messageType)
			}
		}
	}))
}
