# Connect & Chat

Build this app using the HTML files referenced below. You can hotlink the images referenced in the HTML. The attached images are screenshots of the desired screens. Here are public links to the html of the screens which you should read and use to build the app:

1. https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzAwMDY1OGQwMGYzM2YyNDIwMzM4NDU1NTk0M2I1YWQ5EgsSBxDXnfnimA8YAZIBIwoKcHJvamVjdF9pZBIVQhMxNzAwMjk1Mjg5NTEwOTE0MzY0&filename=&opi=89354086
2. https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzAwMDY1OGNmNDQ5YmQ5MzIwOTI1ZDEyZmZhMGRkZDdmEgsSBxDXnfnimA8YAZIBIwoKcHJvamVjdF9pZBIVQhMxNzAwMjk1Mjg5NTEwOTE0MzY0&filename=&opi=89354086
3. https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzAwMDY1OGNmNDQyMTlmOWQwMWE2MzJkMWQyMGRmZTQ1EgsSBxDXnfnimA8YAZIBIwoKcHJvamVjdF9pZBIVQhMxNzAwMjk1Mjg5NTEwOTE0MzY0&filename=&opi=89354086
4. https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzAwMDY1OGNmNDM4MTJlODMwN2M0ZDhhZTRkMDUxYjVhEgsSBxDXnfnimA8YAZIBIwoKcHJvamVjdF9pZBIVQhMxNzAwMjk1Mjg5NTEwOTE0MzY0&filename=&opi=89354086 I want to make a few adjustments to the application while keeping the exact visual style, colors, typography, spacing, and existing components. Do not redesign the application or change anything that is unrelated to these instructions.

5. Chat Screen — Open a Conversation When Selecting a Contact

On the Chat screen, there is currently a list of contacts/conversations.

I want clicking/tapping on any contact to open a new individual chat screen with that person.

The new screen should:

Display the selected person's name at the top.

Keep the same visual style as the rest of the application.

Display the message history for that conversation.

Allow the user to type and send messages.

Messages sent by the user should appear in the conversation.

For now, we do NOT need to implement received messages from the other person or real-time communication.

The text input should be fixed at the bottom of the screen.

The send button should work and add the message to the conversation visually.

When pressing the back button, return to the contact list.

Each contact should have its own independent conversation.

For now, use mock data for conversations if a backend does not exist yet.

2. Profile Screen — Allow the User to Enter a Location

On the Profile screen, there is a field related to location.

I want the user to be able to manually type a location into this field.

The field should:

Be editable.

Allow free-form text.

Display the value entered by the user.

Keep the same visual design as the other profile fields.

Store the entered value in the profile state so it does not disappear when navigating between screens.

Do not add Google Maps, geolocation, or external API integrations yet. We only need the user to be able to enter and save a location.

3. Matches Screen — Remove the Number "3"

At the top right of the Matches screen, there is currently a circle containing the number 3.

Remove it completely.

Do not replace it with another element and do not modify the rest of the header.

4. Matches Screen — Align Chat Information Horizontally

In the chat cards/list within the Matches screen, there are currently:

The compatibility percentage banner.

The day/date when the message was sent.

I want these two elements to be aligned horizontally on the same row.

For example:

[ 85% Compatible ] [ Today ]

The compatibility percentage should remain inside its existing banner, and the date/day should keep its current styling.

Do not change the content, colors, or design of these elements. Only modify the layout so they are horizontally aligned with appropriate spacing.

Important

Keep the application's existing design.

Do not change colors, typography, icons, or existing styles unless strictly necessary for these changes.

Make sure the new screens are responsive and work correctly on both desktop and mobile.

Reuse existing components whenever possible.

Do not remove any existing functionality.

Do not implement a backend, authentication, WebSockets, or new APIs for these changes. Use state/mock data where necessary.

Make sure navigation between the contact list and individual conversations works correctly.

Before finishing, verify that none of these changes have affected the other screens of the application.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/5e669d99-540d-4902-9744-75e557f59118).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
