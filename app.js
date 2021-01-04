//BUDGET CONTROLLER
var budgetController = (function(){
    //income function constructor
    function Income(id, description, value){
        this.id = id;
        this.description = description;
        this.value = Math.abs(value); 
    }

    //expense function constructor
    function Expense(id, description, value){
        this.id = id;
        this.description = description;
        this.value = Math.abs(value);
        this.percentage = -1;
    }

    Expense.prototype.calculatePercentage = function (incomeTotal){
        if(incomeTotal > 0){
            this.percentage = Math.round((this.value / incomeTotal) * 100);
        }else{
            this.percentage = -1;
        }
    };

    //PROTOTYPE function to get percentages
    Expense.prototype.getPercentage = function (){
        return this.percentage;
    };

    //data  structure for all the data stored
    var data = {
        allItems: {
            inc: [],
            exp: []
        },
        totals: {
            incomeTotal: 0,
            expenseTotal: 0
        },
        budget: 0,
        percentage: {
            incomePercentage: -1,
            expensePercentage: -1
        }
    }

    var calculateBudget = function (){
        data.budget = (data.totals.incomeTotal - data.totals.expenseTotal);

        if(data.totals.incomeTotal === 0){
            data.percentage.incomePercentage = -1;
            data.percentage.expensePercentage = -1;
        }else{
        data.percentage.incomePercentage = Math.round((data.budget / data.totals.incomeTotal) * 100);
        data.percentage.expensePercentage = Math.round((data.totals.expenseTotal / data.totals.incomeTotal) * 100);
        }
    }

    var calculateTotal = function (type){
        var sum = 0;
        data.allItems[type].forEach(function (item){
            sum += item.value;
        });
        if(type === 'inc'){
            data.totals.incomeTotal = sum;
        }else if(type === 'exp'){
            data.totals.expenseTotal = sum;
        }
    }

    return {
        addItem: function (type, desc, val){
            var newItem, ID;
            
            //to create a new ID for every new item added
            if(data.allItems[type].length > 0){
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            }else{
                ID = 0;
            }
            
            //to add new item/to create new item
            if(type === 'inc'){
                val = Math.abs(val);
                newItem = new Income(ID, desc, val);
            }else if(type === 'exp'){
                newItem = new Expense(ID, desc, val);
            }

            //to add the newly created item into the dataset
            data.allItems[type].push(newItem);

            //returning the newly created item
            return newItem;
        },

        //budget calculations
        //data abstraction 
        updateBudget: function (){
           //1.Calculate budget
           calculateTotal('inc');
           calculateTotal('exp');
           calculateBudget();
        },

        deleteItem: function (type, id){
            data.allItems[type].forEach(function (item, index, arr){
                if(item.id === id){
                    arr.splice(index, 1);
                }
            })
        },

        calculatePerc : function (){
            data.allItems.exp.forEach(function (item){
                item.calculatePercentage(data.totals.incomeTotal);
            });
    
            var percents = data.allItems.exp.map(function (item){
                return item.getPercentage();
            });
            
            return percents;
        },

        getBudget: function() {
            return {
                budget: data.budget,
                totalInc: data.totals.incomeTotal,
                totalExp: data.totals.expenseTotal,
                percentage: data.percentage
            };
        },

        data: function (){
            return data;
        }
    }

})();

