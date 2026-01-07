---
title: "Programming for non programmers"
date: "20/12/2025"
author: "Daniel Guedes"
description: "A comprehensive guide explaining programming concepts to non-technical people, covering web development, platforms, and practices."
---

Throughout the years working as a developer, it's common to come across situations where you have to explain or exchange ideas with people that are not versed in the technical details. Not anything new, I think the nature of the work benefits teams where there's diversity of backgrounds, as this leads to a more open and diverse exchange of ideas. Still, mutual understanding is a problem, an understandable tradeoff. You can probably relate to the following:

- How long will it take to do this project? Can we do it in a couple of weeks?
- It's just a one-line change right?
- I have just built this prototype with AI, can we just move it to prod?

(And for annoying developers)

- What do we even need POs, designers, QAs, etc? Developers can do everything
- Just do xyz and you should be good to go (some cryptic proccess)
- What's the difference between 8px and 12px anyway?

I don't have the solutions to these problems, and I suppose when communication is crystal clear we'll have world peace, or something like that. So anyways, I thought to write this article with some explanations on the obscure things we do as developers. Help as a reference you can use to have a different perspective on things.

Note: This article is not meant to be read on one go, but instead as a reference. Pick your topic and go through, there's a lot of things. Enjoy.

## Index

1. The basics
    1. The work
    2. Where code runs
    3. Web
2. Web development
    1. Frontend
    2. Backend
    3. Databases
    4. Infrastructure
3. Practices
    1. The core
    2. Storing code (GIT)
    3. Deploying code (CI/CD)
4. Miscelanea
    1. AI
    2. Apps, web, phones, etc
    3. Languages
    4. JSON
    5. Calling APIs
    6. HTML, CSS
    7. Console
    8. Javascript
6. Examples
    1. The building analogy
    2. A house
    3. A 3 store house
    4. A motorhome
    5. A skyscraper
    6. A city block
    7. A city

## 1 - The basics

Programming is the craft in which you write instructions (code) and the computer executes those instructions. In theory, it's a precise craft. You tell the computer to sum 2 and 2, and store it somewhere, you can do this 1000 times and have the same result. In practice sometimes the computer crash, is not available or even [cosmic rays](https://www.bbc.com/future/article/20221011-how-space-weather-causes-computer-errors) could cause a failure. Even more so, although the program can be deterministic, developers do not, and cannot consider all possible solutions for a lot of the real world complex problems. Most of the time, I think you make either a *pen* or a *pencil*, and take the tradeoffs of not being able to erase things.

Programmers, or developers, write instructions in *programming languages*, which are formal languages where the syntax, structure and organization is precise. Think of a cake recipe where you can write it in a specific way.

- You can only have lists, like this one
- the list begins with a quantity or a instruction
- Each line must end with ";"
- Quantity has the format: <number> <teaspon, cup, ounce> <sugar,salt,rice>
- Instructions has the format: <add, stir, remove, heat> <sugar,salt,rice,mixture>

Sounds a bit limited? This example is a bit poor, but it's somewhat like this. Under the basic operations of programming languages you have addition, subtraction, saving data and retrieving data. That's it, with that you have everything from button displays to complex games. All thanks to the transistor, and the binary abstraction. It's possible because things are composable. Very simple programs may have a few hundred instructions, but as complexity rises, developers use work that has been done before, under the guise of *modules*, *functions*, *libraries*, etc. Think of building a house. If you need steel for the frame, you wont go mine it, refine, smelt , etc. You just buy the bar. Same in programming. A software like a web browser has millions of lines of code and takes many years to be done, and even those use a lot of basis from the operating system, security libraries, etc.

Keep in mind this composability, for **every** single piece of software uses that. Painting screens, games, servers, browsers, AI, databases, etc. For true "behemoth" codebases, like the linux operating system, from a quick google search has 40 million lines of code. Not sure that's the real number, but let's say it's on that order of magnitude. Considering an average book has 40 lines per page, that would be equal to a book with 1 million pages. 

### 1.1 - The work

Okay, so programmers write instructions in these programming languages, which are highly composable. You have old, difficult, new languages. Some languages are designed to be better at computer speed, more precise and verbose. Others better at developer speed, are easier to use but slower. Developer work envolves a lot of typing and complex existing systems to support. 

Typing and understanding these systems can be quite complex. So there are a ton of tools other programmers have made to make programming work easier.

- IDEs
- Debuggers
- Command line tools

### 1.2 - Where code runs

Developers write code, and this code is ran by a computer. But the "type" of computer matter, from the stand of capabilities. A computer is not only your desktop PC, but anything with a processing unit in this context, so anything from a tiny IOT chip to university super computers. The platform matters when writing the code.

