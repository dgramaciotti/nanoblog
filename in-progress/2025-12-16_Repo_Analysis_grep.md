---
title: "Repo Analysis: grep"
date: "16/12/2025"
author: "Daniel Guedes"
description: "Diving into the legendary grep tool source code from the official GNU repository."
---

Let's dive into the legendary [grep](https://en.wikipedia.org/wiki/Grep) tool source code, on the official [GNU](https://www.gnu.org/software/grep/) source.

---

## Index

1. Finding the code
2. Fetching the libs
2. Overall view
2. C basics
3. Main function
4. Sidecalls
5. Main logic

---

## 1 - FInding the code

Grep is not part of the coreutils for linux. Instead it is a software part by itself, on [savanah](https://savannah.gnu.org/git/?group=grep). Cloning goes through:

```sh
git clone https://git.savannah.gnu.org/git/grep.git
```

## 2 - Fetching the libs

Reading a bit around the repo README files, we can see the readme-hacking. The libs are not fetched along with the rest of the repo, being instead sub modules.