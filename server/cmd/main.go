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

	router.GET("/connections/:workspace_id", AuthMiddleware(), GetConnections(client))
	router.GET("/workspaces", AuthMiddleware(), GetWorkspaces(client))
	router.POST("/connections", AuthMiddleware(), CreateConnection(client))

	router.POST("/notes", AuthMiddleware(), CreateNote(client))
	router.GET("/notes/:connection_id", AuthMiddleware(), GetNotes(client))
	router.PUT("/notes/:note_id", AuthMiddleware(), UpdateNote(client))
	router.DELETE("/notes/:note_id", AuthMiddleware(), DeleteNote(client))

	router.POST("/tags", AuthMiddleware(), CreateTag(client))
	router.GET("/tags/:connection_id", AuthMiddleware(), GetTags(client))
	router.PUT("/tags/:tag_id", AuthMiddleware(), UpdateTag(client))
	router.DELETE("/tags/:tag_id", AuthMiddleware(), DeleteTag(client))

	router.Run()

}
