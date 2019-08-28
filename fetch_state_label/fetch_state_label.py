import json
import logging
import rds_config
import pymysql

#rds settings
rds_host  = "max-prod.cvlabpgi78gg.us-west-2.rds.amazonaws.com"
name = rds_config.db_username
password = rds_config.db_password
db_name = rds_config.db_name

logger = logging.getLogger()
logger.setLevel(logging.INFO)

try:
    conn = pymysql.connect(rds_host, user=name, passwd=password, db=db_name, connect_timeout=5)
except:
    logger.error("ERROR: Unexpected error: Could not connect to MySQL instance")
    sys.exit()

logger.info("SUCCESS: Connection to RDS MySQL instance succeeded")

def lambda_handler(event,context):
    data = []
    select_statment = "select * from ims.properties where prop_key = %(client_code).%(pageId).%(property)"
    cur.execute(select_statment,{"client_code" : event["body"]["client_code"], "pageId": event["body"]["pageIds"], "property": event["body"]["property"]})

    #retrieves the next row of a query result set and returns a single sequence
    row = cur.fetchone()

    while row is not none:
        print(row)
        data.append({"prop_key":row[0], "value":row[1]})
        row = cur.fetchone()

    return data
