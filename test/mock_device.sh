RANDOM=$$
DIFF=$((0-100+1))
MAC=${1:-123456789012}    
echo "Registering device $MAC"
curl -X POST http://localhost:8080/api/device  -H 'Content-Type: application/json'  -d '{"mac":"'$MAC'","name":"Device 1"}'
while true
do 
PPM=$(($(($RANDOM%$DIFF))+0))
echo "Sending PPM $PPM"
curl -X POST http://localhost:8080/api/device/$MAC/stats  -H 'Content-Type: application/json'  -d '{"key":"ppm","value":'$PPM'}'
sleep 1;
done
