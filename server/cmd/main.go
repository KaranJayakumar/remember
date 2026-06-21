package main

import (
	"log"
	"os"

	"github.com/KaranJayakumar/remember/internal/api"
	"github.com/KaranJayakumar/remember/internal/api/handlers"
	"github.com/KaranJayakumar/remember/internal/db"
	"github.com/KaranJayakumar/remember/internal/repository"
	"github.com/KaranJayakumar/remember/internal/service"
	s3pkg "github.com/KaranJayakumar/remember/pkg/s3"
	"github.com/clerk/clerk-sdk-go/v2"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	clerk.SetKey(os.Getenv("CLERK_SECRET_KEY"))

	database := db.Init()
	defer database.Close()

	s3Client := s3pkg.NewClient()

	workspaceRepo := repository.NewWorkspaceRepository(database)
	connectionRepo := repository.NewConnectionRepository(database)
	noteRepo := repository.NewNoteRepository(database)
	interactionRepo := repository.NewInteractionRepository(database)

	workspaceService := service.NewWorkspaceService(workspaceRepo)
	connectionService := service.NewConnectionService(connectionRepo, noteRepo, interactionRepo)
	noteService := service.NewNoteService(noteRepo)
	interactionService := service.NewInteractionService(interactionRepo)

	workspaceHandler := handlers.NewWorkspaceHandler(workspaceService)
	connectionHandler := handlers.NewConnectionHandler(connectionService)
	noteHandler := handlers.NewNoteHandler(noteService)
	interactionHandler := handlers.NewInteractionHandler(interactionService)
	uploadHandler := handlers.NewUploadHandler(&handlers.S3Client{
		PresignClient:  s3Client.PresignClient,
		Bucket:         s3Client.Bucket,
		PublicEndpoint: s3Client.PublicEndpoint,
	})

	router := gin.Default()
	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"*"}
	config.AllowMethods = []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}
	config.AllowHeaders = []string{"Content-Type", "Authorization"}
	router.Use(cors.New(config))

	api.RegisterRoutes(router, workspaceHandler, connectionHandler, noteHandler, interactionHandler, uploadHandler)

	log.Println("[server] listening on :4444")
	router.Run(":4444")
}
