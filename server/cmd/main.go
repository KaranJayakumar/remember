package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/KaranJayakumar/remember/ent"
	"github.com/KaranJayakumar/remember/ent/migrate"
	"github.com/clerk/clerk-sdk-go/v2"
	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
)

func main() {
	setupServer()
}

func setupServer() {
	client, err := ent.Open("postgres", os.Getenv("POSTGRES_ENT_CONN_STRING"))

	if err != nil {
		log.Fatalf("failed connecting to postgres: %v", err)
	}

	defer client.Close()
	ctx := context.Background()
	if err := client.Schema.Create(ctx, migrate.WithDropIndex(true), migrate.WithDropColumn(true)); err != nil {

		log.Fatalf("failed printing schema changes: %v", err)
	}
	clerk.SetKey(os.Getenv("CLERK_SECRET_KEY"))

	router := gin.Default()

	router.GET("/connections", AuthMiddleware(), GetConnections(client))
	router.GET("/workspaces", AuthMiddleware(), GetWorkspaces(client))
	router.POST("/connections", AuthMiddleware(), CreateConnection(client))

	router.Run()

}
