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

	router.GET("/workspaces", middleware.AuthMiddleware(), workspaceHandler.List)

	router.GET("/workspaces/:workspace_id/connections", middleware.AuthMiddleware(), connectionHandler.List)
	router.POST("/workspaces/:workspace_id/connections", middleware.AuthMiddleware(), connectionHandler.Create)
	router.GET("/connections/:connection_id", middleware.AuthMiddleware(), connectionHandler.Get)
	router.DELETE("/connections/:connection_id", middleware.AuthMiddleware(), connectionHandler.Delete)

	router.POST("/connections/:connection_id/notes", middleware.AuthMiddleware(), noteHandler.Create)
	router.GET("/connections/:connection_id/notes", middleware.AuthMiddleware(), noteHandler.List)
	router.DELETE("/notes/:note_id", middleware.AuthMiddleware(), noteHandler.Delete)

	router.POST("/connections/:connection_id/interactions", middleware.AuthMiddleware(), interactionHandler.Create)
	router.GET("/connections/:connection_id/interactions", middleware.AuthMiddleware(), interactionHandler.List)
	router.DELETE("/interactions/:interaction_id", middleware.AuthMiddleware(), interactionHandler.Delete)

	router.POST("/upload/url", middleware.AuthMiddleware(), uploadHandler.GetPresignedURL)
}
