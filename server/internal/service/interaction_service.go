package service

import (
	"context"

	"github.com/KaranJayakumar/remember/internal/db/models"
	"github.com/KaranJayakumar/remember/internal/repository"
)

type InteractionService struct {
	repo *repository.InteractionRepository
}

func NewInteractionService(repo *repository.InteractionRepository) *InteractionService {
	return &InteractionService{repo: repo}
}

func (s *InteractionService) ListByConnection(ctx context.Context, connectionID string) ([]models.Interaction, error) {
	return s.repo.ListByConnection(ctx, connectionID)
}

func (s *InteractionService) Create(ctx context.Context, connectionID, interactionType, content string, photoURL *string) (*models.Interaction, error) {
	return s.repo.Create(ctx, connectionID, interactionType, content, photoURL)
}

func (s *InteractionService) Delete(ctx context.Context, id int) error {
	return s.repo.Delete(ctx, id)
}
