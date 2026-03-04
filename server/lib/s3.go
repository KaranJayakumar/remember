package main

import (
	"context"
	"log"
	"os"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/credentials"
	"github.com/aws/aws-sdk-go-v2/service/s3"
)

// S3Client wraps the AWS S3 client with configuration
type S3Client struct {
	Client *s3.Client
	Bucket string
}

// NewS3Client creates a new S3 client configured for LocalStack
func NewS3Client() *S3Client {
	ctx := context.Background()

	// Get configuration from environment variables with defaults for LocalStack
	region := getEnv("AWS_REGION", "us-east-1")
	endpoint := getEnv("S3_ENDPOINT", "http://localhost:4566")
	bucket := getEnv("S3_BUCKET", "remember-profile-pictures")
	accessKey := getEnv("AWS_ACCESS_KEY_ID", "test")
	secretKey := getEnv("AWS_SECRET_ACCESS_KEY", "test")
	forcePathStyle := getEnv("S3_FORCE_PATH_STYLE", "true") == "true"

	// Load the AWS configuration with static credentials
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

	// Create S3 client with custom endpoint for LocalStack
	client := s3.NewFromConfig(cfg, func(o *s3.Options) {
		o.BaseEndpoint = aws.String(endpoint)
		o.UsePathStyle = forcePathStyle
	})

	s3Client := &S3Client{
		Client: client,
		Bucket: bucket,
	}

	// Ensure bucket exists
	if err := s3Client.EnsureBucket(ctx); err != nil {
		log.Printf("Warning: Could not ensure bucket exists: %v", err)
	}

	return s3Client
}

// EnsureBucket creates the bucket if it doesn't exist
func (s *S3Client) EnsureBucket(ctx context.Context) error {
	_, err := s.Client.CreateBucket(ctx, &s3.CreateBucketInput{
		Bucket: aws.String(s.Bucket),
	})
	if err != nil {
		// Bucket might already exist, which is fine
		log.Printf("Note: CreateBucket result: %v", err)
	}
	return nil
}

// getEnv retrieves an environment variable or returns a default value
func getEnv(key, defaultValue string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return defaultValue
}
