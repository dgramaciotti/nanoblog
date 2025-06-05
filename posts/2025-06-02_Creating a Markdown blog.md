# Creating a markdown blog

Well, after many years using [medium](https://medium.com/@dgramaciotti) I've decided it was time to take matters into my own hands, and create a blog.

## Overview

I want to do the following with my blog:

1. Have complete control over the content in each post.
2. Customize the theme as much as I want
3. No costs with hosting
4. Easy to use, integrates with markdown
5. No overcomplications around engine or design. Create a markdown file, push and be done
6. Git can be used to publish and manage the content

With that, I thought of the following way to do it

- use typescript for scripting tasks such as *building* and *publishing*.
- [gh-pages](https://pages.github.com/) for hosting and [gh-actions](https://github.com/features/actions) to automate the build.
- [ejs](https://ejs.co/) for some basic templating utilities
- That's it!

The final result has less than 20 base files, with only a few hundred lines of code. Perhaps I could have used jekyll, or some other engine, but given the effort this seems simple enough. Also, probably styling will be gradually implemented, let's see how it goes...