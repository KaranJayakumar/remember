package repository

import (
	"context"
	"fmt"

	"github.com/KaranJayakumar/remember/internal/db/models"
	"github.com/google/uuid"
)

type ConnectionRepository struct {
	db DBTX
}

func NewConnectionRepository(db DBTX) *ConnectionRepository {
	return &ConnectionRepository{db: db}
}

func (r *ConnectionRepository) ListByWorkspace(ctx context.Context, workspaceID string) ([]models.Connection, error) {
	rows, err := r.db.QueryContext(ctx,
		"SELECT id, workspace_id, first_name, last_name, image_url, metadata, created_at, updated_at FROM connections WHERE workspace_id = ?",
		workspaceID,
	)
	if err != nil {
		return nil, fmt.Errorf("query connections: %w", err)
	}
	defer rows.Close()

	var connections []models.Connection
	for rows.Next() {
		var c models.Connection
		if err := rows.Scan(&c.ID, &c.WorkspaceID, &c.FirstName, &c.LastName, &c.ImageURL, &c.Metadata, &c.CreatedAt, &c.UpdatedAt); err != nil {
			return nil, err
		}
		connections = append(connections, c)
	}
	return connections, rows.Err()
}

func (r *ConnectionRepository) GetByID(ctx context.Context, id string) (*models.Connection, error) {
	var c models.Connection
	err := r.db.QueryRowContext(ctx,
		"SELECT id, workspace_id, first_name, last_name, image_url, metadata, created_at, updated_at FROM connections WHERE id = ?",
		id,
	).Scan(&c.ID, &c.WorkspaceID, &c.FirstName, &c.LastName, &c.ImageURL, &c.Metadata, &c.CreatedAt, &c.UpdatedAt)
	if err != nil {
		return nil, fmt.Errorf("get connection: %w", err)
	}
	return &c, nil
}

func (r *ConnectionRepository) Create(ctx context.Context, workspaceID, firstName string, lastName string, imageURL *string) (*models.Connection, error) {
	id := uuid.New().String()
	_, err := r.db.ExecContext(ctx,
		"INSERT INTO connections (id, workspace_id, first_name, last_name, image_url) VALUES (?, ?, ?, ?, ?)",
		id, workspaceID, firstName, lastName, imageURL,
	)
	if err != nil {
		return nil, fmt.Errorf("insert connection: %w", err)
	}
	return r.GetByID(ctx, id)
}

func (r *ConnectionRepository) Delete(ctx context.Context, id string) error {
	_, err := r.db.ExecContext(ctx, "DELETE FROM connections WHERE id = ?", id)
	if err != nil {
		return fmt.Errorf("delete connection: %w", err)
	}
	return nil
}

func (r *ConnectionRepository) UpdateMetadata(ctx context.Context, id string, metadata string) error {
	_, err := r.db.ExecContext(ctx,
		"UPDATE connections SET metadata = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
		metadata, id,
	)
	if err != nil {
		return fmt.Errorf("update metadata: %w", err)
	}
	return nil
}
