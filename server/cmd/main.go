package main

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	_ "modernc.org/sqlite"
	_ "github.com/lib/pq"
	"github.com/KaranJayakumar/remember/internal/api"
	"github.com/KaranJayakumar/remember/internal/db"
)

func main() {
	db.Init()
	router := gin.Default()
	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"*"}
	config.AllowMethods = []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}
	config.AllowHeaders = []string{"Content-Type", "Authorization"}
	router.Use(cors.New(config))
	api.RegisterRoutes(router)
	router.Run(":4444")
}