These days, with a lot of code you have some common overlaps, and developers can mostly write just one code and run it in a lot of places with minimal adaptation, but it's not always the case. Take for example Java, it's one of the biggest languages around, and one of it's core features is precisely that it's easier to run it anywhere, through the JVM. If you installed some Java games many years ago, you had to have the JVM, but that was it.

Taking the analogy to the civil engineering side, think of framed houses or pre-built. You can mostly use things, and sometimes you may adapt some plumbing, plugs, etc. Still there will be differences, and the more complex and close to some key aspects of the construction, the more differences you'll have. Can't really have some modern architecture house, or a *dome* with pre-builts. No pre built dome, you have to design and buy the correct steel structure to support it. Calculate, plan. For example, if you wan't to have some bluetooth capabilities, you can't really use a web page, running in a browser, it's not well supported. Perhaps both will change one day.

This is the idea of **platforms**. For smaller devices, like IOT devices, you still have code running. But there's no operating systems, or structure is much lighter. So things are less standardized, some things can be harder to do. In a tent you don't have outlet plugs, you'll have to buy some wire and do the connection yourself.

If we go to a job standpoint, usually development work is segmented by **platform**. You have web developers, operating system developers, embedded developers, mobile developers. Of course it's not a clear line, as the line shifts quickly (the web is not what it was 20 years ago) but I think it helps to have some overall vision. Also, things will narrow down as you go through the rabbit role. So for the web area, we have something like:

1. Web developers
    1. Frontend developers
        2. React developers
            3. Specialized in x tool - threejs, graphql, etc

### 1.3 - Web

Since I'm (mostly) a *web developer*, I'll focus on this side of things. These days it's hard to find something that's not involved with the internet. The internet is just a standardized system that connects computers. 

## 2 - Web development

Web development is the area in which code is developed for the web platform. Mostly code that interacts with **browsers**, directly or indirectly. Browsers are big software pieces that abstract the interaction of the internet for the user. you just type google.com, and there you have a pretty screen. Behind the scenes a lot of things happen. The pretty things on the screen is the work of frontend developers, while things that happen behind the scene the role varies.

The basis of the web is the interaction between computers. When the user types google.com, a *request* is send through the ISP and some complex infrastructure until it reaches some google computer, which will read and spit back an HTML file, which was saved on some other computer.

### 2.1 - Frontend

Just as with civil engineering you have area divisions, for example painting, eletrical plants, etc. In the web development area you have the same. The frontend is one of these areas, and is everything that is ran on the browser.On your browser. Developers that work with frontend will directly or indirectly work with HTML, CSS and JS which are languages tied to the browser platform. These days every single browser will work these three languages.

HTML is a markup language used to show things in a web page. Every single web page you view has a root HTML, which may load other things, such as more data, HTML, JS, CSS, etc. Think of it like a word document, where you may have bold text, headers, images, etc. But more complex. And a lot of thing is done by hand by developers.

CSS is a language used for styling HTML. You may make some text red, expand an image, add borders, add animations. It's the language that gives styles. Everything would work without it, but would be ugly.

JS is the language that's directly tied to code. It's used to tell the computer to do some things, react to interactions. What happens when you click a button? The programmer will write some JS which the browser will run.

### 2.2 - Backend

Moving forward with the divisions, web development also has the **backend**. Think of the backend as some centralizing unit, or somewhere else where code runs. Why do we even need this? Couldn't you run everything on the browser? Some problems arive:

- What if I want to access this in multiple devices? You need a central place which will organize everything, otherwise you would have different data in each device
- What if I want to see some world maps? Again you need a centralized unit. These maps can be heavy, can't store everything on your computer. Also the map owners don't want to risk you getting the data and ditching the service
- What if I want to do some AI work? The operation is very difficult, your computer can't run it. But a bigger one can, and just send you some information

These are some examples, and there are more. For example with this page, or any page. To view the page you had to "request" and get some HTML from somewhere. This somewhere is another computer, a "server". At least in the most simple example, as situations get more complex you may have multiple machines orchestrating some "service".

Developers that work with backend are writing code, but the platforms are different. While frontend developers write for the browser, backend developers write some code that runs on an operating system, or some abstraction. Usually is some code that runs on **linux**, or something that's quite like linux, where you can say it doesn't really matter.

### 2.3 - Databases

In the last section, I spoke about some problems with centralization. Dealing with data, and data where multiple programs want to interact with it at the same time is quite nasty. In fact it's a programming sub-area by itself. **Databases** exist to solve these and others problems. Most of the time it's the backend developers work to interact with these databases, and you may have specialized people in particularly complex systems just to deal with these.

Think of a building cooling system. In my house it's just a fan. In the burj kalifa there's probably 3 engineers, and lots of personnel responsible for building and maintaining it.

Overall, for most real world applications, data tends to be the core of everything. It's very hard to find an application that doesn't extensively work with data. For example calculators.

