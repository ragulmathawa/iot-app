MAC=${1:-123456789012} 
curl -X GET http://localhost:8080/api/device/$MAC/stats/ppm
