package main

import (
	"github.com/KaranJayakumar/remember/ent"
	"github.com/KaranJayakumar/remember/ent/workspace"
	"github.com/clerk/clerk-sdk-go/v2"
	"github.com/gin-gonic/gin"
	"fmt"
	"net/http"
)

func GetWorkspaces(client *ent.Client) gin.HandlerFunc {
	return func(c *gin.Context) {
		claims, ok := clerk.SessionClaimsFromContext(c.Request.Context())
		if !ok {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
			return
		}

		workspaces, err := client.Workspace.
			Query().
			Where(workspace.OwnerUserIDEQ(claims.Subject)).
			All(c.Request.Context())

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch workspaces"})
			return
		}
		if len(workspaces) == 0 {
			workspace, err := client.Workspace.
				Create().
				SetOwnerUserID(claims.Subject).
				SetName("Default Workspace").
				Save(c.Request.Context())

			if err != nil {
				fmt.Print(err)
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create workspace"})
				return
			}
			workspaces = []*ent.Workspace{workspace}

		}

		c.JSON(http.StatusOK, workspaces)

	}
}
