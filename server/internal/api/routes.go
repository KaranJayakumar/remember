package api

import (
	"log"
	"net/http"
	"github.com/KaranJayakumar/remember/internal/api/middleware"
	"github.com/gin-gonic/gin"
)

func RegisterRoutes(router *gin.Engine){
	router.GET("/health", Test())
	router.GET("/workspaces", middleware.ClerkAuthMiddleware(), GetWorkspaces())

	router.GET("/workspaces/:workspace_id/connections", middleware.ClerkAuthMiddleware(), GetConnections())
	router.POST("/workspaces/:workspace_id/connections", middleware.ClerkAuthMiddleware(), CreateConnection())
	router.DELETE("/connections/:connection_id", middleware.ClerkAuthMiddleware(), DeleteConnection())

	router.POST("/connections/:connection_id/notes", middleware.ClerkAuthMiddleware(), CreateNote())
	router.GET("/connections/:connection_id/notes", middleware.ClerkAuthMiddleware(), GetNotes())

	router.PUT("/notes/:note_id", middleware.ClerkAuthMiddleware(), UpdateNote())
	router.DELETE("/notes/:note_id", middleware.ClerkAuthMiddleware(), DeleteNote())

	router.POST("/connections/:connection_id/tags", middleware.ClerkAuthMiddleware(), CreateTag())
	router.GET("/connections/:connection_id/tags", middleware.ClerkAuthMiddleware(), GetTags())

	router.PUT("/tags/:tag_id", middleware.ClerkAuthMiddleware(), UpdateTag())
	router.DELETE("/tags/:tag_id", middleware.ClerkAuthMiddleware(), DeleteTag())

	// Upload route
	router.POST("/upload/url", middleware.ClerkAuthMiddleware(), GetPresignedUploadURL())


}
func Test() gin.HandlerFunc {
	return func(c *gin.Context) {
		log.Println("[healthcheck] Request received")
		c.JSON(http.StatusOK, gin.H{"status": "ok"})
	}
}
