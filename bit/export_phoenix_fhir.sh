BASE_DIR=`dirname $0`
#list all table
printf "!outputformat csv\n!tables" > ${BASE_DIR}/list_table.sql
/usr/yava/2.3.0.0/phoenix/bin/sqlline.py ${BASE_DIR}/list_table.sql > ${BASE_DIR}/list_table.csv
sed -i -e "s/'//g" ${BASE_DIR}/list_table.csv
cat ${BASE_DIR}/list_table.csv |grep BACIRO_FHIR |awk -F"," '{print $2"."$3}' > ${BASE_DIR}/list_table_clean.csv

for tb in `cat ${BASE_DIR}/list_table_clean.csv`; do
printf "!outputformat csv\nselect * from $tb" > ${BASE_DIR}/select_query.sql
/usr/yava/2.3.0.0/phoenix/bin/sqlline.py ${BASE_DIR}/select_query.sql > ${BASE_DIR}/${tb}_temp.csv
cat ${BASE_DIR}/${tb}_temp.csv |grep "'" |sed "s/'//g" > ${BASE_DIR}/${tb}.csv
rm -f ${BASE_DIR}/${tb}_temp.csv
done
rm -f ${BASE_DIR}/list_table.sql
rm -f ${BASE_DIR}/list_table.csv
rm -f ${BASE_DIR}/list_table_clean.csv
rm -f ${BASE_DIR}/select_query.sql
