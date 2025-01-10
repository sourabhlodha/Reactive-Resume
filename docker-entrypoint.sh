#!/bin/sh
set -e

# Start MinIO in background
minio server /data --console-address ":${MINIO_CONSOLE_PORT}" &

# Wait for MinIO to be ready
until mc config host add myminio http://localhost:${MINIO_PORT} ${MINIO_ROOT_USER} ${MINIO_ROOT_PASSWORD}; do
  echo 'Waiting for MinIO to be ready...'
  sleep 1
done

# Create default bucket if it doesn't exist
mc mb myminio/${STORAGE_BUCKET} || true

# Set bucket policy for public access
cat > /tmp/policy.json << EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {
                "AWS": ["*"]
            },
            "Action": ["s3:GetObject"],
            "Resource": ["arn:aws:s3:::${STORAGE_BUCKET}/*"]
        }
    ]
}
EOF

mc policy set-json /tmp/policy.json myminio/${STORAGE_BUCKET}

# Start the application using dumb-init for proper process management
exec dumb-init -- pnpm run start 