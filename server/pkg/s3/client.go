package s3

import (
	"context"
	"log"
	"os"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/credentials"
	"github.com/aws/aws-sdk-go-v2/service/s3"
)

type Client struct {
	PresignClient  *s3.PresignClient
	Bucket         string
	PublicEndpoint string
}

func NewClient() *Client {
	ctx := context.Background()

	region := getEnv("AWS_REGION", "us-east-1")
	publicEndpoint := getEnv("S3_PUBLIC_ENDPOINT", "http://localhost:5555")
	bucket := getEnv("S3_BUCKET", "ivanhoe-remember-prod")
	accessKey := getEnv("AWS_ACCESS_KEY_ID", "test")
	secretKey := getEnv("AWS_SECRET_ACCESS_KEY", "test")

	cfg, err := config.LoadDefaultConfig(ctx,
		config.WithRegion(region),
		config.WithCredentialsProvider(credentials.NewStaticCredentialsProvider(
			accessKey,
			secretKey,
			"",
		)),
	)
	if err != nil {
		log.Fatalf("Unable to load SDK config: %v", err)
	}

	presignClient := s3.NewPresignClient(s3.NewFromConfig(cfg, func(o *s3.Options) {
		o.BaseEndpoint = aws.String(publicEndpoint)
		o.UsePathStyle = true
	}))

	return &Client{
		PresignClient:  presignClient,
		Bucket:         bucket,
		PublicEndpoint: publicEndpoint,
	}
}

func getEnv(key, defaultValue string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return defaultValue
}