### 2.4 - Infrastructure

Now join everything, and you'll may have some complex code to deal with. As structures grow, you need ways to organize things. You will have multiple pieces of code running in multiple platforms. This is the infrastructure. A complex web application will be comprised of multiple pieces of code:

- Backend, with often multiple pieces of code running in different computers; *services*
- Frontend, multiple pieces of HTML, one for each service page. Often organized and served by multiple backend services
- Databases, in simple services a centralized one, but also could be multiple

And beyond these simple divisions, also multiple auxiliary things in between. A service just to centralize where all this code is (git), a service for making things easier to manage services (zookeeper), etc. Again, with the building analogy, you'll end up with a fuse box, camera system, housing of machines, etc. As the end-user, you just live in the house, plug some things in the outlet, check the cameras, turn a faucet. Behind the scenes complex things happen in each interaction.

## 3 - Practices

I have spoken a little bit about these before, but I want to give a bit more of insight. Why do we do things the way we do? Mostly because of inertia, said practices. Dividing between databases, frontend, backend is not a rule of physics, something inevitable. You could build and have things work in a different way.

For example, when you need some HTML that changes a lot between pages, you may have a situation where you want to dynamically build those with code. Then the line between backend and frontend is not that well divided. You could store some data, like expensive operations directly on the backend server, then you have some memory cache, no need for a database. If it's just you living in a place, why build a skyscraper, a small house will do.

Also, you could build some software that gets information from the internet, and render everything with some different language, like english. Would be a new browser. But who would adopt it? What would be the problems involved? Why we build rectangles, instead of pyramids?

The point is that the more distant from the basis origin, the more specific things will be. Writing some code for an IOT chip to control a vending machine, will probably look like, and have a lot of addition, subtraction, memory allocation, basic operations abstracted to read and correctly give the user their beverage. Writing some web page is very far from these basics. So how things are done is almost a "culture". Everybody eats, but in each country people may eat very differently.

## 3.1 - The core

So across how we do things, we have some standards. Currently, across different platforms the to store code is through git, which is a version controller. Think of writing a book, a very big one. Actually multiple books. You need some way of tracking who did what, when, where. Git helps with that

Now, you also need to control where it runs, what version is coming through, how you can do "revisions", how to make sure things are coming through as you want them. All of these have given rise to this idea of CI/CD, which is basically streamlining launching code. 

## 4 - Miscelanea

All the previous sessions have spoken about things that are common across all programming tasks, or specific to web development. Now Ill get to specific topics and distill them.

## 4.1 - AI

Hot topic of the moment. What is AI? Truth is, since it's inception it has been a very big umbrella. The "hype" with AI in the past few years is due to LLMs and transformer based models through, which have been a breakthrough in very large scale models. But let's tune back a little.

There's two types of AI:

- Hardcoded AI
- Statistical models

Think of hardcoded as game AI. Developers will manually write all possible situations, and this behavior may seem inteligent to us. 

Statistical models are a big area by themselves. Multiple variations. LLMs for example are "equations" that takes a corpus of words and spits the next word. Or a probablity list of what are the possible next words, to be precise. Yikes.

Still, fundamentals apply of course. With hardcoded models, you can have "bugs", where a given input was not well worked by the developer in the code, and will cause some unpredicted behavior. With LLMs, since it's a probabilistic model, you don't have high precision, and accuracy tends to lack in some areas as well. Also other implications:

- If you rephrase words a bit, you'll have a different output. Things also tend to accumulate as the *context*, or previous words grow. Probabilities join up, you end in a totally different place.
- If a certain topic was not well presented in the original training set, the tendency is that the LLM hability with that topic will be much lower, since the "equation" doesn't account for that. Same idea with new or out of the average content.
- Outputs will match in general the "average" of the training data. Data density will overthrow other things.
- No heuristical paths. To put it simply, no planning. The AI may be injected with more context to try and bias probablity to a certain direction, but it can't specifically plan. For example, try to make it generate a valid dense crosswords on a given topic (something beyond the trained NYT puzzles).

I think a good reflection on AI, and the latest boom, is how well information can be encoded in certain ways, and mutate our experience. Long before LLMs where a thing, existed [Akinator]() which I think some people may think was some sort of sentient being. More like precise questions, good data, and heuristics. Hardcoded AI.

With LLMs, our language, and the order of things contains such information, that it's probablistic possible to create a model, which can with amazing accuracy generate comprehensive texts in almost every knowledge area. Language, which is virtually limitless in it's possibilities, proves to be "boring", such that joining massive corpus of data can be used to generate a given "writing style" and with some small wording changes (context) can:

- Generate code
- Generate texts
- "Reflect", "analyze"
- Give suggestions
- ... Do almost anything a human can "talk" itself to do

## 4.2 - Apps, web, etc


