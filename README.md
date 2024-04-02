# ShinyGarageMalta

Developer: [George Attard](https://github.com/GDV373){:target="_blank"}


Visit the [live site](https://shinygaragemalta-594b33247f63.herokuapp.com/)

This is my final project for the Full-Stack Software Development Course at Code Institute. This consists of a fully working e-commers website for a car cleaning brand.

![screenshot](/readme_images/home.png)

## Table of Contents

- [Introdution](#introdution)
    - [Business goals addressed with this site](#business-goals-addressed-with-this-site)
    - [Customer needs](#customer-needs)
- [UX](#ux)
    - [Business Goals](#business-goals-addressed-with-this-site)
    - [Strategy](#strategy)
    - [Colour scheme](#colour-scheme)
    - [Typography](#typography)
    - [Images and Post Content](#images-and-post-content)
    - [Wireframes](#wireframes)
- [Agile Development Process](#agile-development-process)
    - [Strategy](#strategy)
    - [GitHub Projects](#github-projects)
- [User Stories](#user-stories)
- [Features](#features)
    - [Existing Features](#existing-features)
    - [Features to Implement in Future](#features-to-implement-in-future)
- [Database Design](#database-design)
- [Ecommerce Business Model](#ecommerce-business-model)
    - [Robots](#robots)
    - [Social Media Marketing](#social-media-marketing)
    - [Newsletter Marketing](#newsletter-marketing)
- [Testing](#testing)
    - [HTML Code Validation](#html-code-validation)
    - [CSS Code Calidation](#css-code-validation)
    - [Manual Testing](#manual-testing)
        - [How to use Stripe test card](#how-to-use-stripe-test-card)
    - [Automatic Testing](#automatic-testing)
- [Configuration and Deployment](#configuration)
    - [ElephantSQL Database](#elephantsql-database)
    - [coludaniary AWS](#amazon-aws)
    - [Stripe API](#stripe-api)
    - [Gmail API](#gmail-api)
    - [Heroku Deployment](#heroku-deployment)
    - [Local Deployment](#local-deployment)
- [Technologies Used](#technologies-used)
    - [Programming Languages](#programming-languages)
    - [Hosting and Database](#hosting-and-database)
    - [Frameworks and Libraries](#frameworks-and-libraries)
    - [Tools and Web Applications](#tools-and-web-applications)
    - [Code Validation](#code-validation)

- [Credits](#credits)
    - [Content](#content)
    - [Acknowledgements](#acknowledgements)

## Introdution

Welcome to Shiny Garage Malta! Our e-commerce platform, powered by Django, offers a seamless shopping experience for car enthusiasts. Explore our range of premium car cleaning products, search with ease, and securely pay online using Stripe. Stay informed with our Mailchimp newsletter and elevate your car care routine.

### Business goals addressed with this site
- Build brand awareness in Malta;
- Prensent the business value proposition with high-quality content;
- Catch customer's attention and offer a good experience on buying product.

### Customer needs
- Buy products.
- Keep Order History.
- Signup to the newsletter for receiving news about the products or offers

Back to [top](#table-of-contents)

## UX

Designing the site was straightforward, so I opted for a simple and clean layout.

The site flow is basic yet efficient. Users can easily add items to their shopping bag and view the running total as they navigate the site, streamlining the purchasing process.

Additionally, I've incorporated a footer on the home page featuring a signup form. Users can subscribe to our newsletter to receive exclusive offers and updates.

### Colour Scheme

I used the shinygarage colour team of black and white to comply with the image of the company 



### Typography

I used Google Fonts to select and import the font from google fonts that was used for all the text. while the logo was a picture created by using the company logo and
stating in it MALTA as the base of the company

### Images and Post Content

All the  images on the site were kindly donated by shinygarage with all the info about the products.

### Wireframes

I've used [Paint]() to design my site wireframes.

| Page | Wireframe |
| --- | --- |
| Home | ![screenshot](/readme_images/wierframe_home.jpg) |
| Cart | ![screenshot](/readme_images/wierframe_cart.jpg) |
| Products | ![screenshot](/readme_images/wierframe_products.jpg) |
| profile detail | ![screenshot](/readme_images/wierframe_profile.jpg) |

Back to [top](#table-of-contents)

## Agile Development Process

Kanban board can also be found here >  [Kanban url](https://github.com/users/GDV373/projects/2/views/1). 

### Strategy

 This project uses Agile Methodology. 

- <strong>Sprint 1</strong>:
Goal: Establish basic structure and functionality of the website.

Tasks:
Set up Django project and basic folder structure.
Implement user authentication and registration functionality.
Create database models for products, users, and orders.
Develop product listing page with placeholder design and content.
Duration: 1 week

---

- <strong>Sprint 2</strong>:
Goal: Expand website functionality and implement CRUD operations.

Tasks:

Implement CRUD functionalities for product management.
Develop shopping cart functionality for adding/removing items.
Integrate Stripe API for secure online payments.
Enhance user experience with responsive design for mobile devices.
Duration: 1 week

---
- <strong>Sprint 3</strong>:
Goal: Enhance user experience and implement additional features.

Tasks:

Implement search functionality for products.
Develop user profile pages with order history and account settings.
Integrate Mailchimp for newsletter subscription.
Implement product recommendation feature based on user preferences.
Duration: 1 week

---
- <strong>Sprint 4</strong>:
Goal: Testing, final deployment, and documentation.

Tasks:

Conduct thorough testing of all functionalities, including user acceptance testing.
Fix any bugs or issues identified during testing.
Deploy the website to a production server.
Prepare comprehensive documentation covering installation, usage, and maintenance instructions.
Duration: 1 week

---
- <strong>Sprint 5</strong>:
Goal: Review and retrospective.

Tasks:

Conduct a sprint review meeting to demonstrate the completed functionalities to stakeholders.
Gather feedback from stakeholders and end-users for future improvements.
Conduct a sprint retrospective meeting to reflect on the sprint and identify areas for process improvement in future sprints.
Duration: 1 week


### GitHub Projects

For this project, GitHub Projects was utilized as an Agile tool. While it's not a specialized tool, it can be customized with the appropriate tags and project creation/issue assignments to make it effective. User stories, issues, and milestone tasks were planned using it, then tracked on a weekly basis using the basic Kanban board.

## User Stories

| User Story ID | AS A / AN      | I WANT TO BE ABLE TO...                             | SO THAT I CAN...                                          |
|---------------|----------------|------------------------------------------------------|----------------------------------------------------------|
|               |                | ***Viewing and Navigation***                        |                                                          |
| 1             | Shopper        | View a list of products                              | Select some to purchase                                  |
| 2             | Shopper        | View a specific category of products                | Quickly find products I'm interested in without having to search through all products |
| 3             | Shopper        | View individual product details                      | Identify the price, description, product rating, product image |
| 4             | Shopper        | Quickly identify deals, clearance items and special offers | Take advantage of special savings on products I'd like to purchase |
| 5             | Shopper        | Easily view the total of my purchases at any time   | Avoid spending too much                                  |
|               |                | ***Registration & User Accounts***                   |                                                          |
| 6             | Site User      | Easily register for an account                       | Have a personal account and be able to view my profile  |
| 7             | Site User      | Easily login or logout                               | Access my personal account information                  |
| 8             | Site User      | Easily recover my password in case I forget it       | Recover access to my account                            |
| 9             | Site User      | Receive an email confirmation after registering      | Verify that my account registration was successful      |
| 10            | Site User      | Have a personalised user profile                     | View my personal order history and order confirmations and save my payment information |
|               |                | ***Sorting & Searching***                            |                                                          |
| 11            | Shopper        | Sort the list of available products                 | Easily identify the best rated, best priced and categorically sorted products |
| 12            | Shopper        | Sort a specific category of product                  | Find the best-priced or best-rated product in a specific category or sort the products in that category by name |
| 13            | Shopper        | Sort multiple categories of products simultaneously | Find the best-priced or best-rated products across broad categories, such as "clothing" or "homeware" |
| 14            | Shopper        | Search for a product by name or description          | Find a specific product I'd like to purchase            |
| 15            | Shopper        | Easily see what I've searched for and the number of results | Quickly decide whether the product I want is available |
|               |                | ***Purchasing & Checkout***                          |                                                          |
| 16            | Shopper        | Easily select the quantity of a product when purchasing it | Ensure I don't accidentally select the wrong product or quantity |
| 17            | Shopper        | View items in my shopping bag to be purchased        | Identify the total cost of my purchase and all items I will receive |
| 18            | Shopper        | Adjust the quantity of individual items in my bag    | Easily make changes to my purchase before checkout     |
| 19            | Shopper        | Easily enter my payment information                   | Checkout easily with no hassles                        |
| 20            | Shopper        | Feel my personal and payment information is secure   | Confidently provide the needed information to make a purchase |
| 21            | Shopper        | View an order confirmation after checkout            | Verify I haven't made any mistakes                     |
| 22            | Shopper        | Receive an email confirmation after checking out      | Keep the confirmation of what I've purchased for my records |
|               |                | ***Admin & Store Management***                       |                                                          |
| 23            | Store Owner    | Add a product                                       | Add new items to my store                               |
| 24            | Store Owner    | Edit / update a product                             | Change product prices, descriptions, images, and other product criteria |
| 25            | Store Owner    | Delete a product                                    | Remove items that are no longer for sale                |



Back to [top](#table-of-contents)

## Features

### Existing Features
| Feature | Description |  |
| --- | --- | --- |
| Hero image | A promotonal video was used in the home page using most of the products in an Epic edit. | |
| Footer | This is a clean with only a chimpmail subsribe visiable if scrolled down to. |  |
| Search Bar | To find specific products, users can utilize the search bar in the navigation menu. The search term is compared to product names and descriptions to provide a list of products that match the user's search criteria. | 
| Filter by Price or Category | Through the topbar is possible to display the products you select depending on what was clicked on . |  |
| All Products | This page displays all the available products |  |
| Product | With a good image of the product the name, category and price for a regular user is shown. For the admin, there are two special links for editing or deleting the product. |  |
| Cart pop up | When the user add a product to the bag, this pop-up informs that the product was added with success to the bag, besides a summary of the bag and a yellow message about the free delivery offer. The offer is removed once price is met |  |
| Shopping Cart Page | This page informs the items in the bag page for the user to double chech before the checkout. |  |
| Checkout Page | This page has the user fill in the delivery details and credit card info. For logged users, the name, email and delivery information can be saved to be pre-fill in the purchase. | 
| Order Confirmation Page | Once the order is done, the user will be directed to a confirmation page that informs them that an email containing the order confirmation has been sent to their provided email address. | 
| Profile page | This page stores the user's default delivery information and the order history. Each order number has a link to its order confirmation page | |
| Error Page | If the user ends up in a broken link or a page the doesn't exist, a error page is displayed informing that the page they are looking for isn't available with a humorus gif. | |
| Add Product | As an admin user, there is the possibility of add a new product to the site from the My Account >> Product Management dropdown menu in the navbar |  |


### Features to Implement in Future


- Wishlist
- Pre-Order function
- Coupon Code 

Back to [top](#table-of-contents)


## Database Design

Before starting code and create models, I built a Relationship Diagrams (ERD) with [Lucidchard](https://lucid.app/) to better visualize the database architecture.

![database-driagram](/readme_images/database.png) 

Back to [top](#table-of-contents)


## Ecommerce Business Model

Shiny Garage Malta operates on an e-commerce business model focused on providing premium car cleaning products to automotive enthusiasts. As an online retailer, Shiny Garage Malta sources a diverse range of high-quality cleaning solutions, polishes, and detailing equipment from trusted suppliers. Leveraging its e-commerce platform, customers can conveniently browse through an extensive catalog of products, select items tailored to their specific needs, and securely make purchases online. With a commitment to exceptional customer service and product quality, Shiny Garage Malta aims to cultivate long-term relationships with its customer base, catering to both professional detailers and hobbyists alike.

Central to the success of Shiny Garage Malta is its emphasis on user experience and convenience. Through its intuitive website interface, customers can easily navigate product categories, access detailed product information, and complete transactions seamlessly. By integrating secure payment options and efficient shipping and logistics services, Shiny Garage Malta ensures a hassle-free purchasing process for its customers, fostering trust and loyalty in the brand. As the automotive detailing industry continues to grow, Shiny Garage Malta remains dedicated to providing innovative solutions and exceptional service, solidifying its position as a leading destination for car cleaning enthusiasts in Malta and beyond.

Back to [top](#table-of-contents)




### Robots

The [robots.txt](robots.txt) file is at the root-level of this project.
Inside, I've included the default settings as follows:

```
User-agent: *
Disallow: /profiles/
Disallow: /bag/

```

### Social Media Marketing

Building a robust social network with active participation and connecting it to your business website can lead to increased sales.

A Facebook business account wich can be acessed in the [following url](https://www.facebook.com/shinygaragemalta/).
### Newsletter Marketing

## To do

In the website homepage footer there is a newsletter sign-up form, to allow users to supply their
email address if they are interested in receiving news.

![newsletter](/readme_images/newsletter.png) 

Back to [top](#table-of-contents)

## Testing

### HTML Code Validation

The W3C Markup Validation Service was used to validate the HTML of the website. All Django template tags were manually removed with the HTML code copied and inserted to the base template.
🛑🛑 TO-DO
<details>
<summary><strong>base.html</strong> </summary>

[base.html](/readme_validations/home-page-html-validation.pdf)
</details>

<details>
<summary> <strong>add-product.html</strong></summary>

![add_product.html](/readme_validations/add_product-validation.png)

</details>

<details>
<summary> <strong>product.html</strong></summary>

![product.html](/readme_validations/products_html_validation.jpg)

</details>

<details>

<summary> <strong>bag.html</strong></summary>

![bag.html](/readme_validations/bag-html-validation.pdf)

</details>


### CSS Code Validation
CSS file validation results generated with W3C Validation Service

<details>
<summary> <strong>base.css</strong></summary>

![base-css ](/readme_validations/base-css-valisation.pdf)

</details>

### Lighthouse performance Validation
Lighthouse validation generated with chrome lighthouse performance

<details>
<summary> <strong>Lighthouse</strong></summary>

![Lighthouse ](/readme_validations/shinygaragemalta_Lighthouse.pdf)

</details>

### Manual testing

| Test Label | Test Action | Expected Outcome | Test Outcome |
| --- | --- | --- | --- |
| Site loading | Navigate to the “Homepage”, “Login”, “Register”, “Add a product”, “Logout” and “All Products”. | All the pages and elements are loaded according. | PASS  |
| Add a product in the bag | On the product detail page, click the "Add to bag" button”. | The product is added to the bag and can be found in the bag page. | PASS |
| Checkout | On the checkout page, fill the form with user details, delivery details and the Stripe Test Credit info. | The checkout in done, a order confirmation page is displayed and a email confirmation is sent. | PASS |
| Add a product | On the navbar, click the “Product Management” option, fill out the form and hit the “Submit” button. | A success message must be displayed and the product must be listed on the “All Products” page. | PASS |
| Edit a product | On the products page, click the “Edit” button, change some info on the form and hit the “Submit” button. | A success message must be displayed and the product info must be updated. | PASS |
| Delete a Product | On the products page, click the “Delete”. | The product must be deleted. | PASS |

#### How to use Stripe test card
When testing interactively, use a card number, such as 4242 4242 4242 4242. Enter the card number in the Dashboard or in any payment form.

- Use a valid future date, such as 12/34.
- Use any three-digit CVC (four digits for American Express cards).
- Use any value you like for other form fields.
See more on [Stripe site](https://stripe.com/docs/testing#testing-interactively)
![Stripe Test Card](/readme_validations/Stripe_test.jpg)


### Automatic test: form filling and purchace sucseffully 

Automation testing from selenium and run using pytest
![Automation Testing ](/automation_testing/test_autopurchasetest.py)

Back to [top](#table-of-contents)

## Configuration and Deployment

The live deployed application can be found deployed on https://shinygaragemalta-594b33247f63.herokuapp.com/

### ElephantSQL Database

This project uses [ElephantSQL](https://www.elephantsql.com) for the PostgreSQL Database.

To obtain your own Postgres Database, sign-up with your GitHub account, then follow these steps:
- Click **Create New Instance** to start a new database.
- Provide a name (this is commonly the name of the project: 🛑 NAME 🛑).
- Select the **Tiny Turtle (Free)** plan.
- You can leave the **Tags** blank.
- Select the **Region** and **Data Center** closest to you.
- Once created, click on the new database name, where you can view the database URL and Password.


### Stripe API

This project uses [Stripe](https://stripe.com) to handle the ecommerce payments.

Once you've created a Stripe account and logged-in, follow these series of steps to get your project connected.

- From your Stripe dashboard, click to expand the "Get your test API keys".
- You'll have two keys here:
	- `STRIPE_PUBLIC_KEY` = Publishable Key (starts with **pk**)
	- `STRIPE_SECRET_KEY` = Secret Key (starts with **sk**)

As a backup, in case users prematurely close the purchase-order page during payment, we can include Stripe Webhooks.

- From your Stripe dashboard, click **Developers**, and select **Webhooks**.
- From there, click **Add Endpoint**.
	- Add your deployed site link.
- Click **receive all events**.
- Click **Add Endpoint** to complete the process.
- You'll have a new key here:
	- `STRIPE_WH_SECRET` = Signing Secret (Wehbook) Key (starts with **wh**)

### Gmail API

This project uses [Gmail](https://mail.google.com) to handle sending emails to users for account verification and purchase order confirmations.

Once you've created a Gmail (Google) account and logged-in, follow these series of steps to get your project connected.

- Click on the **Account Settings** (cog icon) in the top-right corner of Gmail.
- Click on the **Accounts and Import** tab.
- Within the section called "Change account settings", click on the link for **Other Google Account settings**.
- From this new page, select **Security** on the left.
- Select **2-Step Verification** to turn it on. (verify your password and account)
- Once verified, select **Turn On** for 2FA.
- Navigate back to the **Security** page, and you'll see a new option called **App passwords**.
- This might prompt you once again to confirm your password and account.
- Select **Mail** for the app type.
- Select **Other (Custom name)** for the device type.
	- Any custom name, such as "Django" or guitar-store
- You'll be provided with a 16-character password (API key).
	- Save this somewhere locally, as you cannot access this key again later!
	- `EMAIL_HOST_PASS` = user's 16-character API key
	- `EMAIL_HOST_USER` = user's own personal Gmail email address

### Heroku Deployment

This project uses [Heroku](https://www.heroku.com), a platform as a service (PaaS) that enables developers to build, run, and operate applications entirely in the cloud.

Deployment steps are as follows, after account setup:

- Select **New** in the top-right corner of your Heroku Dashboard, and select **Create new app** from the dropdown menu.
- Your app name must be unique, and then choose a region closest to you (EU or USA), and finally, select **Create App**.
- From the new app **Settings**, click **Reveal Config Vars**, and set your environment variables.

| Key | Value |
| --- | --- |
| `AWS_ACCESS_KEY_ID` | user's own value |
| `AWS_SECRET_ACCESS_KEY` | user's own value |
| `DATABASE_URL` | user's own value |
| `EMAIL_HOST_PASS` | user's own value |
| `EMAIL_HOST_USER` | user's own value |
| `SECRET_KEY` | user's own value |
| `STRIPE_PUBLIC_KEY` | user's own value |
| `STRIPE_SECRET_KEY` | user's own value |
| `STRIPE_WH_SECRET` | user's own value |


Heroku needs two additional files in order to deploy properly.
- requirements.txt
- Procfile

You can install this project's **requirements** (where applicable) using:
- `pip3 install -r requirements.txt`

If you have your own packages that have been installed, then the requirements file needs updated using:
- `pip3 freeze --local > requirements.txt`

The **Procfile** can be created with the following command:
- `echo web: gunicorn app_name.wsgi > Procfile`
- *replace **app_name** with the name of your primary Django app name; the folder where settings.py is located*

For Heroku deployment, follow these steps to connect your own GitHub repository to the newly created app:

Either:
- Select **Automatic Deployment** from the Heroku app.

Or:
- In the Terminal/CLI, connect to Heroku using this command: `heroku login -i`
- Set the remote for Heroku: `heroku git:remote -a app_name` (replace *app_name* with your app name)
- After performing the standard Git `add`, `commit`, and `push` to GitHub, you can now type:
	- `git push heroku main`

The project should now be connected and deployed to Heroku!

### Local Deployment

This project can be cloned or forked in order to make a local copy on your own system.

For either method, you will need to install any applicable packages found within the *requirements.txt* file.
- `pip3 install -r requirements.txt`.

#### Cloning

You can clone the repository by following these steps:

1. Go to the [GitHub repository](https://github.com/GDV373/PP5_Shiny_Garage_Malta-) 
2. Locate the Code button above the list of files and click it 
3. Select if you prefer to clone using HTTPS, SSH, or GitHub CLI and click the copy button to copy the URL to your clipboard
4. Open Git Bash or Terminal
5. Change the current working directory to the one where you want the cloned directory
6. In your IDE Terminal, type the following command to clone my repository:
	- `git clone https://github.com/GDV373/PP5_Shiny_Garage_Malta-`
7. Press Enter to create your local clone.

Alternatively, if using Gitpod, you can click below to create your own workspace using this repository.

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)]()

Please note that in order to directly open the project in Gitpod, you need to have the browser extension installed.
A tutorial on how to do that can be found [here](https://www.gitpod.io/docs/configure/user-settings/browser-extension).

#### Forking

By forking the GitHub Repository, we make a copy of the original repository on our GitHub account to view and/or make changes without affecting the original owner's repository.
You can fork this repository by using the following steps:

1. Log in to GitHub and locate the [GitHub Repository](https://github.com/GDV373/PP5_Shiny_Garage_Malta-)
2. At the top of the Repository (not top of page) just above the "Settings" Button on the menu, locate the "Fork" Button.
3. Once clicked, you should now have a copy of the original repository in your own GitHub account!

Back to [top](#table-of-contents)

## Technologies Used
### Programming Languages

- [Python](https://www.python.org) used as the back-end programming language.
- [JavaScript](https://www.javascript.com) used for user interaction on the site.
- [CSS](https://en.wikipedia.org/wiki/CSS) used for the main site design and layout.
- [HTML](https://en.wikipedia.org/wiki/HTML) used for the main site content.

### Hosting and Database
- [AWS](https://aws.amazon.com/) used for online static file storage.- 
- [GitHub](https://github.com) used for secure online code storage.

### Frameworks and Libraries
- [Django](https://www.djangoproject.com) used as the Python framework for the site.
- [Bootstrap 4](https://getbootstrap.com) used as the front-end CSS framework for modern responsiveness and pre-built components.
- [PostgreSQL](https://www.postgresql.org) used as the relational database management.
- [ElephantSQL](https://www.elephantsql.com) used as the Postgres database.
- [Heroku](https://www.heroku.com) used for hosting the deployed back-end site.

### Tools and Web Applications
- [Stripe](https://stripe.com) used for online secure payments of ecommerce products/services.
- [Git](https://git-scm.com) used for version control. (`git add`, `git commit`, `git push`)
- [Paint](): used for creating wireframes.
- [Gitpod](https://gitpod.io) used as a cloud-based IDE for development.
- [Lucidchart](https://www.lucidchart.com/) used to design the database diagram.

### Code Validation
- [Esprima](https://esprima.org/demo/validate.html): used for Javascript code validation.
- [PEP8](https://peps.python.org/pep-0008/): used for Python code validation.
- [Lighthouse](https://developer.chrome.com/docs/devtools/) Testing site performance on desktop and mobile devices.
- [W3C HTML](https://validator.w3.org/): used for HTML code validation.
- [W3C CSS](https://jigsaw.w3.org/css-validator/): used for CSS code validation.

Back to [top](#table-of-contents)

## Credits

### Content

- All the producrt  images were taken from google and shiny garage malta 


### Acknowledgements

- I would like to thank my wife for all the things she had to take care without me till I got this project done, and the slack comunity that helped me out when 
I got lost or could not understand what went sideways. 

Back to [top](#table-of-contents)