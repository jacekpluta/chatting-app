# My Chatting App
My Chatting App is a web application that allows you to chat with your friends or with stragers in public channels that you can join or create.

![](mdimages/usageExample.gif)    

App allows to add and message other users, create your own chat rooms, upload pictures and emojis to conversations, 
change avatar, add channels to favourites, search other users and chatrooms by name and much more. 

Chat was created with React (React Hooks, React Router, Redux) as a front-end and Google Firebase as back-end. 
All with use of Semanti UI and CSS to style the website.
  

## Installation

install all packages

```
npm install
```

start the app

```
npm start
```

how to start tests

```
npm test start
```


## Usage example

Start by creating an account and logging in the application.  
![](mdimages/register.png)    

If you are logging for the first time you will have to go through an intro describing main parts of the app.  

After completing it you should see of main view of the application.  
![](mdimages/mainPage.png)    

In the top left corner you can open your user panel by clicking on your name.  
![](mdimages/userPanel.png)    

By default you have a randomly generated avatar that you can change by uploading a new one and clicking "Change Avatar" button.  
![](mdimages/changeAvatar.png)    

Next in the user panel is an option to enable dark mode that will change colors of the website to much darker ones.  
![](mdimages/darkMode.png)    

Last options are to replay tutorial/intro and sign out of the account.  
![](mdimages/tutorial.png)    

Below the user panel is a search bar where you can search for users and channels by their name.  
![](mdimages/searchBar.png)    

After searching for a user, you can add him by clicking on the green "+" icon on the top. New friend should appear in your friend list on the left.  
![](mdimages/addFriend.png)    

User that you added to friends just got an invitation.  
![](mdimages/friendInvitation.png)    

If he accepts you invite, you can chat with him and check for his status if he is online or offline.  
![](mdimages/friendAdded.png)    

The last section of sidebar are public channels. Here you can see a list of all public chat rooms that other users have created.  
![](mdimages/publicChannels.png)    

Clicking plus icon creates new public channel where users can join and talk without limits.  
![](mdimages/createChannel.png)    

Created channel should appear on the left in the channels section.  
![](mdimages/createdChannel.png)    

Next, on the top, we have channel header, where as you already know you can add your friend or add channel to favourites by clicking empty star icon. 
Starred channel will automaticaly go up top of all channels in channel sidebar.  
![](mdimages/channelStarred.png)    

In the right side of header there is:  
- channel details section which contains: channel description, top posters, who created that channel, possibility to delete channel if you are the owner,  
- list of all users that are currently in the channel,  
- channel search bar where you can search by username or by a message.  

![](mdimages/headerSection.png)    

In the middle there is messages section where you can see all the current channel messages.  

![](mdimages/messagesSection.png)    

And lastly in the bottom section you have possibility to write messages, add emotes and upload pictures into the conversation.  

![](mdimages/writeMessageSection.png)    



## Contact

Your Name – Jacek Pluta

Email - j.pluta123@gmail.com

Website - https://jacekplutaportfolio.netlify.app/


## License

- Copyright 2020 © Jacek Pluta
