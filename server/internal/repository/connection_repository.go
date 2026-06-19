package repository

import (
	"database/sql"
	"github.com/KaranJayakumar/remember/internal/db/models"
	"github.com/google/uuid"
)

type ConnectionRepository struct {
	db *sql.DB
}

func(repo *ConnectionRepository) GetConnectionByID(id uuid.UUID)(*models.Connection, error){
	query := "SELECT * FROM connections WHERE connections.id = $1"
	var conn models.Connection
	err := repo.db.QueryRow(query, id).Scan(
		&conn.ID,
		&conn.WorkspaceID,
		&conn.Name,
		&conn.Metadata,
		&conn.CreatedAt,
		&conn.UpdatedAt,
	)
	return &conn, err
}

func(repo *ConnectionRepository) GetConnectionsForWorkspace(workspaceId uuid.UUID)([]models.Connection, error){
	query := "SELECT * FROM connections WHERE connections.workspace_id = $1"
	rows, err := repo.db.Query(query, workspaceId)	
	if err != nil{
		return nil, err
	}
	var connections [] models.Connection
	for rows.Next(){
		var conn models.Connection
		err := rows.Scan(
			&conn.ID,
			&conn.WorkspaceID,
			&conn.Name,
			&conn.Metadata,
			&conn.CreatedAt,
			&conn.UpdatedAt,
		)
		if err != nil{
			return nil, err
		}
		connections = append(connections, conn)
	}

	return connections, err
}
