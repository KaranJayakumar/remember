package service

import (
	"context"
	"fmt"

	"github.com/KaranJayakumar/remember/internal/db/models"
	"github.com/KaranJayakumar/remember/internal/repository"
)

type WorkspaceService struct {
	repo *repository.WorkspaceRepository
}

func NewWorkspaceService(repo *repository.WorkspaceRepository) *WorkspaceService {
	return &WorkspaceService{repo: repo}
}

func (s *WorkspaceService) GetOrCreateDefault(ctx context.Context, ownerUserID string) (*models.Workspace, error) {
	workspaces, err := s.repo.ListByOwner(ctx, ownerUserID)
	if err != nil {
		return nil, fmt.Errorf("list workspaces: %w", err)
	}
	if len(workspaces) > 0 {
		return &workspaces[0], nil
	}
	return s.repo.Create(ctx, ownerUserID, "Default Workspace")
}
