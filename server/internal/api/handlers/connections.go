package handlers

import (
	"net/http"

	"github.com/KaranJayakumar/remember/internal/service"
	"github.com/clerk/clerk-sdk-go/v2"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type ConnectionHandler struct {
	service *service.ConnectionService
}

func NewConnectionHandler(service *service.ConnectionService) *ConnectionHandler {
	return &ConnectionHandler{service: service}
}

type createConnectionBody struct {
	Name     string  `json:"name" binding:"required"`
	ImageURL *string `json:"imageUrl,omitempty"`
}

func (h *ConnectionHandler) List(c *gin.Context) {
	workspaceID := c.Param("workspace_id")
	if _, err := uuid.Parse(workspaceID); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid workspace_id"})
		return
	}

	if _, ok := clerk.SessionClaimsFromContext(c.Request.Context()); !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	connections, err := h.service.ListByWorkspace(c.Request.Context(), workspaceID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, connections)
}

func (h *ConnectionHandler) Create(c *gin.Context) {
	workspaceID := c.Param("workspace_id")
	if _, err := uuid.Parse(workspaceID); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid workspace_id"})
		return
	}

	if _, ok := clerk.SessionClaimsFromContext(c.Request.Context()); !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	var body createConnectionBody
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	conn, err := h.service.Create(c.Request.Context(), workspaceID, body.Name, body.ImageURL)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, conn)
}

func (h *ConnectionHandler) Delete(c *gin.Context) {
	connectionID := c.Param("connection_id")
	if _, err := uuid.Parse(connectionID); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid connection_id"})
		return
	}

	if _, ok := clerk.SessionClaimsFromContext(c.Request.Context()); !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	if err := h.service.Delete(c.Request.Context(), connectionID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "connection deleted"})
}

func (h *ConnectionHandler) Get(c *gin.Context) {
	connectionID := c.Param("connection_id")
	if _, err := uuid.Parse(connectionID); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid connection_id"})
		return
	}

	if _, ok := clerk.SessionClaimsFromContext(c.Request.Context()); !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	conn, err := h.service.GetByID(c.Request.Context(), connectionID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, conn)
}
