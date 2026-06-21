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
	router.GET("/test", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok"})
	})

	router.GET("/workspaces", middleware.ClerkAuthMiddleware(), workspaceHandler.List())

	router.GET("/workspaces/:workspace_id/connections", middleware.ClerkAuthMiddleware(), connectionHandler.List())
	router.POST("/workspaces/:workspace_id/connections", middleware.ClerkAuthMiddleware(), connectionHandler.Create())
	router.GET("/connections/:connection_id", middleware.ClerkAuthMiddleware(), connectionHandler.Get())
	router.DELETE("/connections/:connection_id", middleware.ClerkAuthMiddleware(), connectionHandler.Delete())

	router.POST("/connections/:connection_id/notes", middleware.ClerkAuthMiddleware(), noteHandler.Create())
	router.GET("/connections/:connection_id/notes", middleware.ClerkAuthMiddleware(), noteHandler.List())
	router.DELETE("/notes/:note_id", middleware.ClerkAuthMiddleware(), noteHandler.Delete())

	router.POST("/connections/:connection_id/interactions", middleware.ClerkAuthMiddleware(), interactionHandler.Create())
	router.GET("/connections/:connection_id/interactions", middleware.ClerkAuthMiddleware(), interactionHandler.List())
	router.DELETE("/interactions/:interaction_id", middleware.ClerkAuthMiddleware(), interactionHandler.Delete())

	router.POST("/upload/url", middleware.ClerkAuthMiddleware(), uploadHandler.GetPresignedURL())
}
