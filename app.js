//-- Budget Controller----//
const budgetController = ( function () {

    const data = {
        allIncomes: [],
        allExpenses: [],
        totalIncome: 0,
        totalExpenses: 0,
        budget: 0,
        percentage: -1,
    }

    const Income = function ( id, description, amount ) {
        this.id = id;
        this.description = description;
        this.amount = parseFloat( amount );
    }

    Income.prototype.getTotalIncome = function ( data ) {
        return data.reduce( ( acc, curr ) => acc + curr.amount, 0 );

    }
    const Expense = function ( id, description, amount ) {
        this.id = id;
        this.description = description;
        this.amount = parseFloat( amount );
    }

    Expense.prototype.getTotalExpense = function ( data ) {
        return data.reduce( ( acc, curr ) => acc + curr.amount, 0 );

    }
    const generateRandomID = function () {
        return Math.random().toString( 36 ).replace( /[^a-z]+/g, '' ).substr( 0, 5 )
    }

    const calculateBudgetFields = function () {
        data.budget = data.totalIncome - data.totalExpenses;
        data.percentage = ( data.totalIncome > 0 ) ? Math.round( ( data.totalExpenses / data.totalIncome ) * 100 ) : -1;

    }

    const removeItem = function ( { type, id } ) {

        if ( type === 'inc' ) {
            // get the item with id  and remove from the array
            data.allIncomes = data.allIncomes.filter( el => el.id !== id );
            data.totalIncome = data.allIncomes.reduce( ( acc, curr ) => acc + curr.amount, 0 );
        } else {
            data.allExpenses = data.allExpenses.filter( el => el.id !== id );
            data.totalExpenses = data.allExpenses.reduce( ( acc, curr ) => acc + curr.amount, 0 );
        }
        calculateBudgetFields();

    }


    return {
        addItem: function ( itemObj ) {
            let item;
            const id = generateRandomID();
            const { type, amount, description } = itemObj;
            if ( type === 'inc' ) {
                item = new Income( id, description, amount );
                data.allIncomes.push( item );
                data.totalIncome = item.getTotalIncome( data.allIncomes );
            } else {
                item = new Expense( id, description, amount )
                data.allExpenses.push( item );
                data.totalExpenses = item.getTotalExpense( data.allExpenses )
            }
            calculateBudgetFields();
            return { item, type };
        },
        data,
        getBudget () {
            return {
                budget: data.budget,
                percentage: data.percentage,
                totalIncome: data.totalIncome,
                totalExpenses: data.totalExpenses
            }
        },
        removeItem


    }

}


)();



//-- UI Controller----//
const UIController = ( function () {

    const DOMStrings = {
        typeClass: ".add__type",
        descriptionClass: ".add__description",
        amountClass: ".add__value",
        addButtonClass: '.add__btn',
        incomeListClass: '.income__list',
        expenseListClass: '.expenses__list',
        budgetValue: '.budget__value',
        budgetIncomeValue: '.budget__income--value',
        budgetExpenseValue: '.budget__expenses--value',
        budgetExpensePercentage: '.budget__expenses--percentage',
        budgetContainer: '.container'
    }
    const addItem = function ( { item, type } ) {
        const incomeListTemplate = ( type === 'inc' ) ? document.querySelector( DOMStrings.incomeListClass )
            : document.querySelector( DOMStrings.expenseListClass );

        const symbol = ( type === 'inc' ) ? '+' : '-';

        const { amount, description, id } = item

        const itemTemplate = `
            <div class="item clearfix" data-value="${type}-${id}">
                <div class="item__description">${description}</div>
                <div class="right clearfix">
                    <div class="item__value">${symbol} ${amount}</div>
                    <div class="item__delete">
                        <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                    </div>
                </div>
        </div>`

        incomeListTemplate.insertAdjacentHTML( "beforeend", itemTemplate );
    }
    const clearInputField = function ( ...args ) {
        args.forEach( item => {
            document.querySelector( item ).value = "";
        } )
        document.querySelector( args[1] ).focus()

    }
    const validateFields = function ( ...args ) {
        return args.every( field => document.querySelector( field ).value !== "" );
    }

    const updateBudget = function ( { budget, percentage, totalExpenses, totalIncome } ) {
        document.querySelector( DOMStrings.budgetValue ).innerText = budget;
        document.querySelector( DOMStrings.budgetExpenseValue ).innerText = `- ${totalExpenses}`;
        document.querySelector( DOMStrings.budgetIncomeValue ).innerText = `+ ${totalIncome}`;
        ( percentage > 0 ) ? document.querySelector( DOMStrings.budgetExpensePercentage ).innerText = `${percentage} %` :
            document.querySelector( DOMStrings.budgetExpensePercentage ).innerText = "---";

    }

    const removeItem = function ( item, type ) {
        if ( type === 'inc' ) {
            document.querySelector( DOMStrings.incomeListClass ).removeChild( item )
        } else {
            document.querySelector( DOMStrings.expenseListClass ).removeChild( item )
        }

    }



    return {
        getInput: function () {
            const type = document.querySelector( DOMStrings.typeClass ).value;
            const description = document.querySelector( DOMStrings.descriptionClass ).value;
            const amount = document.querySelector( DOMStrings.amountClass ).value;
            return { type, description, amount };
        },
        DOMStrings,
        addItem,
        clearInputField,
        validateFields,
        updateBudget,
        removeItem
    }

} )()




//-- Global App Controller----//
const appController = ( function ( UICtrl, budgtCtrl ) {
    const ctrlAddItem = function () {
        const isValidated = UICtrl.validateFields( UICtrl.DOMStrings.amountClass, UICtrl.DOMStrings.amountClass );
        if ( isValidated ) {
            // Get the value of the input data
            const inputValues = UICtrl.getInput();

            //  Add the value to the budgetController
            const itemObj = budgtCtrl.addItem( inputValues );
            console.log( budgetController.data );

            // Add the value to the user interface
            UICtrl.addItem( itemObj );

            // clear the user input field
            UICtrl.clearInputField( UICtrl.DOMStrings.amountClass, UICtrl.DOMStrings.descriptionClass );

            // Calculate the Budget
            const budget = budgtCtrl.getBudget();

            // Display the Budget on the UI
            UICtrl.updateBudget( budget )



        }

    }

    const ctrlDeleteItem = function ( e ) {

        const item = e.target.parentNode.parentNode.parentNode.parentNode;
        const [type, id] = item.dataset.value.split( '-' );

        // Remove the Item from the budgetController

        budgtCtrl.removeItem( { type, id } )

        // Update the UI

        UIController.removeItem( item, type )

        //Update the Budget
        const budget = budgtCtrl.getBudget();

        // display the budget

        UICtrl.updateBudget( budget );



    }

    const setUpEventListeners = function () {
        document.querySelector( UICtrl.DOMStrings.addButtonClass ).addEventListener( 'click', ctrlAddItem )

        document.addEventListener( 'keypress', function ( e ) {
            if ( e.key === 'Enter' ) {
                ctrlAddItem()
            }
        } )

        document.querySelector( UICtrl.DOMStrings.budgetContainer ).addEventListener( 'click', ctrlDeleteItem )


    }
    return {
        init: function () {
            console.log( "App has started" )
            setUpEventListeners();
            UICtrl.updateBudget( {
                budget: 0,
                totalExpenses: 0,
                totalIncome: 0,
                percentage: '---'
            } )
        }
    }

} )( UIController, budgetController )

appController.init();