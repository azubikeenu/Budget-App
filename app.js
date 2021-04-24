//-- Budget Controller----//
const budgetController = ( function () {
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


    const data = {
        allIncomes: [],
        allExpenses: [],
        totalIncome: 0,
        totalExpenses: 0
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
            return item;
        },
        data

    }


} )();



//-- UI Controller----//
const UIController = ( function () {

    const DOMStrings = {
        typeClass: ".add__type",
        descriptionClass: ".add__description",
        amountClass: ".add__value",
        addButtonClass: '.add__btn',
        incomeListClass: '.income__list',
        expenseListClass: '.expenses__list'
    }
    const addItem = function ( itemObj, type ) {
        const incomeListTemplate = ( type === 'inc' ) ? document.querySelector( DOMStrings.incomeListClass )
            : document.querySelector( DOMStrings.expenseListClass );
        const symbol = ( type === 'inc' ) ? '+' : '-';
        const { amount, description } = itemObj
        const item = `<div class="item clearfix" id="income-0">
       <div class="item__description">${description}</div>
       <div class="right clearfix">
           <div class="item__value">${symbol} ${amount}</div>
           <div class="item__delete">
               <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
           </div>
       </div>
   </div>`
        incomeListTemplate.insertAdjacentHTML( "beforeend", item );
    }


    return {
        getInput: function () {
            const type = document.querySelector( DOMStrings.typeClass ).value;
            const description = document.querySelector( DOMStrings.descriptionClass ).value;
            const amount = document.querySelector( DOMStrings.amountClass ).value;
            return { type, description, amount };
        },
        DOMStrings,
        addItem
    }

} )()




//-- Global App Controller----//
const appController = ( function ( UICtrl, budgtCtrl ) {
    const ctrlAddItem = function () {
        // Get the value of the input data
        const inputValues = UIController.getInput();

        //  Add the value to the budgetController
        budgtCtrl.addItem( inputValues );
        console.log( budgetController.data );

        // Add the value to the user interface

        UIController.addItem( inputValues, inputValues.type );

        // Calculate the Budget

        // Display the Budget on the UI


    }
    const setUpEventListeners = function () {
        document.querySelector( UICtrl.DOMStrings.addButtonClass ).addEventListener( 'click', ctrlAddItem )

        document.addEventListener( 'keypress', function ( e ) {
            if ( e.key === 'Enter' ) {
                ctrlAddItem()
            }
        } )


    }
    return {
        init: function () {
            console.log( "App has started" )
            setUpEventListeners();
        }
    }

} )( UIController, budgetController )

appController.init();