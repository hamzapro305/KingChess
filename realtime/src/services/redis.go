package services

import (
	"context"
	"encoding/json"
	"log"
	"os"
	"time"

	"github.com/redis/go-redis/v9"
)

func newSocketRedisClient() *redis.Client {
	addr := os.Getenv("REDIS_ADDR")
	if addr == "" {
		addr = "localhost:6379"
	}
	return redis.NewClient(&redis.Options{Addr: addr, DB: 0})
}

func (h *SocketHub) publish(event SocketEvent) {
	if h.redis == nil {
		return
	}

	payload, err := json.Marshal(event)
	if err != nil {
		log.Println("Failed to marshal socket event for Redis:", err)
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	if err := h.redis.Publish(ctx, h.channel, payload).Err(); err != nil {
		log.Println("Failed to publish socket event to Redis:", err)
	}
}

func (h *SocketHub) handleRedisEvent(payload string) {
	var event SocketEvent
	if err := json.Unmarshal([]byte(payload), &event); err != nil {
		log.Println("Invalid Redis socket payload:", err)
		return
	}
	if event.Source == h.id {
		return
	}
	if event.To != "" {
		h.deliverToUser(event.To, event)
		return
	}
	h.broadcastToAll(event)
}

func (h *SocketHub) consumeRedis() {
	ctx := context.Background()
	pubsub := h.redis.Subscribe(ctx, h.channel)
	defer pubsub.Close()

	for msg := range pubsub.Channel() {
		h.handleRedisEvent(msg.Payload)
	}
}
