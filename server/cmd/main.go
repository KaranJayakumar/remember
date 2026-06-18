package main
	"github.com/KaranJayakumar/remember/ent/note"
	"github.com/KaranJayakumar/remember/ent/tag"

import (
	"context"
	"github.com/KaranJayakumar/remember/ent"
	"github.com/KaranJayakumar/remember/ent/migrate"
	"github.com/clerk/clerk-sdk-go/v2"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	_ "modernc.org/sqlite"
	_ "github.com/lib/pq"
	"entgo.io/ent/dialect"
	"log"
	"net/http"
	"os"
	"database/sql"
	"database/sql/driver"
	"modernc.org/sqlite"
)

func main() {
	setupServer()
}

type sqlite3Driver struct {
	*sqlite.Driver
}

type sqlite3DriverConn interface {
	Exec(string, []driver.Value) (driver.Result, error)
}

func (d sqlite3Driver) Open(name string) (conn driver.Conn, err error) {
	conn, err = d.Driver.Open(name)
	if err != nil {
		return
	}
	_, err = conn.(sqlite3DriverConn).Exec("PRAGMA foreign_keys = ON;", nil)
	if err != nil {
		_ = conn.Close()
	}
	return
}

func initNativeGolangDBDriver() {
	sql.Register("sqlite3", sqlite3Driver{Driver: &sqlite.Driver{}})
}

func setupServer() {
	initNativeGolangDBDriver()

	client, err := ent.Open(dialect.SQLite, "file:data/ent.db?cache=shared&_fk=1")

	if err != nil {
		log.Fatalf("failed connecting to postgres: %v", err)

	}

	defer client.Close()
	ctx := context.Background()
	if err := client.Schema.Create(ctx, migrate.WithDropIndex(true), migrate.WithDropColumn(true)); err != nil {
		log.Fatalf("failed printing schema changes: %v", err)
	}
	clerk.SetKey(os.Getenv("CLERK_SECRET_KEY"))

	// Initialize S3 client
	s3Client := NewS3Client()

	router := gin.Default()
	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"*"}
	config.AllowMethods = []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}
	config.AllowHeaders = []string{"Content-Type", "Authorization"}
	router.Use(cors.New(config))

	router.GET("/test", Test(client))

	router.GET("/workspaces", AuthMiddleware(), GetWorkspaces(client))

	router.GET("/workspaces/:workspace_id/connections", AuthMiddleware(), GetConnections(client))
	router.POST("/workspaces/:workspace_id/connections", AuthMiddleware(), CreateConnection(client))
	router.DELETE("/connections/:connection_id", AuthMiddleware(), DeleteConnection(client))

	router.POST("/connections/:connection_id/notes", AuthMiddleware(), CreateNote(client))
	router.GET("/connections/:connection_id/notes", AuthMiddleware(), GetNotes(client))

	router.PUT("/notes/:note_id", AuthMiddleware(), UpdateNote(client))
	router.DELETE("/notes/:note_id", AuthMiddleware(), DeleteNote(client))

	router.POST("/connections/:connection_id/tags", AuthMiddleware(), CreateTag(client))
	router.GET("/connections/:connection_id/tags", AuthMiddleware(), GetTags(client))

	router.PUT("/tags/:tag_id", AuthMiddleware(), UpdateTag(client))
	router.DELETE("/tags/:tag_id", AuthMiddleware(), DeleteTag(client))

	// Upload route
	router.POST("/upload/url", AuthMiddleware(), GetPresignedUploadURL(s3Client))

	router.Run(":4444")

}

func Test(client *ent.Client) gin.HandlerFunc {
	return func(c *gin.Context) {
		log.Println("GOT THE REQUEST")
		c.JSON(http.StatusOK, gin.H{"status": "ok"})
	}
}
