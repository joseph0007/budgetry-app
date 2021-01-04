//the funda of getters and setters ---> on the global scope we cannot access the variable object of a function but
//an inner function can definitely access the variable object of the outer function so we can use the inner function to change the values
//of the variable object of the outer function!!!!
var outer = (function(){
    var a = 3;
    (inner = function(){
        console.log('inner');
    });
    return {
        publicAccess: function(){
            return a;
        }
    }
})();
//console.log(a);   //undefined
var b = outer.publicAccess();   //i get the value of outer function's 'a'
console.log(b);
inner();     //inner is accessible because it got declared in the global scope even though it is written in the outer function
             //because if we dont declare any variable, function, etc with either var,let,const then the compiler just declares it in the global scope!!  

//function expression
var functExp = function(){
    console.log('function expression');
};
functExp();

//IIFE without name (anonymous function)
(function(){
    console.log('IIFE');
})();

//IIFE with name
(withName = function(){
    console.log('IIFE with name');
});
withName();

// ^
// |
// same as
// |
// v

var withName = (function(){
    console.log('IIFE with name');
});
withName();


//DO NOT CONFUSE THIS WITH FUNCTION EXPRESSION because the below is just storing the value returned by the anonymous function
//i know it looks similar to function expression but its not
var notExp = (function(){
    return {
        disp: function(){
            console.log('not a function expression');
        }
    }  
})();
//notExp.disp();

//when we pass a function as arguement to the addEventListener function the first parameter of the callback function becomes the event object!!!
//the addEventListener function passes the event object as the first arguement to the callback function 
var count = 0;
function key(e){
    if(e.keyCode === 13){
        count++;
        //console.log('enter' + count);
    }
};

document.addEventListener('keypress', key);

//think of controller function as cooking food where suppose all the garam masalas is a module and all vegetables is a module and 
//all oils is a module and the controller module borrows red chiili and salt(part of garam masala module), borrows green chilli
//and onions from vegetable modules and coconut oil from oils module and mix it all together to make a dish!!!


//DIFFERENT WAYS TO ACCESS PROPERTIES OF AN OBJECT
//there are 3---> 
var data = {
    allItems: {
        exp: ['hello'],
        inc: []
    }
};

//1.Using the dot(.) operator
//Choose the dot property accessor when the property name is known ahead of time.
console.log(data.allItems.exp[0]);

//2.Square brackets property accessor
//Choose the square brackets property accessor when the property name is dynamic, i.e. determined at runtime.
var type = 'exp';
var arrValue = data.allItems[type][0];
console.log(arrValue);
//which just means that 
arrValue = data['allItems']['exp'][0];
console.log(arrValue);

//3.Object destructuring
//Choose the object destructuring when you’d like to create a variable having the property value.
var {exp} = data.allItems;
console.log(exp[0]);

//Alias variable
//If you’d like to access the property, but create a variable name different than the property name, you could use aliasing.
var {exp : newArr} = data.allItems;
console.log(newArr[0]);

//Dynamic property name
var {[type] : newArr_1} = data.allItems;
console.log(newArr_1[0]);


//event bubbling and event capturing --->
//when we have multiple events on top of one another i.e. when if a parent div has an event but so does its child div then what happens 
//is that the browser has to decide whose event to execute first or whose event needs to be loaded into the event queue first
//there are two ways ---->1.Event capturing(top to bottom)  2.Event bubbling(bottom to top)
//that means in case of bubbling the browser will load the child event before the parent event and visa versa in case of event capturing
//by default the event bubblung is selected by all the modern browsers but you could set the userCapture parameter to true in the
//addEventListener method to enable event capturing
document.addEventListener('keypress', key, true);