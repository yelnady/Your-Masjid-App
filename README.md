# Build a Cross-Platform App for Your Masjid
 
  **YourMasjid** is a cross-platform app, built using Node.Js, React Native, Expo, and Python.

<a href="url"><img src="https://github.com/yelnady/Your-Masjid-App/blob/main/Others/ss1.jpg?raw=true" width="300">                                  <a href="url"><img src="https://github.com/yelnady/Your-Masjid-App/blob/main/Others/ss2.jpg?raw=true" width="300">
 <a href="url"><img src="https://github.com/yelnady/Your-Masjid-App/blob/main/Others/ss3.jpg?raw=true" width="300">                                  <a href="url"><img src="https://github.com/yelnady/Your-Masjid-App/blob/main/Others/ss4.jpg?raw=true" width="300">
## Features
- Fancy UI using **Material Design**.
- Automatically **highlights upcoming prayer times** (Azan and Iqamah).
- Supports the **Hijri** and Gregorian Dates.
- Provides the **Sunrise** time.
- Send **over-the-air push notifications** (announcements) to the app using Firebase (can be replaced by FireStore database).
- Contains **"Announcements"** section for sharing **posts and udpates** with YourMasjid users.
- Works on **all platforms: Android, iOS, iPadOS, macOS**.
    -  Can also be extended to work on **Windows 10** or as a **web application**.
- Send **updates to the app over-the-air** without need to access PlayStore or AppStore (using Expo OTA). 
- Handles **day light saving** corrections automatically.
- Handles **leap year** corrections automatically.
- Easy access to prayer times for **the whole year**.
- Log users into Firebase **anonymously**, no signup required.


**Bonus: There is also a  Python applet to make it easier to send notifications and posts to YourMasjid app**.

## Requirements
- Node.js
- React Native 
- Expo
- Expo Client (Expo Go)
- Firebase Account


## What do you need to do
- Install all npm dependencies from `package.json`.
- Add Azan and Iqamah times to the files `AzanTimes.js` and `Iqama.csv`.
    - you can convert CSV files to an array using `CsvToArray.py`.
- Put your own Masjid Icon, and add your splash screen into the `splash` directory.
- Customize the design and the colors of YourMasjid App. 
- Subscribe to Firebase and add FirebaseConfig to `config.js`.
    - Create Web app  
    - Enable signInAnonymously from sign-in methods
    - In Realtime Database -> Data, set your structure to the following:
    ![](Others/Firebase.png?raw=true)
    - Add the following inside Firebase-> RealTime Database -> rules section 
```
{
  "rules": {
    "USERS": {
             "$uid": {
                   ".write": "$uid == auth.uid"  // If node's key matches the id of the auth user
                }
    }, 
      ".write": false,
      ".read":true
  }
}
```
- Edit the name and version of YourMasjid app in `package.json`, `package-lock.json` and `app.json`.
- Always Test your app using 'Expo Go'.
    - From the command line, run `expo start`   
- Register YourMasjid app on "Google Play Console" and "App Store Connect", then modify `app.json`.
- Publish the app successfully to the stores.


## The Python App for Pushing Notifications and Posts
If you want to use the python applet to send notifications and posts to uses over-the-air, consider modyfing the `The Python App` Directory as following: 

- Follow the steps at [Add the Firebase Admin SDK to your server](https://firebase.google.com/docs/admin/setup) to create your Admin SDK JSON File.
- Securely store the JSON file containing the key and name it `YourMasjid-hub-firebase-adminsdk.json`.
- You may convert your python script into '.exe' file using 
    - You will need to install `auto-py-to-exe`
    - read the file `How_to_make_exe_python.txt`








