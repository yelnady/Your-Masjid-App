import firebase_admin
from firebase_admin import credentials
from firebase_admin import db
from datetime import date
from exponent_server_sdk import PushClient
from exponent_server_sdk import PushMessage
import os

# Managed Expo does not support FCM currently, so I'm using Expo Server instead to send push notifications

# Fetch the service account key JSON file contents
# Must put the absolute path, to get the (exe) file correctly
cred = credentials.Certificate(
    '.\\isnrv-hub-firebase-adminsdk.json')
# Initialize the app with a service account, granting admin privileges
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://asdasd-bd29b.firebaseio.com'
})

while True:
    title = input("Enter the title:\n")
    print(
        "Write the announcement:\nTo publish: enter \"done\" in a new line.\nTo cancel : enter \"cancel\" in a new line.")
    finalPost = ""
    # To end the input, enter "done"
    while True:  # Just copy and paste the announcement and this part will be handled.
        post = input()
        if str.lower(post) == "done" and finalPost != "":
            finalPost = finalPost.rstrip("\n")
            break
        if str.lower(post) == "cancel":
            exit()
        else:
            finalPost += post + '\n'
        post = ''

    print(
        finalPost + "\n\nWould you like to proceed? (Y/N)")  # The final check before posting the announcement and sending the notifications
    answer = input("\n")
    if answer in ["YES", "yes", "y", "Y"]:
        # Get all users from the realtime database
        users = db.reference('USERS').get()
        # Add the post to the realtime database, and also add its date
        db.reference('Posts').push(
            {'Body': finalPost, 'Title': title, 'Date': str(date.today().strftime("%b-%d-%Y"))})
        print("Loading!")

        for user in users.values():
            # from each user value, take out the token, make a notification, and publish it.
            try:
                PushClient().publish(PushMessage(
                    to=user['token'],
                    title=title,
                    # limit the amount of the body of the notification
                    body=finalPost[:400],
                    data=None,
                    priority='high',
                    sound="default",
                    # channel_id="default"
                ))
            except:  # The user may have uninstalled the app, but Firebase still has its token, so there'll be an error.
                continue
        break

print("Finished Sending All Push Notifications!")
os.system("pause")
 