//UI CONTROLLER
var UIController = (function (){
    
    //string values of selector
    var DOMStrings = {
        selector: '.container__add__select',
        description: '.desc',
        value: '.number--value',
        enterButton: '.enter--button',
        containerBottom: '.container__bottom'
    }

    var formatNumber = function (num){
        var numArr, intPart, decimalPart;
        num = num.toFixed(2);
        numA = num.toString();
        numArr = numA.split('.');
        intPart = numArr[0];
        decimalPart = numArr[1];

        if(intPart.length > 3 && !(intPart.length === 4 && intPart.includes('-'))){
            /*var newstr = [], initialstr;
            for(var i = 3; i < intPart.length; i+3){
                newstr.push(intPart.substr(intPart.length - i, 3));
                initialstr = intPart.split(intPart.substr(intPart.length - i, 1));   
            }
    
            for(var i = newstr.length - 1; i >= 0; i--){
                initialstr[0] = initialstr[0] + ',' + newstr[i];     
            }
    
            completestr = initialstr + decimalPart;
            return completestr; */
            intPart = intPart.substr(0, intPart.length - 3) + ',' + intPart.substr(intPart.length - 3, 3);
            return intPart + '.' + decimalPart;
            
        }else{
            return num;
        }
       
    };


    //read values function
    return {
        publicValues: function(){
            return {
                inputSelector: document.querySelector(DOMStrings.selector).value,
                inputDescription: document.querySelector(DOMStrings.description).value,
                inputValue: parseFloat(document.querySelector(DOMStrings.value).value)
            }
        },

        publicDOMStrings: function(){
            return DOMStrings;
        },

        publicInsertHtml: function (item, type){
            //function to replace the values
            var replaceString = function (str){
                //here we are passing a number(item.id) instead of string but javascript does type coersion and converts the number into String
                var newHtml = str.replace('%id%', item.id);
                newHtml = newHtml.replace('%desc%', item.description);
                newHtml = newHtml.replace('%value%', formatNumber(item.value));
                return newHtml;
            };


            if(type === 'inc'){
                var html =  '<div class="item clearfix" id="inc-%id%"><div class="item__desc">%desc%</div><div class="right clearfix"><div class="item__value">+ %value%' + 
                            '</div><div class="item__delete"><button class="btn-delete"><i class="ion-ios-close-outline"></i></button></div></div></div>';
                var element = document.getElementsByClassName('container__income__list')[0];


            }else if(type === 'exp'){
                var html =  '<div class="item clearfix" id="exp-%id%"><div class="item__desc">%desc%</div><div class="right clearfix"><div class="item__value">' + 
                            '- %value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="btn-delete"><i class="ion-ios-close-outline"></i></button></div>' + 
                            '</div></div>';
                var element = document.getElementsByClassName('container__expenses__list')[0];  
            }
            //calling the replaceString function to replace the string values
            var newHtml = replaceString(html);
            //to insert html into the html file      
            element.insertAdjacentHTML('beforeend', newHtml);
        },

        clearFields: function (){
            var fields, arrFields;
            //querySelectorAll returns a nodeList object
            fields = document.querySelectorAll(DOMStrings.description + ', ' + DOMStrings.value);

            //slice method is called on the nodelist to convert it into an array
            //even though slice method only takes array as an argument we can trick it to accept nodeList by using call() method and
            //setting the object to the nodeList object
            arrFields = Array.prototype.slice.call(fields);

            //forEach loop
            arrFields.forEach(function(element, id){
                element.value = '';
            });

            //puts the focus back on the desc input element
            arrFields[0].focus();

            return arrFields;
        },

        displayPercentage: function (itemArr){
            
            var elements = document.getElementsByClassName('item__percentage');

            //we created our own forEach loop for nodeList
            //it is useful if we want to loop over more than one nodeList
            //we could just change the callback function to our liking
            var nodeListforEach = function (list, callback){
                for(var i = 0; i < list.length; i++){
                    callback(list[i], i, list);
                }
            }

            //unlike in java when you dont provide a value for an argeument it throws an error, javascript doesnot throw an error
            //because unlike java ,javascript is a loosely typed language and hence when we dont pass any arguement 
            //it just takes undefined as the value!!!! 
            //callback function
            nodeListforEach(elements, function (item, index){
                if(itemArr[index] !== -1 && itemArr[index] < 200){
                    item.textContent = itemArr[index] + '%';
                }else if(itemArr[index] > 200){
                    item.textContent = '**'
                }else{
                   item.textContent = '--';
                }  
            });

            /*
            //my method of doing it but i would have to loop all over again if i had to traverse over another nodeList
            //instead i created a forEach function to do it everytime i have to traverse a nodeList!!!! 
            for(var i = 0; i < elements.length; i++){
                if(itemArr[i] !== -1 && itemArr[i] < 200){
                    elements[i].textContent = itemArr[i] + '%';
                }else if(itemArr[i] > 200){
                    elements[i].textContent = '**'
                }else{
                    elements[i].textContent = '--';
                }  
            }*/
        },


        displayBudget: function (data){ 
            document.getElementById('budgetDisp').textContent = formatNumber(data.budget);
            document.getElementById('incomeDisp').textContent = '+ ' + formatNumber(data.totalInc);
            document.getElementById('expenseDisp').textContent = '- ' + formatNumber(data.totalExp);
            if(data.percentage.incomePercentage > -1 && data.percentage.incomePercentage < 200){
                document.getElementById('incPer').textContent = data.percentage.incomePercentage + '%';
            }else if(data.percentage.incomePercentage > 200){
                document.getElementById('incPer').textContent = '**';
            }else{
                document.getElementById('incPer').textContent = '---';
            }
            if(data.percentage.expensePercentage > -1 && data.percentage.expensePercentage < 200){
            document.getElementById('expPer').textContent = data.percentage.expensePercentage + '%';
            }else if(data.percentage.expensePercentage > 200){
                document.getElementById('expPer').textContent = '**';
            }else{
                document.getElementById('expPer').textContent = '---';
            }

            //display percentage of individual expense element(my method where i was exposing the internal data model to manipulate data
            //which is not recommended for security purposes)
            /*var expArr = data.allItems.exp;
            if(expArr.length > -1){
                expArr.forEach(function (item){
                    var element = 'exp-' + item.id;
                    var currElement = document.getElementById(element);
                    if(data.totals.incomeTotal > 0){
                        item.percentage = Math.round((item.value / data.totals.incomeTotal) * 100);
                        currElement.getElementsByClassName('item__percentage')[0].textContent = item.percentage + '%';
                    }else{
                        currElement.getElementsByClassName('item__percentage')[0].textContent = '--';
                    }
                });
            }*/   
        },

        displayMonth: function (){
            var month, months, date, year;
            date = new Date;
            month = Date.prototype.getMonth.call(date);

            year = date.getFullYear();
            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

            document.querySelector('.budget__title--month').textContent = months[month] + ' ' + year;

        },

        removeElement: function (ele){
            var element = document.getElementById(ele);
            element.parentNode.removeChild(element);
        },

        changeStyle: function (){
            var element;
            element = document.querySelectorAll(DOMStrings.selector + ',' + DOMStrings.value + ',' + DOMStrings.description);
            for(var i = 0; i < element.length; i++){
                element[i].classList.toggle('red__outline');
            }
            document.querySelector(DOMStrings.enterButton).classList.toggle('red');
        }
    }
})();


