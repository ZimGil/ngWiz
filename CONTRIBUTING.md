# Contributing to ng-wiz

We would love for you to contribute to ng-wiz and help make it even better than it is
today! As a contributor, here are the guidelines we would like you to follow:

 - [Code of Conduct](#coc)
 - [Question or Problem?](#question)
 - [How to develop ng-wiz](#development)
   - [Run `ng-wiz` locally](#run-locally)
   - [Run `ng-wiz` globally](#run-globally)
 - [Running unit tests](#unit-tests)
 - [Running end-to-end tests](#ee-tests)

## <a name="coc"></a> Code of Conduct
Help us keep ng-wiz open and inclusive. Please read and follow our [Code of Conduct][coc].

## <a name="question"></a> Got a Question or Problem?

You can open a GitHub issues for bug reports, feature requests, and missing documentation.

## <a name="development"></a> How to develop `ng-wiz`

In order to run `ng-wiz` in development mode, clone the repository locally with
```
git clone https://github.com/ZimGil/ngWiz.git
```

go into the newly created folder and install all dependencies 
```
cd ng-wiz
npm install
```

### <a name="run-locally"></a> Run `ng-wiz` locally
This will run `ng-wiz` in developer mode with
`ng-wiz`'s folder as root
```
npm start
```

### <a name="run-globally"></a> Run `ng-wiz` globally
If you want to test ng-wiz as if it was installed globally, run
```
npm link
```
This will create a semantic link to the repo's folder. You can run `ng-wiz` in your command line
from anywhere. Any changes will take effect after a restart.

## <a name="unit-tests"></a> Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## <a name="ee-tests"></a> Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
