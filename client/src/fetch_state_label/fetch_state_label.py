import sys
import json
import logging
import rds_config
import pymysql

#rds settings
rds_host  = rds_config.rds_host
name = rds_config.db_username
password = rds_config.db_password
db_name = rds_config.db_name

logger = logging.getLogger()
logger.setLevel(logging.INFO)

def lambda_handler(event,context):
    try:
        conn = pymysql.connect(rds_host, user=name, passwd=password, db=db_name, charset='utf8mb4',
        cursorclass=pymysql.cursors.DictCursor, connect_timeout=5)
    except:
        logger.error("ERROR: Unexpected error: Could not connect to MySQL instance")
        sys.exit()

    logger.info("SUCCESS: Connection to RDS MySQL instance succeeded")
    data = dict()
    cur = conn.cursor()
    ## define the pageId (if there wasn't one passed in, use "null" string because of how the database is configured)
    pageId = "null"
    if (event["body"]["page_id"] != ""):
        pageId = event["body"]["page_id"]
    if (event["body"]["field"] != ""):
        select_statment = "select * from ims.properties where prop_key = '{clientCode}.{pageId}.{field}'"

    else:
        select_statment = """select * from ims.properties
                                where prop_key like '{clientCode}.{pageId}%'
                                or prop_key like '{clientCode}.sgr-{pageId}%'
                            """
    selectArguments = {'clientCode': event["body"]["client_code"], 'pageId': pageId, 'field': event["body"]["field"]}
    logger.info("running the following statement " + select_statment.format(**selectArguments))
    cur.execute(select_statment.format(**selectArguments))
    rows = cur.fetchall()

    ## this output formatting probably needs to be revisited...
    ## if there's only one row, return the prop_key and value as attributes of an object
    ## otherwise, return a json object with all of the prop_keys and values
    if len(rows)==1:
        data = rows[0]
    else:
        for row in rows:
            data[row['prop_key']]=row['value']

    cur.close()
    return data
