docker compose up -d

dotnet watch --no-hot-reload
dotnet publish -c Release -o ./bin/Publish

ng serve
