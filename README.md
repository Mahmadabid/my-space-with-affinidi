# My Space

[My Space App](https://my-space-affinidi.vercel.app/)

## Technologies used

* Affinidi
* CockroachDB
* Nextjs
* Typescript

### Affinidi

Affinidi is used to handle Authentication of users and provide requested data of user to the web app. In My Spacei is integrated to enhance user experience, handle authentication and giving features like banking and others that help in your daily life.

### Affinidi Information Used

Currently Affinidi offers various data points about users and Pixel Marketplace is using all of them to offer a personalized and enhanced experience.

* **Name**

    Affinidi gives complete name and nickname as well. Name includes First, Middle and Last Name. First, Middle and Last name is used in [Bank Form](https://github.com/Mahmadabid/my-space-with-affinidi/blob/master/src/components/bank/Form.tsx) and in [Card Page](https://github.com/Mahmadabid/my-space-with-affinidi/blob/master/src/pages/card.tsx). Nickname is used to greet users when they login to the My Space. Middle Name is used in [Profile Page](https://github.com/Mahmadabid/my-space-with-affinidi/blob/master/src/pages/profile.tsx) and in [Card Page](https://github.com/Mahmadabid/my-space-with-affinidi/blob/master/src/pages/card.tsx).

* **Email**

    Email is used to verify the users and is used in [Bank Form](https://github.com/Mahmadabid/my-space-with-affinidi/blob/master/src/components/bank/Form.tsx) and in [Card Page](https://github.com/Mahmadabid/my-space-with-affinidi/blob/master/src/pages/card.tsx).

* **Phone Number, Address, Postal Code, City, Gender**

    Phone Number, Address, Postal Code, City, Gender are also used in [Bank Page](https://github.com/Mahmadabid/my-space-with-affinidi/blob/master/src/pages/bank.tsx) to enhance user experience. All these fields are filled automatically.
    While in [Card Page](https://github.com/Mahmadabid/my-space-with-affinidi/blob/master/src/pages/card.tsx) Phone Number, Address and Country is used to enhance user Experience and ease of access.

* **Picture**

    Picture is used in [Profile Page](https://github.com/Mahmadabid/my-space-with-affinidi/blob/master/src/pages/profile.tsx). and [Home Page](https://github.com/Mahmadabid/my-space-with-affinidi/blob/master/src/pages/index.tsx). Picture is displayed for user in Header for logout and navigation. In profile page it is used in completing profile of user.
 
* **Birthdate**

    Based on Age bank access is provided. Age is calculated from birthdate and bank account creation process is started.
 
* **Country**

    [Code](https://github.com/Mahmadabid/my-space-with-affinidi/tree/master/src/components/country)

    Country displays products in User's native currency to enhance User experience. Countries are fetched using ```https://restcountries.com/v3.1/all``` API. Missing countries are added in it and exported as a typesript variable in [Country.js](https://github.com/Mahmadabid/my-space-with-affinidi/tree/master/src/components/country/Country.js) file and exported variable in [CountryList.ts](https://github.com/Mahmadabid/my-space-with-affinidi/tree/master/src/components/country/CountryList.ts).

    Currencies conversion rates are fetched thorugh ```https://open.er-api.com/v6/latest/USD``` API. Missing currencies are added using [CurrencyList.js](https://github.com/Mahmadabid/my-space-with-affinidi/tree/master/src/components/country/CurrencyList.js) file and exported as typescript variable in [Currencies.ts](https://github.com/Mahmadabid/my-space-with-affinidi/tree/master/src/components/country/Currencies.ts).

    For better speed rates are prefetched an.d arent fetched on request. So data may become old. After countries and currencies are fethed they are merged using [Currency.js](https://github.com/Mahmadabid/my-space-with-affinidi/tree/master/src/components/country/Currency.js) which generates a typescript variable [Countries.ts](https://github.com/Mahmadabid/my-space-with-affinidi/tree/master/src/components/country/Countries.ts) containing all information about countries.

* **LivenessCheck**

    LivenessCheck is used to assign a blue tick checkmark to the user. Verified users will get access to bank.
 
* **userID**
 
    userID is used to assign id to transactions, bookmarks, expenses and todos. userID is also used to access bank.
 
### User Experience

User experience is enhanced by autmoatically populating fields. 

#### Bank

[Bank Page](https://my-space-affinidi.vercel.app/bank) populates user information in relevant fields and user can easily create an account in few seconds. It uses most of the affinidi information to ensure authenticated users join. Allowing users to send money and to buy stuff from [Pixel Market](https://pixels-market.vercel.app/).

#### Card

[Card Page](https://my-space-affinidi.vercel.app/card) creates business cards for user. Giving users option to change color of card and text. Fields are added automatically.

#### Todo

[Todo Page](https://my-space-affinidi.vercel.app/todo) creates a todo manager for user. Data is stored on database so user can view and interact with todo on any device.

#### Bookmarks

[Bookmarks Page](https://my-space-affinidi.vercel.app/bookmarks) creates a bookmarks manager for user. Data is stored on database so user can view and interact with bookmarks on any device.

#### Expense Tracker

[Expense Tracker Page](https://my-space-affinidi.vercel.app/expenses) creates a expense tracker for user. Data is stored on database so user can view and interact with expenses on any device.

### [Profile](https://my-space-affinidi.vercel.app/profile)

[Code](https://github.com/Mahmadabid/my-space-with-affinidi/blob/master/src/pages/profile.tsx)

Profile page uses all of the affinidi information to create a profile page for user.
