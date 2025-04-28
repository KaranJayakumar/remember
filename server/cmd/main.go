package main

import (
	"context"
	"github.com/KaranJayakumar/remember/ent"
	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
	"log"
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
	router.Run()
}
