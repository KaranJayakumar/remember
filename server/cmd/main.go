package main

import (
	"context"
	"fmt"
	"log"
	"os"

	"github.com/KaranJayakumar/remember/ent"
	"github.com/KaranJayakumar/remember/ent/migrate"
	"github.com/clerk/clerk-sdk-go/v2"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
	"net/http"
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
	router.Use(cors.Default())

	router.GET("/test", Test(client))

	router.GET("/workspaces", AuthMiddleware(), GetWorkspaces(client))

	router.GET("/workspaces", AuthMiddleware(), GetWorkspaces(client))

	router.GET("/workspaces/:workspace_id/connections", AuthMiddleware(), GetConnections(client))
	router.POST("/workspaces/:workspace_id/connections", AuthMiddleware(), CreateConnection(client))

	router.POST("/connections/:connection_id/notes", AuthMiddleware(), CreateNote(client))
	router.GET("/connections/:connection_id/notes", AuthMiddleware(), GetNotes(client))

	router.PUT("/notes/:note_id", AuthMiddleware(), UpdateNote(client))
	router.DELETE("/notes/:note_id", AuthMiddleware(), DeleteNote(client))

	router.POST("/connections/:connection_id/tags", AuthMiddleware(), CreateTag(client))
	router.GET("/connections/:connection_id/tags", AuthMiddleware(), GetTags(client))

	router.PUT("/tags/:tag_id", AuthMiddleware(), UpdateTag(client))
	router.DELETE("/tags/:tag_id", AuthMiddleware(), DeleteTag(client))

	router.Run(":4444")

}
func Test(client *ent.Client) gin.HandlerFunc {
	return func(c *gin.Context) {
		log.Println("GOT THE REQUEST")
		c.JSON(http.StatusOK, gin.H{"status": "ok"})
	}
}
