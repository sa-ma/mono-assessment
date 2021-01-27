# Mono Assessment

[Sample App](https://mono-assessment.vercel.app/) is a web application that gives you access to your financial account details across Africa.

![](https://paper-attachments.dropbox.com/s_67D2BE97616EF0FA524F4EB785CA9931B6D14C2C62B847C844884501BC23709E_1611626949785_image.png)

## Features

- Link your financial account
- Get your financial information and balances
- Get your transactions in real-time
- Sync user data

## Technologies used

- [Create React App](https://create-react-app.dev/docs/getting-started/)
- [Axios](https://www.npmjs.com/package/axios)
- [date-fns](https://date-fns.org/)
- [React Spinners](https://www.npmjs.com/package/react-spinners)
- [React Toastify](https://www.npmjs.com/package/react-toastify)

## Getting Started

These instructions will get you started running the application.

**Prerequisites**

- Knowledge of JavaScript and React
- Node js v10 or greater
- npm v5.2 or greater
- yarn
- Git

**Installation**

- Clone the repository
  git clone https://github.com/sa-ma/mono-assessment.git
- Navigate to the root directory and run `yarn install` to install dependencies
- Get your API keys from [Mono](https://docs.mono.co/docs/sign-up)
- Create a `.env` file in the root directory of the project
- Copy the contents of `.env.sample` file and paste in `.env` file
- Replace the placeholder API keys with the keys gotten from Mono
- Start the development server `yarn start`

## How it works

When the app is launched you are presented with a Landing page that shows an Authenticate with Mono button. Clicking the button allows you to link a user account to your web app. Mono has a widget that comes with its [SDK](https://github.com/withmono/connect.js) which is responsible for the heavy lifting when linking a user account. Whenever the Authenticate with Mono button is clicked it launches the widget which guides you through the linking process.

![](https://paper-attachments.dropbox.com/s_67D2BE97616EF0FA524F4EB785CA9931B6D14C2C62B847C844884501BC23709E_1611648819028_image.png)

This is a snippet of what happens under the hood

    const monoConnect = React.useMemo(() => {
        const monoInstance = new MonoConnect({
          onClose: () => console.log('Widget closed'),
          onLoad: () => console.log('Widget loaded successfully'),
          onSuccess: ({ code }) => console.log(`Linked successfully: ${code}`),
          key: "PUBLIC_KEY",
        })

        monoInstance.setup()

        return monoInstance;
      }, [])

After linking an account, a code is returned from the Mono Widget. This code can now be used to retrieve an account id from [Mono’s Exchange token endpoint](https://docs.mono.co/reference#authentication-endpoint) that is used with your secret key stored in `.env` file to get the information used in the application.

The account id gotten from Mono is stored in the [local storage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) and the user is redirected to the Dashboard. The dashboard contains the account information and latest transactions of a user which is pulled from Mono. The `service.js` file showed below contains the functions responsible for the data in the application

    import axios from 'axios';
    import { format, sub } from 'date-fns';
    import { toast } from 'react-toastify';
    const startDate = format(new Date(), 'dd-MM-yyyy');
    const endDate = format(sub(new Date(), { days: 5 }), 'dd-MM-yyyy');
    export const getUserData = (userId, cbData) => {
      axios
        .get(`https://api.withmono.com/accounts/${userId}`, {
          headers: { 'mono-sec-key': process.env.REACT_APP_SECRET_KEY },
        })
        .then(({ data }) => cbData(data))
        .catch((error) => toast.error('Error fetching user data.'));
    };
    export const getTransactions = (userId, cbData) => {
      axios
        .get(`https://api.withmono.com/accounts/${userId}/transactions`, {
          headers: { 'mono-sec-key': process.env.REACT_APP_SECRET_KEY },
          params: {
            startDate,
            endDate,
            pagination: false,
          },
        })
        .then(({ data }) => {
          if (data.data.length > 10) {
            cbData(data.data.splice(0, 10));
            return;
          }
          cbData(data.data);
        })
        .catch((error) => {
          toast.error('Error fetching transactions.');
        });
    };
    export const refreshData = (userId, cbIsLoggedIn) => {
      axios
        .post(
          `https://api.withmono.com/accounts/${userId}/sync`,
          {},
          {
            headers: { 'mono-sec-key': process.env.REACT_APP_SECRET_KEY },
          }
        )
        .then(({ data }) => {
          if (data.status === 'failed' && data.code === 'SYNC_ERROR') {
            toast.error(data.message);
            localStorage.removeItem('@auth');
            cbIsLoggedIn(false);
            return;
          }
          return;
        })
        .catch((error) => {
          toast.error('Unable to sync data. Please try again.');
        });
    };

- `getUserData`: is responsible for fetching the account information of a user from the [information endpoint](https://api.withmono.com/accounts/id) on Mono. It takes `id` and `cbData` as parameters. The `id` is the account id of the authenticated user and `cbData` is a callback function for handling the data returned from Mono.
- `getTransactions`: this function fetches the latest transactions of the user from [Mono](https://docs.mono.co/reference#transactions). A start and end date are passed as query params to get only transactions of the last 5 days. it takes the account id and a callback to handle the data as parameters.
- `refreshData` : before \[data sync\](https://mono.co/blog/introducing-mono-data-sync) a user will have to be re-authenticated to be able to fetch new transaction data. The `refreshData` allows us to refresh the account id with the financial institution of the user so we can always get up to date data in our application without having to go through the re-authentication process.

## References

- [Mono API Docs](https://docs.mono.co/)
