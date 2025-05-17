package main

import (
	"context"
	"fmt"
	"github.com/KaranJayakumar/remember/ent"
	"github.com/KaranJayakumar/remember/ent/connection"
	clerkhttp "github.com/clerk/clerk-sdk-go/v2/http"
	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
	"log"
	"net/http"
	"os"
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

	authorized := router.Group("/")

	authorized.Use(ClerkMiddleware())
	{
		authorized.GET("/connection", getConnections(client))
		authorized.POST("/connection", createConnection(client))
		authorized.DELETE("/connection", deleteConnection(client))
	}
	router.Run()
}
func ClerkMiddleware() gin.HandlerFunc {
	middleware := clerkhttp.WithHeaderAuthorization()
	return func(c *gin.Context) {
		handler := middleware(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			c.Request = r
			c.Next()
		}))
		handler.ServeHTTP(c.Writer, c.Request)
	}
}

func getConnections(client *ent.Client) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := "abcd"
		connections, err := client.Connection.
			Query().
			Where(connection.ParentUserIdEQ(id)).
			All(c.Request.Context())

		if err != nil {
			fmt.Println("An error occured while fetching connections %s", err)

		}

		c.JSON(200, gin.H{"connections": connections})
		return
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
