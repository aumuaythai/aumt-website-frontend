# Managing User Logins in Firebase

Warning: the sections for bulk importing and deleting users require running and most likely understanding some code.

## Importing Users

NOTE: this will not create accounts with known passwords. To activate, each account must reset their password by email.

To add a small number of users or to add with known passwords, see the Creating a Login section of the Admin guide. To add many at a time, continue below.

***

The process below just follows firebase's guide here: https://firebase.google.com/docs/cli/auth

To import accounts to firebase, follow the steps below:

1. Get your desired members to import by clicking  `Download .csv`  at the footer of the Admin members table (aumt.co.nz/admin/members)

1. Create a new .csv [to firebase's specification](https://firebase.google.com/docs/cli/auth#CSV). Below is an R script that reads in the downloaded members and writes a new csv importable by firebase. It uses the `md5` algorithm for passwords.

```r
library(digest)
member.df <- read.csv('2020_s1_paidmembers.csv')

hashes = rep(digest('aumuaythai2348', algo='md5',serialize = F), nrow(member.df))
import.df = data.frame(key=member.df$key,
                       email=member.df$email,
                       email.verified=rep(F,nrow(member.df)),
                       pass.hash=hashes,
                       pass.salt=NA,
                       name=paste(member.df$firstName, member.df$lastName),
                       photo.url=NA,
                       googleId=NA,
                       Google.Email=NA,
                       Google.Display.Name=NA,
                       Google.Photo.URL=NA,
                       Facebook.ID=NA,
                       Facebook.Email=NA,
                       Facebook.Display.Name=NA,
                       Facebook.Photo.URL=NA,
                       Twitter.ID=NA,
                       Twitter.Email=NA,
                       Twitter.Display.Name=NA,
                       Twitter.Photo.URL=NA,
                       GitHub.ID=NA,
                       GitHub.Email=NA,
                       GitHub.Display.Name=NA,
                       GitHub.Photo.URL=NA,
                       User.Creation.Time=NA,
                       Last.Sign.In.Time=NA,
                       Phone.Number=NA
)
write.table(import.df, sep=',', 'firebase-import.csv', row.names=F, col.names = F, na='')
```

3. Have the firebase cli installed https://firebase.google.com/docs/cli#setup_update_cli

1. Have the website repo set up https://github.com/aumuaythai/aumt-website-frontend

1. From the project root directory, import your newly created firebase users csv. For the example above, that looks like:

```
firebase auth:import firebase-import.csv --hash-algo=MD5 --rounds=4
```


## Deleting Users

To delete one at a time, see the Deleting a User section of the Admin guide.

As of now firebase doesn't have a good way to delete a bunch of users but there is a hacky way to do it in the console. The script below is a modified version of the answer from  https://stackoverflow.com/a/42467103.

- The script loops through and deletes the users whose emails are specified in the `deleteEmails` array.

- It can be modified to delete all users *except* a specified few or delete all users in general.

- Because the script only sees users displayed on the page, increase the Rows per Page value at the bottom to its max to include all users.


```javascript
var intervalId;
var deleteEmails = [
  'hcho812@aucklanduni.ac.nz',
  'liamcreed@live.com',
  'sbkoh220@gmail.com',
  'cibo816@aucklanduni.ac.nz',
  'elliotsangsongkhram@gmail.com',
  'sflo674@aucklanduni.ac.nz',
  'kodo094@aucklanduni.ac.nz',
  'ugna304@aucklanduni.ac.nz',
]
var clearFunction = function() {
  var size = $('[aria-label="Delete account"]').size()
  for (let i = size - 1; i >= 0; i --) {
    var tableRowElement = $('[aria-label="Delete account"]')[i].parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement
    var userEmail = $(tableRowElement).find('.a12n-user-email-content').text().trim()
    if (deleteEmails.indexOf(userEmail) >= 0) {
        $('[aria-label="Delete account"]')[i].click();
        setTimeout(function () {
           $(".md-raised:contains(Delete)").click()
        }, 800);
        console.log('trying to delete', userEmail)
        return
    } else {
      // console.log('skipping nodelete', userEmail)
    }
  }
  console.log('deleted all emails, stopping')
  clearInterval(intervalId)
};

intervalId = setInterval(clearFunction, 1000) 

```