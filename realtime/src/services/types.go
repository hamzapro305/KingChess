package services

import (
	"sync"

	"github.com/gofiber/contrib/websocket"
	"github.com/redis/go-redis/v9"
)

type UserConnection struct {
	Conn *websocket.Conn
	Mu   *sync.Mutex
}

type SocketEvent struct {
	Type    string      `json:"type"`
	Source  string      `json:"source,omitempty"`
	From    string      `json:"from,omitempty"`
	To      string      `json:"to,omitempty"`
	Payload interface{} `json:"payload,omitempty"`
}

type SocketHub struct {
	mu      sync.RWMutex
	clients map[string]*UserConnection
	redis   *redis.Client
	channel string
	id      string
}
