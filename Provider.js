import React, { useState, useEffect } from "react";
import { db } from "./important/config";
import AsyncStorage from "@react-native-community/async-storage";

//We import this "YourMasjidContext" in all other files, where we want to use a global state
const YourMasjidContext = React.createContext();

//STEPS-> put the provider around all in App.js, put a Ctxt in each file and just reuse a global mgmt state
const YourMasjidProvider = (props) => {
  const loadAsyncData = async () => {
    try {
      //First, we will check if there's something already in my storage called "HijriCorrect"
      const Hijri_correct = await AsyncStorage.getItem("HijriCorrect"); //Previosuly has been set in toggleHijriCorrect
      Hijri_correct !== null
        ? setHijriCorrect(JSON.parse(Hijri_correct))
        : setHijriCorrect(0);
    } catch (error) {}
    return HijriCorrect;
  };

  const [HijriCorrect, setHijriCorrect] = useState(loadAsyncData());
  const [StablePost, setStablePost] = useState("Loading...");
  const [LastPost, setLastPost] = useState(null);
  const [postList, setPostList] = useState([]);

  const [time, setTime] = useState(0);

  useEffect(() => {
    loadAsyncData();
    db.ref("Posts")
      .limitToLast(1)
      .once("child_added", function (snapshot) {
        setLastPost(snapshot.val());
      });
    db.ref("STATIC").on("value", (x) => {
      setStablePost(x.val());
    });

    db.ref("Posts")
      .limitToLast(20)
      .on("value", (querySnapShot) => {
        let temp = [];
        querySnapShot.forEach(function (childSnapshot) {
          var item = childSnapshot.val();
          item.key = childSnapshot.key;
          temp.push(item);
        });
        setPostList([...temp.reverse()]);
      });

    const timer = setInterval(() => {
      setTime((prevTime) => prevTime + 1); // <-- Change this line if you need!
    }, 15000);

    return () => {
      clearInterval(timer);
    };
  }, [time]);
  return (
    <YourMasjidContext.Provider
      value={{ HijriCorrect, setHijriCorrect, StablePost, LastPost, postList }}
    >
      {props.children}
    </YourMasjidContext.Provider>
  );
};

export { YourMasjidContext, YourMasjidProvider };
