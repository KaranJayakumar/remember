package main

import (
	"context"
	"github.com/KaranJayakumar/remember/ent"
	"log"
	"os"
)

func main() {
	client, err := ent.Open("postgres", "localhost port=5432 user=user dbname=remember password=password")

	if err != nil {
		log.Fatalf("failed connecting to mysql: %v", err)
	}
	defer client.Close()
	ctx := context.Background()
	if err := client.Schema.WriteTo(ctx, os.Stdout); err != nil {
		log.Fatalf("failed printing schema changes: %v", err)
	}
}
