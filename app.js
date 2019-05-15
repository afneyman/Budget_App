let budgetController = (function() {

    let Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    let Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    let data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        }
    };

    return {
        addItem: function(type, des, val) {
            let newItem, ID;
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1; // getting the id of the last item and adding one
            } else ID = 0;
            
            // creating a new item based on type 'inc' or 'exp'
            if (type === 'exp') {
                newItem = new Expense(ID, des, val);
            } else if (type === 'inc') {
                newItem = new Income(ID, des, val);
            }
            
            // adding the new item to the data data structure
            data.allItems[type].push(newItem);

        },

        testing: function() { console.log(data) }
    }

})();


let UIController = (function() {

    let DOMstrings = {
        inputType:'.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expenseContainer: '.expense__list'
    }

    return {
        getInput: function() {
            return {
                type: document.querySelector(DOMstrings.inputType).value, // either inc or exp
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: document.querySelector(DOMstrings.inputValue).value
            };
        },

        addListItem: function(obj, type) {

            let html, newHtml, element;

            // create html string with placeholder text
            if (type === 'inc') {
                element = DOMstrings.incomeContainer;

                html = '<div class="item clearfix" id="income-%id%"> <div class="item__description">%description%</div> <div class="right clearfix"><div class="item__value">%value%</div> <div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div><div class="item clearfix" id="income-1"><div class="item__description">Sold car</div><div class="right clearfix"><div class="item__value">+ 1,500.00</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            } else if (type === 'exp'){
                element = DOMstrings.expenseContainer;

                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }
            // Replace the placeholder text with some actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));

            // insert html into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml)

        },

        getDOMstrings: function() {
            return DOMstrings;
        }
    }

})();


let controller = (function(budgetCtrl, UICtrl){

    let setupEventListeners = function() {

        let DOM = UICtrl.getDOMstrings();

        document.querySelector(DOM.inputBtn).addEventListener('click',  ctrlAddItem);

        document.addEventListener('keypress', function(event) {
    
            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            };
        });
    };

    let ctrlAddItem = function () {
        let input, newItem;

        // 1, get the field input data
        input = UICtrl.getInput();

        // 2. add the item to the budget controller
        newItem = budgetCtrl.addItem(input.type, input.description, input.value);
        // 3. add the new item to the UI
        UICtrl.addListItem(newItem, input.type);
        // 4. calculate the budget

        // 5. display the budget

    };

    return {
        init: function() {
            setupEventListeners();
        }
    };

})(budgetController, UIController);

controller.init();