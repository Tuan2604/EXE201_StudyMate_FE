I will modify `src/login/login.tsx` to implement the requested features:

1.  **JWT Decoding**: Implement a helper function to decode the JWT `accessToken` returned from the API to extract the user's name. I will check for common claim keys like `unique_name`, `name`, or the standard SOAP XML schema name claim.
2.  **Toast Notification**: Create a temporary Toast component using Tailwind CSS within the Login page to display the "Welcome [User]" message.
3.  **Login Flow Update**:
    *   On successful API response, decode the token.
    *   Extract the user name.
    *   Show the Toast notification.
    *   Delay navigation to the home page by 1.5 seconds to allow the user to see the welcome message.
    *   Proceed with `login()` context update and `navigate('/')`.

**Implementation details**:
- Use `atob` for decoding the token payload (Base64Url decoding).
- Tailwind classes for Toast: `fixed top-5 right-5 bg-green-500 text-white px-6 py-3 rounded shadow-lg z-50 animate-fade-in-down`.
