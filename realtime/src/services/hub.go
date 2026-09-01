package services

import (
	"context"
	"encoding/json"
	"log"
	"os"
	"sync"
	"time"

	"github.com/gofiber/contrib/websocket"
	"github.com/google/uuid"
)

func NewSocketHub() *SocketHub {
	channel := os.Getenv("REDIS_SOCKET_CHANNEL")
	if channel == "" {
		channel = "socket:events"
	}

	hub := &SocketHub{
		clients: make(map[string]*UserConnection),
		channel: channel,
		id:      uuid.NewString(),
		redis:   newSocketRedisClient(),
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := hub.redis.Ping(ctx).Err(); err != nil {
		log.Printf("Redis not available at %s, continuing without distributed fanout: %v\n", hub.redis.Options().Addr, err)
		hub.redis = nil
		return hub
	}

	go hub.consumeRedis()
	return hub
}

func (h *SocketHub) AddConnection(userID string, conn *websocket.Conn) {
	if userID == "" {
		return
	}

	h.mu.Lock()
	h.clients[userID] = &UserConnection{Conn: conn, Mu: &sync.Mutex{}}
	h.mu.Unlock()
}

func (h *SocketHub) RemoveConnection(userID string) {
	if userID == "" {
		return
	}

	h.mu.Lock()
	delete(h.clients, userID)
	h.mu.Unlock()
}

func parseSocketEvent(raw []byte) (SocketEvent, error) {
	var event SocketEvent
	if err := json.Unmarshal(raw, &event); err != nil {
		return SocketEvent{}, err
	}
	if event.Type == "" {
		event.Type = "message"
	}
	return event, nil
}

func marshalSocketEvent(event SocketEvent) ([]byte, error) {
	return json.Marshal(event)
}

func (h *SocketHub) writeSocketEvent(conn *websocket.Conn, event SocketEvent) {
	payload, err := marshalSocketEvent(event)
	if err != nil {
		log.Println("Failed to marshal socket event:", err)
		return
	}

	if err := conn.WriteMessage(websocket.TextMessage, payload); err != nil {
		log.Println("Failed to write socket event:", err)
	}
}

func (h *SocketHub) HandleIncoming(userID string, raw []byte) {
	event, err := parseSocketEvent(raw)
	if err != nil {
		log.Println("Invalid websocket payload:", err)
		return
	}

	event.From = userID
	event.Source = h.id

	if event.To != "" {
		h.publish(event)
		h.deliverToUser(event.To, event)
		return
	}

	h.broadcastToAll(event)
	h.publish(event)
}

func (h *SocketHub) getClientsSnapshot() []*UserConnection {
	h.mu.RLock()
	defer h.mu.RUnlock()

	clients := make([]*UserConnection, 0, len(h.clients))
	for _, client := range h.clients {
		clients = append(clients, client)
	}
	return clients
}

func (h *SocketHub) broadcastToAll(event SocketEvent) {
	for _, client := range h.getClientsSnapshot() {
		client.Mu.Lock()
		h.writeSocketEvent(client.Conn, event)
		client.Mu.Unlock()
	}
}

func (h *SocketHub) deliverToUser(userID string, event SocketEvent) {
	h.mu.RLock()
	client, ok := h.clients[userID]
	h.mu.RUnlock()
	if !ok {
		return
	}

	client.Mu.Lock()
	defer client.Mu.Unlock()
	h.writeSocketEvent(client.Conn, event)
}