//the reason why we pass the budgetController and UIController as arguments even though they are in the global scope is
//because it is better to do it in this way as you will not have to change the names everywhere incase youll change the name of the module
//youll just have to change the arguement and that will do it!!!! 

//GLOBAL USER CONTROLLER (API)
var controller = (function (bdgtCtrl,UICtrl){

    var data = bdgtCtrl.getBudget();

    function setupEventHandlers(){
        var DOM = UICtrl.publicDOMStrings();
        document.querySelector(DOM.enterButton).addEventListener('click', ctrlAddItem);

        document.querySelector(DOM.containerBottom).addEventListener('click', ctrlDeleteItem);

        document.addEventListener('keypress', function (event){
            if(event.keyCode === 13){
                ctrlAddItem();
            }
        });

        document.querySelector(DOM.selector).addEventListener('change', UICtrl.changeStyle);
    }

    //budget calculation function
    var calBudget = function (){
        //1.calculate the budget
        bdgtCtrl.updateBudget();
        
        //2.display the budget
        data = bdgtCtrl.getBudget();
        UICtrl.displayBudget(data);
    }

    //function to carry out the to-do list
    function ctrlAddItem(){
        var input, newItem;

        //1.read the values
        input = UICtrl.publicValues();

        //an if block to only execute the function if the user has input values into the fields
        if(input.inputDescription != '' && !isNaN(input.inputValue) && input.inputValue != 0)
        {
            //2.add the values in the budgetcontroller
            newItem =  budgetController.addItem(input.inputSelector, input.inputDescription, input.inputValue);
            console.log(newItem);

            //3.show the values in the income/expense tab
            UICtrl.publicInsertHtml(newItem, input.inputSelector);

            //4.calculate and display the budget
            calBudget();

            //5.calculate and display percentage
            UICtrl.displayPercentage(bdgtCtrl.calculatePerc());

            //6.clear the input fields 
            UICtrl.clearFields();
        }   
    }

    //function to delete item
    function ctrlDeleteItem(event){
        var elementID, type, id;
        elementID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        
        if(elementID !== '' && elementID !== undefined)
        {
            elementArr = elementID.split('-');
            type = elementArr[0];
            id = parseFloat(elementArr[1]);

            //1.delete the item from the data object
            bdgtCtrl.deleteItem(type, id);

            //2.delete the UI div from the DOM
            UICtrl.removeElement(elementID);

            //3.recalculate the  budget
            bdgtCtrl.updateBudget();

            //4.display the budget
            UICtrl.displayBudget(bdgtCtrl.getBudget());   

            //5.calculate and display percentage
            UICtrl.displayPercentage(bdgtCtrl.calculatePerc());

        }
    }

    //returning all the eventHandlers to init()
    return {
        init: function (){
            UICtrl.displayBudget(data);
            UICtrl.displayMonth();
            setupEventHandlers();
            console.log('application has started');
        }
    };

})(budgetController, UIController);

//INITIALIZING the application by setting up all the event handlers
//it is a good practices to use init() function to make the code more modular and organized
controller.init();
