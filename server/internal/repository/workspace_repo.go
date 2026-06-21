package repository

import (
	"context"
	"database/sql"
	"fmt"

	"github.com/KaranJayakumar/remember/internal/db/models"
	"github.com/google/uuid"
)

type DBTX interface {
	QueryContext(ctx context.Context, query string, args ...any) (*sql.Rows, error)
	QueryRowContext(ctx context.Context, query string, args ...any) *sql.Row
	ExecContext(ctx context.Context, query string, args ...any) (sql.Result, error)
}

type WorkspaceRepository struct {
	db DBTX
}

func NewWorkspaceRepository(db DBTX) *WorkspaceRepository {
	return &WorkspaceRepository{db: db}
}

func (r *WorkspaceRepository) ListByOwner(ctx context.Context, ownerUserID string) ([]models.Workspace, error) {
	rows, err := r.db.QueryContext(ctx,
		"SELECT id, name, owner_user_id FROM workspaces WHERE owner_user_id = ?",
		ownerUserID,
	)
	if err != nil {
		return nil, fmt.Errorf("query workspaces: %w", err)
	}
	defer rows.Close()

	var workspaces []models.Workspace
	for rows.Next() {
		var w models.Workspace
		if err := rows.Scan(&w.ID, &w.Name, &w.OwnerUserID); err != nil {
			return nil, err
		}
		workspaces = append(workspaces, w)
	}
	return workspaces, rows.Err()
}

func (r *WorkspaceRepository) Create(ctx context.Context, ownerUserID, name string) (*models.Workspace, error) {
	id := uuid.New().String()
	_, err := r.db.ExecContext(ctx,
		"INSERT INTO workspaces (id, name, owner_user_id) VALUES (?, ?, ?)",
		id, name, ownerUserID,
	)
	if err != nil {
		return nil, fmt.Errorf("insert workspace: %w", err)
	}
	return &models.Workspace{ID: id, Name: name, OwnerUserID: ownerUserID}, nil
}
