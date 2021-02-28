# Something Awesome Project Proposal (27 Feb 2021)

## What is it?

Out of all the suggested ideas, I was most drawn to creating a **malicious Browser Extension**. I have been infiltrated by these types of extensions before (namely The Great Suspender... rip), so I wanted to find out more about what types of information browser extensions have access to and what they can do to work around browser security. The obvious relationship this has to the course is that we can learn attacking methods, from a malicious perspective.

## Why is this exciting to me?

This project will be very eye-opening about the possible vulnerabilities of browsers and the kinds of data that are available through these means. I believe this will teach me lots of interesting things about the inner workings of browsers, and be valuable experience in the area of web exploitation.

## Details of the project
I have little experience in writing browser extensions, so I have looked to other sources for some inspiration (note, I have no intention on plagiarising, these are purely here for starting ideas):
- https://github.com/nigamaviral/Malicious-Browser-Extension
- https://github.com/Z6543/ZombieBrowserPack
- https://jumpcloud.com/blog/eliminate-malicious-extensions
- https://www.komando.com/security-privacy/these-4-malicious-chrome-extensions-are-infecting-more-than-half-a-million-users/438093/

The aim is to create an inconspicuous browser extension (which will be **clearly labelled as malicious** for our purposes), with some/all of the following functions,
- Logging browsing history and cookies
- Logging keystrokes and HTTP requests
- Logging location
- Logging passwords, usernames, emails and other account information
- Stealing passwords for passwords stored in browser
- Rerouting/modifying HTTP requests
- Bypassing CORS
- Spying on webcam and microphone
- Execution of scripts
- Redirection from websites for the purpose of phishing

There will also be a backend server that will be where all the data is sent and stored.

The new things I will need to learn include:
- How to develop browser extensions
- How to access data stored, received and sent from a browser
- How to request/bypass requests to access data/control webcam and microphone.
- (possibly) How to hide the fact that there are malicious things going on

The final product will be a Chrome/Firefox browser extension, in conjunction to a server.

## Timetable & Milestones

Due to my inexperience, I am unable to gauge which features are plausible and which take longer to develop. This timetable will be for reference, the timetable of the features are completely up for change during development.

| Week | Goal (at the end of each week)                                                                                                                                                                           |
| ---- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2    | Submit the project proposal                                                                                                                                                                              |
| 3    | Complete the base extension, not currently malicious. Use this time to explore what extensions can do and have access to. Write up an outline of what functionality that is possible with the extension. |
| 4    | Start on/complete the backend server to accept requests related to the possible functionalities.                                                                                                          |
| 5    | Finalise the backend, and start working on the extension: logging username/password information and browser activity.                                                                                    |
| 6    | Work more on current features and add more to the extension: logging keystrokes, HTTP requests, executing scripts                                                                                        |
| 7    | Work more on current features and add more to the extension: modifying HTTP request, website redirection, CORS bypass.                                                                                   |
| 8    | Refine current features and finalise the extension                                                                                                                                                       |
| 9    | By the Friday tutorial, have the presentation outline ready to go                                                                                                                                        |


## Demonstration of progress
There will be weekly blog posts about my progress, what I learnt, and reflections on the completion of the milestone.

## Criteria
This may be extremely ambitious since I have no prior knowledge of how difficult some of these are.

| Objective                 | HD (100-85)                                                                                                                                                                                                                                      | DN (84-75)                                                                                                                                                                                      | CR (74-65)                                                                                                                                                                                   | PS (64-50)                                                                                                                                            | FL (<50)                                                                                                                  |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| Features                  | All features completed, including more than three complex features (rather than just logging widely available data)                                                                                                                              | More than 9 features complete, including more than two complex features (rather than just logging widely available data)                                                                        | More than 7 features complete, including more than one complex feature                                                                                                                       | More than 5 features complete, only one complex feature                                                                                               | More than 3 basic features complete                                                                                       |
| Feature list (*complex*)  | Logging browsing history, cookies, keystrokes, HTTP requests, location, login and account information. Stealing stored passwords, *rerouting/modifying HTTP requests*, *bypassing CORS*, *spying on webcam and microphone*, *execution of scripts*, redirection | Logging browsing history, cookies, HTTP requests, location, login and account information. Stealing stored passwords, *bypassing CORS*, *spying on webcam and microphone*, *execution of scripts*, redirection | Logging browsing history, cookies, HTTP requests, login and account information. Stealing stored passwords, *bypassing CORS*, *execution of scripts*, redirection                            | Logging browsing history, cookies, HTTP requests, login and account information. *Execution of scripts*, redirection                                  | Logging browsing history, HTTP requests, login and account information. Redirection                                       |
| Whats new (right to left) | + Logging keystrokes. *Rerouting/modifying HTTP requests*                                                                                                                                                                                        | + Logging location. *Spying on webcam and microphone*                                                                                                                                           | + Stealing stored passwords, *bypassing CORS*                                                                                                                                                | + Logging Cookies. *Execution of scripts*                                                                                                             | Logging browsing history, HTTP requests, login and account information. Redirection                                       |
| Blog                      | Weekly (or more) blog posts demonstrating deep understanding of theory behind the new features, and reflecting on all the challenges and their resolution. Analysis of what was learnt and how that impacts the safety of browser extensions.    | Weekly blog posts demonstrating understanding of new features, and reflecting on all the challenges faced. Some analysis of what was learnt and outline of its impacts.                         | Weekly blog posts briefly demonstrating understanding of new features, and briefly reflecting on the development process. Brief analysis of the implications of insecure browser extensions. | Weekly blog posts demonstrating surface understanding of new features, and briefly reflecting on the development process. Little analysis of impacts. | Weekly blog posts demonstrating surface understanding of theory behind new features. Little to no reflection or analysis. |

<!-- | Functional | Fully functional and bug free extension and backend package.                                                        | Working extension and backend package, except a one feature not fully functional/not complete/buggy.                     | Mostly working, some buggy/broken backend or extension features        | Some things are working                                          | Only 2 features are functional      | -->

---
<!--
**Just a guide on what to put in the proposal**

- what you want to do for your project
- why you think this would be an interesting and relevant project as a security student of this course
- *why* you are keen to do it
- what will it involve: what will you do? what will you have to learn? what will the outputs be (a video? software and a demo video?, resources for others to use?, ...?)
- what is your timetable - what will you be up to each week?
- how you will demonstrate that you have made satisfactory progress?
- propose criteria for satisfactory and for outstanding performance at the end

-->