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
	"github.com/KaranJayakumar/remember/ent/note"
	"github.com/KaranJayakumar/remember/ent/tag"
	"github.com/KaranJayakumar/remember/ent/workspace"
	"github.com/clerk/clerk-sdk-go/v2"
	"github.com/clerk/clerk-sdk-go/v2/jwt"
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
func GetWorkspaces(client *ent.Client) gin.HandlerFunc {
	return func(c *gin.Context) {
		claims, ok := clerk.SessionClaimsFromContext(c.Request.Context())
		if !ok {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
			return
		}

		workspaces, err := client.Workspace.
			Query().
			Where(workspace.OwnerUserIDEQ(claims.ID)).
			All(c.Request.Context())

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch workspaces"})
			return
		}
		if len(workspaces) == 0 {
			workspace, err := client.Workspace.
				Create().
				SetOwnerUserID(claims.ID).
				SetName("Default Workspace").
				Save(c.Request.Context())

			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create workspace"})
				return
			}
			workspaces = []*ent.Workspace{workspace}

		}

		c.JSON(http.StatusOK, workspaces)

	}
}

func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			fmt.Println("No Authorization header found")
			c.JSON(http.StatusUnauthorized, gin.H{"error": "User does not have a valid session token"})
			return
		}

		sessionToken := authHeader
		if len(authHeader) > 7 && authHeader[:7] == "Bearer " {
			sessionToken = authHeader[7:]
		}

		claims, err := jwt.Verify(context.Background(), &jwt.VerifyParams{
			Token: sessionToken,
		})
		if err != nil {
			fmt.Printf("Token verification failed: %v\n", err)
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
			return
		}

		ctx := clerk.ContextWithSessionClaims(c.Request.Context(), claims)
		c.Request = c.Request.WithContext(ctx)

		c.Set("claims", claims)
		c.Next()
	}
}
