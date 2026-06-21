package handlers

import (
	"net/http"
	"strconv"

	"github.com/KaranJayakumar/remember/internal/service"
	"github.com/clerk/clerk-sdk-go/v2"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type InteractionHandler struct {
	service *service.InteractionService
}

func NewInteractionHandler(service *service.InteractionService) *InteractionHandler {
	return &InteractionHandler{service: service}
}

type createInteractionBody struct {
	ConnectionID string  `json:"connection_id" binding:"required"`
	Type         string  `json:"type" binding:"required"`
	Content      string  `json:"content" binding:"required"`
	PhotoURL     *string `json:"photo_url,omitempty"`
}

func (h *InteractionHandler) List() gin.HandlerFunc {
	return func(c *gin.Context) {
		connectionID := c.Param("connection_id")
		if _, err := uuid.Parse(connectionID); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid connection_id"})
			return
		}

		if _, ok := clerk.SessionClaimsFromContext(c.Request.Context()); !ok {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
			return
		}

		interactions, err := h.service.ListByConnection(c.Request.Context(), connectionID)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, interactions)
	}
}

func (h *InteractionHandler) Create() gin.HandlerFunc {
	return func(c *gin.Context) {
		if _, ok := clerk.SessionClaimsFromContext(c.Request.Context()); !ok {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
			return
		}

		var body createInteractionBody
		if err := c.ShouldBindJSON(&body); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		if _, err := uuid.Parse(body.ConnectionID); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid connection_id"})
			return
		}

		interaction, err := h.service.Create(c.Request.Context(), body.ConnectionID, body.Type, body.Content, body.PhotoURL)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusCreated, interaction)
	}
}

func (h *InteractionHandler) Delete() gin.HandlerFunc {
	return func(c *gin.Context) {
		idStr := c.Param("interaction_id")
		id, err := strconv.Atoi(idStr)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid interaction_id"})
			return
		}

		if _, ok := clerk.SessionClaimsFromContext(c.Request.Context()); !ok {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
			return
		}

		if err := h.service.Delete(c.Request.Context(), id); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, gin.H{"message": "interaction deleted"})
	}
}
