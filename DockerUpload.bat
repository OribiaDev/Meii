echo Starting Upload Script
set /p version="Version (n for only latest): "
if /i "%version%" == "n" (
docker build . -t oribia/meii:latest
docker push oribia/meii:latest
) else (
docker build . -t oribia/meii:latest
docker build . -t oribia/meii:%version%
docker push oribia/meii:latest
docker push oribia/meii:%version%
)
pause