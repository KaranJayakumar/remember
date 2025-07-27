package main

import (
	"context"
	"fmt"
	"github.com/clerk/clerk-sdk-go/v2"
	"github.com/clerk/clerk-sdk-go/v2/jwt"
	"github.com/gin-gonic/gin"
	"net/http"
)

func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			fmt.Println("No Authorization header found")
			c.JSON(http.StatusUnauthorized, gin.H{"error": "User does not have a valid session token"})
			return
		}

		sessionToken := authHeader
		if len(authHeader) > 7 && authHeader[:7] == "Bearer " {
			sessionToken = authHeader[7:]
		}

		claims, err := jwt.Verify(context.Background(), &jwt.VerifyParams{
			Token: sessionToken,
		})
		if err != nil {
			fmt.Printf("Token verification failed: %v\n", err)
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
			return
		}

		ctx := clerk.ContextWithSessionClaims(c.Request.Context(), claims)
		c.Request = c.Request.WithContext(ctx)

		c.Set("claims", claims)
		c.Next()
	}
}
