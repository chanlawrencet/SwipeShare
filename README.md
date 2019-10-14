# Swipe Share
A way to share your extra meal swipes with those who need them most

Developed first at Tufts Polyhack Hackathon 2019

## Team Members
- Lawrence Chan, lead full stack developer
- Naoki Okada, backend developer
- LuLu Zheng, backend developer
- Titapa Chaiyakiturajai, frontend developer, UI/UX designer
- Jacqueline Chin, frontend developer, UI/UX designer

## Motivation
Hunger is a particular problem across the United States and around the world. 
There's a particular population, though, that has very close access to meals.
Students already have many burdens, including homework, work, career searching, exams, and various other duties.
Unfortunately, this population also experiences a high amount of hunger, due to the increasingly high costs of higher education.
Some universities, such as ours, has mealswipe systems set up, but cap the maximum amount to share at 4. 
We wanted to push that number but not have to interface with existing university systems.
Here came Swipe Share, a way for people with extra meal swipes to "swipe" people in to dining halls.

## Usage
At our university, we allow students on a meal plan (usually a set number, like 160) to swipe in other people.
Students giving swipes ask the receptionist at the hall to swipe their associate in, and their account is charged twice (once for themselves, once for a friend).
We propose this system of posting when givers plan to be at a dining hall and are willing to meet up and swipe a fellow Tufts student in.

### Account setup
In this working product, we allow the public to view and interact with the data, but restrict actions
other than filtering the events. Students with a `@tufts.edu` account are allowed to sign up and receive a code
in their official university mailbox. This code is used for authentication into the site. 
The application also uses cookies to store login information to prevent logouts (we recognize that this is an insecure method).

All user accounts are the same.
### Giving
A giving users can post an event by clicking the "give a swipe" button,
where they are prompted to enter in corresponding information about their giving.

### Receiving
All receiving users can receive a meal swipe by clicking the "request meal" butto, which is followed by a confirmation message.
