# Admin Section Usage

This guide will go over how to use the admin section of aumt.co.nz, tab by tab.

## Trainings

### Properties

* Title - will appear as the heading on the signup form
* Opens - the date and time at which the training will appear for member signups
* Closes - the date and time at which the training will disappear from the signup tab.
* Open To Non-Members - whether or not non-members can sign up to the training (useful for trials, womens' training, etc). 
    * If No, the website will require a member to sign in and have paid to view the training.
    * If Yes, the form will be open to anyone and the "Feedback" input on the form will be replaced with a "Name" field so admin has an idea who signs up
        * If Yes, the name will displayed as (nonmember) \<Name> in the Edit Members section of the Training Dashboard
* Sessions - options for members to sign up to. There must be at least one. Each session has the following:
    * Title - displayed as an option on the form
    * Limit - how many members can sign up
    * Position - the order of the session: 0 = first option, 1 = second option, etc
* SignupMaxSessions - how many sessions can be signed up for at once
* Notes - any miscellaneous text for admin to put on the training form for anyone to read. Must be a markdown string
* Feedback - any anonymous feedback given when signing up to the training

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

Admin can move members between forms or remove them from the training under the Edit Members section of the Trainings tab. To do so, select a person from the session displayed. One can move it to a training that isn't full. Removing them will remove them from the session and free up a spot. Admin can also add people to a session using the input and Add button by the session. To sign up a member, use Attendance section under the Members tab.

The numbers to the left are the (number of signups) / (session limit) for the particular session. 

### Other Training Dashboard Functionality 

* The graphs are just for fun
    * Week stats shows what time and day people sign up in the week. Its colors are random so they might be super ugly sometimes.
    * Year stats shows how many people total signed up for each form.
* Click on a point in the Year stats graph, a training title in the Manage Trainings section or select from the top right dropdown to view stats for the desired training.
* Click Generate Report in the top left to build a pdf of all trainings and signups. The first click should load the pdf-generating code and subsequent clicks should compile a new pdf and prompt a download .

### Backups

Backups should be taken regularly and stored on the AUMT drive. These are just so if anything goes wrong the data will at least be somewhere. Download all training data by clicking Download in the Manage Trainings section and downloading both signups or trainings. The csvs are in [tidy (ish) flormat](https://r4ds.had.co.nz/tidy-data.html#tidy-data-1) for ease of use

## Events

Events can be set to accept signups or display a description and links.

### Properties

* Title - the main title displayed on the Event
* Url Path - the path the event will be seen at (a url path of `omori-sem-2` will be aumt.co.nz/events/omori-sem-2)
* Description - A description of the event, in markdown
* Date - A date and time for the start
* Location - A location for the event
* Location Link - a maps url that can be clicked to see the location
* FB Link - A link to the facebook event page
* Photo URL - A link to a photo to be displayed on the event page (not implemented so doesn't work yet)
* Enagle Signups - See below

### Create an Event, Edit an Event, Delete an Event

These are all in the Admin section under the Events tab.

### Signups

If enable signups is checked in the admin section, members will be able to sign up for an event. The signup configuration options are:

* Opens - the date the sign up form opens
* Closes - the date the sign up form closes
* Limit - how many members can sign up to an event before no more are allowed
* Need Admin Confirmation - whether or not a signup needs to be confirmed by admin - this can be done under the signups section where admin can change `Paid?` to yes or no.
* Include Drivers and Dietary Requirement Form - whether to put the driver and meal options on the form, used for camp
* Open to Non Members - whether one must be logged in to see the form

Signups can be seen by clicking `View Signups` on the event from the admin section. .

## Members

### Properties
* First Name
* Last Name
* Preferred Name - optional
* Email
* UPI - 0 for people not at UoA, otherwise their UPI
* Membership - S1, S2, SS or FY for a Semester one, Semester two, or Full Year membership
* Returning Member - whether a member was a member in the past (Yes or No)
* UoA Student - whether or not a member is enrolled at UoA (Yes or No)
* Paid - whether or not the member has paid for their membership (Yes or No)
* Payment Type - a member's intended payment type (Cash or Bank Transfer or Other)
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
3. Click on the member's name
4. Edit the desired fields on the right and click Save to save. Changes should reflect immediately in the table.
5. Cancel the edit by clicking the close button at the top right of the form.

### Delete a Member

1. Navigate to the member as done in the previous section
2. Click Remove Member and confirm
3. Delete member login from the firebase console (see Deleting a User)

### Backups

Regular backups are super duper important because a website hacked together by an unpaid committee member may not be as reliable as Google Sheets. Because firebase's free plan doesn't allow backups there is functionality to do it on the site. 

To store data as a backup, just click Download .csv at the member table footer with no table filters active. All member information will be downloaded including login UIDs. In case anything with the website breaks all the information will be in the last csv downloaded and can be imported to google sheets or back to the website.

To restore members from a .csv, click the Import Members button in the Member tab of the Admin section. Notes will be on the popup. It is strongly recommended to only import a .csv that was downloaded from the website. 

**WARNING** - Importing members this way does not create logins, just entries in the member database.

The Import Members button and the Download .csv button are meant to work together for backups.

### Other features
* To select multiple members for download, email copy or to remove, turn on the Multi Select switch above the table.
* Some table entries have an icon to their right. This is for quickly editing or copying the data. For example you can quickly switch a member's paid status without having to open and edit the member. Hover over the icon and a tooltip will appear telling you what clicking it will do. 
* One can filter the table by clicking the filter or search icon next to a column's header. Some have categorical filters and in some you can search for text (a name, etc)
* For ease of searching, a display name has been created for each member and is displayed in the table under Name. It is not stored in the database.
* Download a .csv file by clicking Download .csv in the Table footer. It will create a CSV file of all filtered members displayed in the table. This can later be used as an excel file or an import to Google Sheets
* Click on a member's name in the table to edit their details or view attendance. It will show all training sessions, which ones they have signed up for and the session they selected. One can edit their signup by clicking the edit icon to the right.
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

To import many users at a time see the Importing Users section of the Firebase guide.

## Deleting a User

1. Go to the firebase console (see above section) then select the Authentication tab at the left.
2. Find the user by searching their email
3. On the far right of the user's entry in the table, click on the stoplight menu and delete the user.

To delete many users at a time see the Deleting Users section of the Firebase guide.

