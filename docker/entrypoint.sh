#!/bin/sh

set -ex

echo "Running database migrations"
npx prisma migrate deploy

echo "Seeding the database"
npx prisma db seed

echo "Starting the server"
echo "Current working directory: $(pwd)"
echo "Contents of current directory:"
ls -la

# Check if main.js exists, if not try main
if [ -f "main.js" ]; then
  echo "Found main.js, starting server..."
  exec node main.js
elif [ -f "main" ]; then
  echo "Found main (without extension), starting server..."
  exec node main
else
  echo "ERROR: Neither main.js nor main found in current directory!"
  echo "Available files:"
  ls -la
  exit 1
fi
