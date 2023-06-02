# Angular Custom Directives Project

This project demonstrates the usage of custom directives in an Angular application. Custom directives allow you to extend the functionality of HTML elements and create reusable components with custom behavior.

## Prerequisites

Before getting started, make sure you have the following installed:
1. Clone the repository or download the project files.
2. Open a terminal or command prompt and navigate to the project directory.
3. Install the project dependencies by running the following command:
   <br>`npm install`
4. Once the dependencies are installed, start the development server using the following command:
   <br>`ng serve`
5. Open a web browser and navigate to http://localhost:4200 to view the application.

## Usage
To use a custom directive in your Angular application, follow these steps:
1. Import the directive into your component by adding the following import statement:
   <br>`import { DirectiveNameDirective } from 'path/to/directive';`
2. Add the directive to the directives array in your component's metadata:
   <br>`@Component({`
   <br>`  selector: 'app-your-component',`
   <br>`  templateUrl: './your-component.component.html',`
   <br>`  styleUrls: ['./your-component.component.css'],`
   <br>`  directives: [DirectiveNameDirective]`
   <br>`})`
3. Use the directive in your component's template:
   <br>`<div appDirectiveName></div>`
4. Replace DirectiveName with the name of the custom directive you want to use.   
