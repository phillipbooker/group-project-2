# group-project-2

## DRES

[DRES Deployed Project](https://dresfit.herokuapp.com/)

### Members
Phillip Booker
Loren Brown
Roman Senin
Paige Smith

## Project Description

DRES is an application that allows a user to find an outfit for any occasion. The outfits that can be found on DRES are supplied by users that build the outfits piece by piece.

DRES is powered by a Node Express server that uses Sequelize to handle database transactions. Handlebars is used to render all pages.

The authentication is handled using Passport, reuqiring the user to have a Google account.

## Users

DRES has two types of users - Clients and Stylists

### Client

- The Client will be able to use our outfit search feature by selecting the occasion they would like to be styled for.
- A price limit can be set to ensure the Client can find an outfit that is just right for them.
- A collection of outfits that meet the search criteria will be generated.
- Once the Client clicks one of the outfits they will be taken to a page to purchase each item that completes the set as designed.

### Stylist

- The Stylist will be able to design an outfit for all potential Clients.
- First the outfit will be given a category, image link, and a price.
- Once the outfit paramaters have been set the Stylist can proceed to add and edit items for the ensemble.
- Using the navigation menu the Stylist will have access to all outfits they have designed  with the ability to edit them at-will.

#### Technologies

HTML, CSS, Handlebars, JavaScript, NodeJS, Express, MySQL, Sequelize, Passport