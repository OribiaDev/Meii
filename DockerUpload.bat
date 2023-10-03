echo Starting Upload Script
docker build . -t oribia/meii:latest
docker push oribia/meii:latest
pause