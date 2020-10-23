This document is for the website developer on the AUMT committee and contains a list of tasks they need to do and a development method recommended by the site's creator.

# Tasks

* Keep the information pages (About, FAQ, etc) up to date and correct
* Create trainings and have them scheduled to open on time
* Monitor Firebase usage and keep costs to a minimum. Goal is to stay under free tier at all times.
* Take backups of members, especially at the start of the semester when everyone is signing up, and backups of training data at reasonable intervals. Upload these to the AUMT drive. See Admin guide for backups.
* Coordinate with whoever sends out emails to make sure the member data matches the members on the mailing list
* Every once in a while, check that the firebase logins match the member table. Remove unnecessary auth accounts.
* Update documentation


# Contributing

* Use git at all times:
  * Create a new branch for every feature or bug and name it descriptively
  * Closely follow git [best practices](https://deepsource.io/blog/git-best-practices/), most importantly single-purpose commits and descriptive commit messages
* Test **thoroughly** and often and as much as possible. Make sure everything looks good and works on both mobile and desktop. 
* Try and limit deploying to weekends or whenever there isn't a signup form active just in case things break.
* Test after deploy to make sure basic features still work
* Put effort into making things look good and, especially, easy to use