# Git Splitter

handling Monolithic repository with multi read-only splits made easy.

**This project is still under development ...**

## What is that ?

This is a tool to solve the complexity of managing a **Monolithic Repository** while providing read-only multi repositories for its components.

[Click here to understand the issue](http://stackoverflow.com/questions/42023597/best-way-to-handle-dependencies-between-components-of-a-php-framework-using-git)

[Click here to see how Symfony solved that issue](https://www.youtube.com/watch?v=4w3-f6Xhvu8)

I liked the solution made by Symfony but it's not open source; there is only [a lite version](https://github.com/splitsh/lite) available.

That's why I decided to make this simple tool to solve the same issue using a totaly different approch.

## How does it work ?

Let's say we have the following directories structure:

    framework/
      components/
        A/
          src/
          tests/
          composer.json
        B/
          src/
          tests/
          composer.json
      tests/
      composer.json

`framework` is the main repository. We want to have separate repositories for `components/A` and `components/B`  because they can be used standalone.

The aim is to (somehow) work naturally on the `framework` repository and get changes reflected automatically in the `component/A` and `component/B` repositories. Examples:

When I type: `git add .`

What should be run is:

    git add .
    cd component/A
    git add .
    cd ../B
    git add .
    cd ../..

When I type:

    git add component/A/foo
    git commit -m "foo added inside A"

What should be run is:

    git add component/A/foo
    git commit -m "foo added inside A"
    cd component/A
    git add ./foo
    git commit -m "foo added inside A"
    cd ../..

This means that `component/A` and `component/B` are also Git repositories and have their own staging area, commits, branches, tags, ... The goal is to keep their state synchronized with the `framework` state at any moment; while just typping normal git commands on that last one.

So instead of running the commands on `git` directly, we need to run them on a new script which will generate the real git commands and run them behind the scenes. But since we will not be able to handle all git commands; that script will forward any unmanaged command to `git`.

## Todo List

... (under construction)

