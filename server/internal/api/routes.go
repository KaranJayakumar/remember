package api

import (
	"github.com/KaranJayakumar/remember/internal/api/handlers"
	"github.com/KaranJayakumar/remember/internal/api/middleware"
	"github.com/gin-gonic/gin"
)

func RegisterRoutes(
	router *gin.Engine,
	workspaceHandler *handlers.WorkspaceHandler,
	connectionHandler *handlers.ConnectionHandler,
	noteHandler *handlers.NoteHandler,
	interactionHandler *handlers.InteractionHandler,
	uploadHandler *handlers.UploadHandler,
) {
	defaultGroup := router.Group("")
	defaultGroup.Use(middleware.AuthMiddleware())
	defaultGroup.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok"})
	})

	defaultGroup.GET("/workspaces", workspaceHandler.List)

	defaultGroup.GET("/workspaces/:workspace_id/connections", connectionHandler.List)
	defaultGroup.POST("/workspaces/:workspace_id/connections", connectionHandler.Create)
	defaultGroup.GET("/connections/:connection_id", connectionHandler.Get)
	defaultGroup.DELETE("/connections/:connection_id", connectionHandler.Delete)

	defaultGroup.POST("/connections/:connection_id/notes", noteHandler.Create)
	defaultGroup.GET("/connections/:connection_id/notes", noteHandler.List)
	defaultGroup.DELETE("/notes/:note_id", noteHandler.Delete)

	defaultGroup.POST("/connections/:connection_id/interactions", interactionHandler.Create)
	defaultGroup.GET("/connections/:connection_id/interactions", interactionHandler.List)
	defaultGroup.DELETE("/interactions/:interaction_id", interactionHandler.Delete)

	defaultGroup.POST("/upload/url", uploadHandler.GetPresignedURL)
}
