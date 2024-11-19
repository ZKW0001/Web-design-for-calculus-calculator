# Web Calculator project
The aim of this project is to create a website for numerical and calculus computations. For convenience, the server uses a locally deployed Express framework. However, it is also possible to make the website accessible on the public internet. This would require renting a cloud server as well as purchasing a domain.  

## Web demo 1 - Interface
- There are two dispalys on the calculator. The top display is for input, allowing users to enter expressions either via the keyboard or by clicking the on-screen buttons. And the second display shows the results, rendered dynamically in LaTeX for clear formatting.
<br>
<br>
        
![](https://github.com/ZKW0001/WebCalculator_Project/blob/main/demo/options%26language.gif)
- The website is designed to include a drop-down **Options** menu, allowing users to switch between calculating derivatives and integrals.  
- After clicking the **Language button**, all instructions on the website will switch to the corresponding language, without refreshing the page. In this case, selecting CN will change the language to Chinese.   
      
<br>
<br>
       
![](https://github.com/ZKW0001/WebCalculator_Project/blob/main/demo/darkmode.gif)
- Clicking the **Color** button toggles the webpage between dark mode and light mode. A short animation is included during the transition.  
     
<br>
<br>

## Web demo 2 - Numerical computation
![](https://github.com/ZKW0001/WebCalculator_Project/blob/main/demo/numerical1.gif)
![](https://github.com/ZKW0001/WebCalculator_Project/blob/main/demo/numerical2.gif)
- The calculator is capable of solving a wide range of numerical problems, from basic arithmetic operations (**addition, subtraction, multiplication, division**) to more advanced functions like **trigonometric functions, logarithms, exponentials, square roots, and absolute values**. All calculations are performed on the front-end using **Math.js**, and the results are displayed in LaTeX format with the help of the **KaTeX** library. If the calculator is unable to perform a calculation, **"Error"** will be displayed on the output screen.  
<br>
<br>
      
## Web demo 3 - Solving Derivatives
![](https://github.com/ZKW0001/WebCalculator_Project/blob/main/demo/derivative1.gif)
![](https://github.com/ZKW0001/WebCalculator_Project/blob/main/demo/derivative2.gif)
- If the **derivative symbol** is detected, the calculation will be transferred to the back-end on **port 8001**. The back-end server will then compute the results with the help of **Nerdamer** library and send them back to the front-end.  
<br>
<br>     
## Web demo 4 - Solving Integrals
![](https://github.com/ZKW0001/WebCalculator_Project/blob/main/demo/integral.gif)
- Similarly, if the **Integral symbol** is detected, the calculation will be processed on the back-end, and the results will be sent back to the front-end over the same port.
