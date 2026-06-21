package handlers

import (
	"net/http"

	"github.com/KaranJayakumar/remember/internal/service"
	"github.com/clerk/clerk-sdk-go/v2"
	"github.com/gin-gonic/gin"
)

type WorkspaceHandler struct {
	service *service.WorkspaceService
}

func NewWorkspaceHandler(service *service.WorkspaceService) *WorkspaceHandler {
	return &WorkspaceHandler{service: service}
}

func (h *WorkspaceHandler) List() gin.HandlerFunc {
	return func(c *gin.Context) {
		claims, ok := clerk.SessionClaimsFromContext(c.Request.Context())
		if !ok {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
			return
		}

		workspace, err := h.service.GetOrCreateDefault(c.Request.Context(), claims.Subject)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, []any{workspace})
	}
}
