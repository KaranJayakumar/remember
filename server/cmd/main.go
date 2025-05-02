package main

import (
	"context"
	"log"
	"os"

	"github.com/KaranJayakumar/remember/ent"
	"github.com/KaranJayakumar/remember/ent/connection"
	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
)

func main() {
	client, err := ent.Open("postgres", "host=app_database port=5432 user=user dbname=remember password=password sslmode=disable")

	if err != nil {
		log.Fatalf("failed connecting to postgres: %v", err)
	}
	defer client.Close()
	ctx := context.Background()
	if err := client.Schema.WriteTo(ctx, os.Stdout); err != nil {
		log.Fatalf("failed printing schema changes: %v", err)
	}
	router := gin.Default()
	router.GET("/people", getConnections(client))
	router.POST("/people/{id}", createConnection(client))
	router.DELETE("/people", deleteConnection(client))
	router.Run()
}

func getConnections(client *ent.Client) gin.HandlerFunc {
	return func(c *gin.Context) {
		var input struct {
			Name string `json:"name"`
		}
		if err := c.BindJSON(&input); err != nil {
			return
		}

		var id = "abcd"
		connections, err := client.Connection.
			Query().
			Where(connection.ParentUserIdEQ(id)).
			All(c.Request.Context())
		if err != nil {
			return
		}

		_ = connections
		c.JSON(200, gin.H{"connections": connections})
	}
}

func createConnection(client *ent.Client) gin.HandlerFunc {
	return func(c *gin.Context) {
		var input struct {
			Name string `json:"name"`
		}
		if err := c.BindJSON(&input); err != nil {
			return
		}

		var id = "abcd"
		connection, err := client.Connection.
			Create().
			SetName(input.Name).
			SetParentUserId(id).
			Save(c.Request.Context())
		if err != nil {
			return
		}

		_ = connection
		c.JSON(200, gin.H{"connection": connection})
	}
}

func deleteConnection(client *ent.Client) gin.HandlerFunc {
	return func(c *gin.Context) {
		var input struct {
			Name string `json:"name"`
		}
		if err := c.BindJSON(&input); err != nil {
			c.JSON(400, gin.H{"error": "Invalid input"})
			return
		}

		var id = "abcd"

		affected, err := client.Connection.
			Delete().
			Where(
				connection.ParentUserIdEQ(id),
				connection.NameEQ(input.Name),
			).
			Exec(c.Request.Context())

		if err != nil {
			c.JSON(500, gin.H{"error": "Failed to delete connections"})
			return
		}

		c.JSON(200, gin.H{"deleted": affected})
	}
}
