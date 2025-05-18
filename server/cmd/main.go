package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/KaranJayakumar/remember/ent"
	"github.com/KaranJayakumar/remember/ent/connection"
	"github.com/KaranJayakumar/remember/ent/migrate"
	"github.com/clerk/clerk-sdk-go/v2"
	clerkhttp "github.com/clerk/clerk-sdk-go/v2/http"
	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
)

func main() {
	client, err := ent.Open("postgres", os.Getenv("POSTGRES_ENT_CONN_STRING"))

	if err != nil {
		log.Fatalf("failed connecting to postgres: %v", err)

	}

	defer client.Close()
	ctx := context.Background()
	if err := client.Schema.Create(ctx, migrate.WithDropIndex(true), migrate.WithDropColumn(true)); err != nil {

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
	middleware := clerkhttp.RequireHeaderAuthorization()
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
		claims, ok := clerk.SessionClaimsFromContext(c.Request.Context())
		if !ok {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
			return
		}
		userId := claims.Subject
		connections, err := client.Connection.
			Query().
			Where(connection.ParentUserIdEQ(userId)).
			All(c.Request.Context())

		if err != nil {
			fmt.Printf("An error occured while fetching connections %s", err)

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
