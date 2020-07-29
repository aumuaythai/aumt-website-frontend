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

OR

https://firebase.google.com/docs/auth/admin/manage-users#create_a_user


## Deleting Users in Firebase

To delete one at a time, see the Deleting a User section of the Admin guide.


To delete many users, see the guide below. You must [initialise the firebase admin sdk](https://firebase.google.com/docs/admin/setup#initialize-sdk) in the repo's root directory. The package is already installed as a dev dependency of the aumt repo. Uncomment the section of  `admin-scripts.js` corresponding to deleting users and replace the array of dummy uids with the desired ones.

run the script `node admin-scripts.js`


Documentation can be found here:

https://firebase.google.com/docs/auth/admin/manage-users#delete_multiple_users


## Changing a member's email in Firebase

To change a member's email you must change it in both on the AUMT website aumt.co.nz/admin/members and via the firebase admin sdk.

See notes for using the admin sdk above, and use the commented out section of admin-scripts.js corresponding to changing emails.

run the script `node admin-scripts.js`

Documentation can be found here:

https://firebase.google.com/docs/auth/admin/manage-users#update_a_user0