## My Favorite Restaurant
### Google Maps API, Zomato API, KnockoutJS, MVVM, AJAX

#### Aim
Build a single page app to show all my favorite restaurant in Auckland NZ 
1. Use Google Maps API and Zomato API to show all the restaurants markers, click each marker will show the street View, rating and average cost.
2. Use KnockoutJS, MVVM to organize code, binding cuisines/area filter and place chosing click.
3. Well responsive design to fit different devices (Mobile, Pad, Laptop, etc.)

### What Have Been Done

![App Interface](https://ivyfu77.github.io/my_favorite_restaurant/screenshots/Interface.png)

#### Part 1: Optimize index.html (PageSpeed Insights)

1. Compress the image size of pizzeria.jpg (From 2.3M to 4K) 
2. Avoid using online fonts
3. Add 'media="print"' for loading print.css
4. Add 'async' prop for loading analytics.js
5. Pick some style defines out as inner css, move loading style.css to the bottom of the page


#### Part 2: Optimize pizza.html (FPS)
1. Delete unnecessary and expensive 'moving pizzas' background when scroll the screen, change to fixed position background
2. Optimize pizza resize control, avoid use Layout before reset style in a loop.
3. Compress the top image's size (From 2.4M to 139K)


### How to Check

#### Part 1: Optimize index.html (PageSpeed Insights)

1. Open [PageSpeed Insights](https://developers.google.com/speed/pagespeed/insights/) 
2. Paste the [Link](https://ivyfu77.github.io/p6-website-optimization/), click 'Analyze' to check the optimizing result.

#### Part 2: Optimize pizza.html (FPS)
1. Open the live [Link](https://ivyfu77.github.io/p6-website-optimization/views/pizza.html)
2. Use DevTools to check the FPS when scroll the screen, change the size setting.
