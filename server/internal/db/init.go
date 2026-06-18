package db

import (
	"database/sql"
	"fmt"
	"log"
	"os"
	"path/filepath"

	_ "modernc.org/sqlite"
)

func Init(dbPath string) *sql.DB {
	if dbPath == "" {
		dbPath = "data/remember.db"
	}

	// Ensure directory exists
	dir := filepath.Dir(dbPath)
	if err := os.MkdirAll(dir, 0755); err != nil {
		log.Fatalf("failed to create data directory: %v", err)
	}

	db, err := sql.Open("sqlite", dbPath+"?_fk=1")
	if err != nil {
		log.Fatalf("failed to open database: %v", err)
	}

	if err := db.Ping(); err != nil {
		log.Fatalf("failed to ping database: %v", err)
	}

	// Enable foreign keys
	if _, err := db.Exec("PRAGMA foreign_keys = ON"); err != nil {
		log.Fatalf("failed to enable foreign keys: %v", err)
	}

	if err := createTables(db); err != nil {
		log.Fatalf("failed to create tables: %v", err)
	}

	fmt.Println("[db] connected and tables ensured")
	return db
}

func createTables(db *sql.DB) error {
	schema := `
CREATE TABLE IF NOT EXISTS workspaces (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL DEFAULT 'Default Workspace',
    owner_user_id TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS connections (
    id TEXT PRIMARY KEY,
    workspace_id TEXT NOT NULL,
    name TEXT NOT NULL,
    image_url TEXT,
    metadata TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    connection_id TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (connection_id) REFERENCES connections(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS interactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    connection_id TEXT NOT NULL,
    type TEXT NOT NULL,
    content TEXT NOT NULL,
    photo_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (connection_id) REFERENCES connections(id) ON DELETE CASCADE
);
`
	_, err := db.Exec(schema)
	return err
}
