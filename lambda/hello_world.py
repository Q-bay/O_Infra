# lambda/hello_world.py
def handler(event, context):
    return {
        'statusCode': 200,
        'body': 'Hello, World!！！！！！'
    }