# Admin Section Usage

This guide will go over how to use the admin tab of aumt.co.nz, tab by tab.

## Trainings

### Properties

* Title - will appear as the heading on the signup form
* Opens - the date and time at which the training will appear for member signups
* Closes - the date and time at which the training will disappear from the signup tab.
* Open To Public - whether or not non-members can sign up to the training. 
    * If No, the website will require a member to sign in and have paid to view the training.
    * If Yes, the form will be open to anyone and the "Feedback" input on the form will be replaced with a "Name" field so admin has an idea who signs up
        * If Yes, the name will displayed as (nonmember) \<Name> in the Edit Members section of the Training Dashboard
* Sessions - options for members to sign up to. There must be at least one. Each session has a title, displayed as an option on the form, and a limit for how many members can sign up. 
* Notes - any miscellaneous text for admin to put on the training form for anyone to read. Must be only text (no html, etc)

### Create a Training

1. On the Admin dashboard under Trainings, click the 'Create Training' button in the top right
2. Fill in the form and click 'Save Training' to save it.

The Populate Weekly Defaults button is entirely optional to use. Select a week and it will fill in a basic training for that week with times, a title and sessions.

### Edit a Training

1. On the Admin dashboard under Trainings, go to the Manage Trainings section and click Edit next to the training you would like to edit. 

2. Edit the fields and click Save Training

### Delete a Training

1. On the Admin dashboard under Trainings, go to the Manage Trainings section and click Delete next to the training you would like to delete. You cannot recover a deleted training, any member signup data will be lost.

### Manage Signups

Admin can move members between forms or remove them from the training under the Edit Members section of the Trainings tab. To do so, select a person from the session displayed. One can move it to a training that isn't full. Removing them will remove them from the session and free up a spot. 

The numbers to the left are the (number of signups) / (session limit) for the particular session. 

### Other Training Dashboard Functionality 

* The graphs are just for fun
    * Week stats shows when people sign up in the week.
    * Year stats shows how many people total signed up for each form.
* Click on a point in the Year stats graph, a training title in the Manage Trainings section or select from the top right dropdown to view stats for the desired training.

## Events

Events are intended, for now at least, to only be basic information and just a link to the facebook page where people can join.

### Properties

* Title - the main title displayed on the Event
* Url Path - the path the event will be seen at (a url path of `omori-sem-2` will be aumt.co.nz/events/omori-sem-2)
* Description - A description of the event
* Date - A date and time for the start
* Location - A location for the event
* FB Link - A link to the facebook event page
* Photo URL - A link to a photo to be displayed on the event page (not implemented so doesn't work yet)

### Create an Event, Edit an Event, Delete an Event

These are all in the Admin section under the Events tab.

## Members

### Properties
* First Name
* Last Name
* Preferred Name - optional
* Email
* UPI - 0 for people not at UoA, otherwise their UPI
* Membership - S1, S2 or FY for a Semester one, Semester two, or Full Year membership
* Returning Member - whether a member was a member in the past (Yes or No)
* UoA Student - whether or not a member is enrolled at UoA (Yes or No)
* Paid - whether or not the member has paid for their membership (Yes or No)
* Payment Type - a member's intended payment type (Cash or Bank Transfer)
* Instagram handle - the member's instagram handle, will be blank for most
* Emergency Contact Details - details of a member's contact in case of an emergency
    * Name
    * Number
    * Relation

### Create a Member

Creating a member as admin takes two steps:

1. Create a user in the Firebase Console. See Creating a Login section
2. Click Add Member at the top right of the Admin section Member tab.
3. Enter the member's details, making sure the UID matches the one you just created

### Edit a Member

Note: A member's email can be changed this way but their login email can't be changed without creating a new account for them.

1. Go to the Members tab of the Admin section
2. Find the member in the table by filtering or searching the columns at their title
3. Click on the line of the table somewhere
4. Edit the desired fields on the right and click Save to save. Changes should reflect immediately in the table.
5. Cancel the edit by clicking the close button at the top right of the form.

### Delete a Member

1. Navigate to the member as done in the previous section
2. Click Remove Member and confirm
3. Delete member from the firebase console (see Deleting a User)

### Other features
* Some table entries have an icon to their right. This is for quickly editing or copying the data. For example you can quickly switch a member's paid status without having to open and edit the member. Hover over the icon and a tooltip will appear telling you what clicking it will do. 
* One can filter the table by clicking the filter or search icon next to a column's header. Some have categorical filters and in some you can search for text (a name, etc)
* For ease of searching, a display name has been created for each member and is displayed in the table under Name. It is not stored in the database.
* Download a .csv file by clicking Download .csv in the Table footer. It will create a CSV file of all filtered members displayed in the table. This can later be used as an excel file or an import to Google Sheets
* Member attendance is displayed if you click on a member's line in the table. It will show all training sessions, which ones they have signed up for and the session they selected. One can edit their signup by clicking the edit icon to the right.
* Join Form is a switch that toggles whether people can sign up to the club or not. If set to closed, the Join tab of the website will say that signups for the semester have closed. If set to open, the Join tab will display the join form.
* Signup Sem is a choice that only changes the text on the Join form. If set to Sem1, the Join form will have options for Semester One and Full Year, with payment instructions for both. If set to Sem2, the Join form will sign members up to Semester 2 and only display payment instructions for Sem 2.

## Feedback

Member feedback left anonymously can be seen in the Feedback tab. The title of the training shows which form feedback was left under so feedback for one form is most likely related to the past week's training

# Firebase Console

## Accessing the Firebase Console

1. Log in to https://console.firebase.google.com/ with the AUMT credentials
2. Under Projects, go to the AUMT Website project

## Creating a Login

1. Go to the firebase console (see above section)
2. select the Authentication tab at the left
3. Add a user then copy the new user's UID for later use

## Deleting a User

1. Go to the firebase console (see above section) then select the Authentication tab at the left.
2. Find the user by searching their email
3. On the far right of the user's entry in the table, click on the stoplight menu and delete the user.
