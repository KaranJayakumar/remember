package main

import (
	"context"
	"fmt"
	"log"
	"os"

	"github.com/KaranJayakumar/remember/ent"
	"github.com/KaranJayakumar/remember/ent/connection"
	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
	"github.com/clerk/clerk-sdk-go/v2"
	"github.com/clerk/clerk-sdk-go/v2/jwt"
	"github.com/clerk/clerk-sdk-go/v2/user"
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
	authGroup := router.Group("/", ClerkAuthMiddleware())
	router.GET("/connection", getConnections(client))
	router.POST("/connection", createConnection(client))
	router.DELETE("/connection", deleteConnection(client))
	router.Run()
}
package main

import (
	"net/http"
	"strings"

	"github.com/clerk/clerk-sdk-go/v2/jwt"
	"github.com/clerk/clerk-sdk-go/v2/user"
	"github.com/gin-gonic/gin"
)

func ClerkAuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer ") {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Missing or invalid Authorization header"})
			return
		}
		token := strings.TrimPrefix(authHeader, "Bearer ")
		claims, err := jwt.Verify(c.Request.Context(), &jwt.VerifyParams{
			Token: token,
		})
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
			return
		}
		usr, err := user.Get(c.Request.Context(), claims.Subject)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
			return
		}
		fmt.Println("Successful authentication. Proceeding to request")
		c.Set("user", usr)
		c.Next()
	}
}


func getConnections(client *ent.Client) gin.HandlerFunc {
	return func(c *gin.Context) {
		usrRaw, exists := c.Get("user")
		connections, err := client.Connection.
			Query().
			Where(connection.ParentUserIdEQ(id)).
			All(c.Request.Context())

		if err != nil {
			fmt.Println("An error occured while fetching connections %s", err)
		}

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
