// DATA CONTROLLER - Model

// tslint:disable-next-line: only-arrow-functions
const dataController = (function() {
    const myLibrary: any = [];

    // Book object constructor
    function Book(this: any, title: string, author: string, pages: number, readStatus: string, id: number) {
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.readStatus = readStatus;
        this.id = id;
    }

    // Return object items that are needed for sharing between objects or accessing in browser console window
    return {

        addDataItem(title: string, author: string, pages: number, readStatus: string) {
            let id: number;

            if (myLibrary.length > 0) {
                id = myLibrary[myLibrary.length - 1].id + 1;

            } else {
                id = 0;
            }

            const newbook: any = new Book(title, author, pages, readStatus, id);
            myLibrary.push(newbook);
        },

        getID() {
            return myLibrary[myLibrary.length - 1].id;
        },

        deleteDataItem(id: string) {
            let ids: any;
            let index: number;

            // tslint:disable-next-line: only-arrow-functions
            ids = myLibrary.map(function(current: {
                id: any;
            }) {
                return current.id;
            });

            // tslint:disable-next-line: radix
            index = ids.indexOf(parseInt(id));

            if (index !== -1) {
                myLibrary.splice(index, 1);
            }
        },

        changeReadStatus(evt: any) {

            let ItemID: string;
            ItemID = evt.target.parentNode.parentNode.id;

            let ids: any;
            let index: number;

            // tslint:disable-next-line: only-arrow-functions
            ids = myLibrary.map(function(current: {
                id: any;
            }) {
                return current.id;
            });

            // tslint:disable-next-line: radix
            index = ids.indexOf(parseInt(ItemID));

            if (index !== -1) {
                myLibrary[index].readStatus === "read" ? myLibrary[index].readStatus = "not read" :
                    myLibrary[index].readStatus = "read";
            }

            this.saveToLocalStorage();
        },

        saveToLocalStorage() {
            if (storageAvailable("localStorage")) {
                const localStorageArr: any = [];
                if (myLibrary.length >= 1) {
                    myLibrary.forEach((book: any) => {
                        localStorageArr.push(book);
                        localStorage.setItem("myLibrary", JSON.stringify(localStorageArr));
                    });
                } else {
                    // tslint:disable-next-line: no-shadowed-variable
                    const localStorageArr: any = [];
                    localStorage.setItem("myLibrary", JSON.stringify(localStorageArr));
                }
            }
        },

        testing() {
            // tslint:disable-next-line: no-console
            console.log(myLibrary);
        },
    };

})();

// UI CONTROLLER - View
// tslint:disable-next-line: only-arrow-functions
const UIController = (function() {

    const DOMstrings: any = {
        addBtn: "#addBtn",
        authorTextElement: ".author",
        checkbox: "#checkbox",
        form: ".form",
        formSubmit: "#submitBtn",
        grid: ".grid",
        pagesTextElement: ".pages",
        readStatusTextElement: ".readStatus",
        table: ".table",
        tableBody: ".table-body",
        titleTextElement: ".title",
        trashBtn: "#trashBtn",
    };

    // Return object items that are needed for sharing between objects or accessing in browser console window
    return {

        getInput() {
            return {
                author: document.querySelector(DOMstrings.authorTextElement).value,
                pages: document.querySelector(DOMstrings.pagesTextElement).value,
                readStatus: document.querySelector(DOMstrings.readStatusTextElement).value,
                title: document.querySelector(DOMstrings.titleTextElement).value,
            };
        },

        addViewItem(title: string, author: string, pages: number, readStatus: string, id: number) {

            let checked: string;
            readStatus === "read" ? checked = "checked" : checked = "";

            document.querySelector(DOMstrings.tableBody).insertAdjacentHTML("afterbegin",
                `
            <tr id="${id}">
                <td data-Title">${title}</td>
                <td data-Author>${author}</td>
                <td data-Pages>${pages}</td>
                <td>
                <input type="checkbox" class="ui checkbox" id="checkbox" ${checked}></input>
                </td>
                <td>
                    <div class="ui icon inverted red button" id="trashBtn">
                        <i class="trash icon"></i>
                    </div>
                </td>
            </tr>
                `);
        },

        deleteViewItem(id: string) {
            const el: any = document.getElementById(id);
            el.parentNode.removeChild(el);
        },

        toggleDisplay() {
            const form: HTMLElement = document.querySelector(DOMstrings.form);
            const table: HTMLElement = document.querySelector(DOMstrings.table);

            form.className.split(" ")[2] === "hide" ? form.className = "ui form show" : form.className = "ui form hide";
            form.className.split(" ")[2] === "hide" ? table.className = "ui celled table" : table.className = "ui celled table hide";
        },

        getDOMstrings() {
            return DOMstrings;
        },

        testing() {
            // tslint:disable-next-line: no-console
            return console.log(document.querySelector(DOMstrings.readStatusTextElement).value);
        },
    };

})();

// GLOBAL APP CONTROLLER - Controller
// tslint:disable-next-line: only-arrow-functions
const controller = (function(dataCtrl, UICtrl) {

    // 1. Access DOM Strings
    const DOM: any = UICtrl.getDOMstrings();

    // 2. Setup toggle and form submit global event listeners
    function setupEventListeners() {
        document.querySelector(DOM.addBtn).addEventListener("click", () => {
            UICtrl.toggleDisplay();
        });

        document.querySelector(DOM.formSubmit).addEventListener("click", (e: object) => {
            ctrlAddItem(e);
        });
    }

    function render() {
        // 1. Check for local storage - feature detection
        if (storageAvailable("localStorage")) {
            // 2. Check if local storage object already exists
            if (localStorage.getItem("myLibrary")) {
                // 3. Parse JSON values from local storage object
                const libraryData: any = JSON.parse(localStorage.getItem("myLibrary"));
                // 4. Get DOM strings
                // tslint:disable-next-line: no-shadowed-variable
                const DOM: HTMLElement | any = UICtrl.getDOMstrings();

                // 5. For each book in local storage object, add to local array variable
                libraryData.forEach((book: {
                    title: string; author: string; pages: number; readStatus: string;
                }) => {
                    dataCtrl.addDataItem(book.title, book.author, book.pages, book.readStatus);
                });

                // 6. For each book in local storage object, render view item in table
                libraryData.forEach((book: {
                    title: string; author: string; pages: number; readStatus: string; id: number;
                }) => {
                    UICtrl.addViewItem(book.title, book.author, book.pages, book.readStatus, book.id);
                });

                // 7. For each rendered local storage object, add delete function event listeners
                document.querySelectorAll(DOM.trashBtn).forEach((book) => {
                    book.addEventListener("click", (e: object) => {
                        ctrlDeleteItem(e);
                    });
                });

                // 8. For each rendered local storage object, add changeReadStatus function event listeners
                document.querySelectorAll(DOM.checkbox).forEach((book) => {
                    book.addEventListener("change", (e: object) => {
                        dataCtrl.changeReadStatus(e);
                    });
                });
            }
        }
    }

    function ctrlAddItem(evt: any) {
        // 1. Access DOM Strings
        // tslint:disable-next-line: no-shadowed-variable
        const DOM: HTMLElement | any = UICtrl.getDOMstrings();
        // 2.. Access DOM Strings values for form inputs
        const input: any = UICtrl.getInput();

        // 3. Validate Form Input and Transform Data
        if (input.title === "" || input.author === "" || input.pages === "") {
            return;
        } else {
            evt.preventDefault();
            // tslint:disable-next-line: max-line-length
            document.querySelector(DOM.readStatusTextElement).checked === true ? input.readStatus = "read" : input.readStatus = "not read";

            // 4. Add item to Data
            dataCtrl.addDataItem(input.title, input.author, input.pages, input.readStatus);

            // 5. Add item to View
            UICtrl.addViewItem(input.title, input.author, input.pages, input.readStatus, dataCtrl.getID());

            // 6. Save change to LocalStorage
            dataCtrl.saveToLocalStorage();

            // 7. Close Form Window
            UICtrl.toggleDisplay();

            // 8. Add Event Listener to Item Delete Button
            document.querySelector(DOM.trashBtn).addEventListener("click", (e: any) => {
                ctrlDeleteItem(e);
            });

            // 9. Add Event Listener to Item Checkbox Button
            document.querySelector(DOM.checkbox).addEventListener("change", (e: any) => {
                dataCtrl.changeReadStatus(e);
            });
        }
    }

    function ctrlDeleteItem(evt: any) {
        let ItemID: string;
        // 1. Assign Item ID to table row item id
        ItemID = evt.target.parentNode.parentNode.parentNode.id;

        if (ItemID) {
            // 2. Remove item from data
            dataCtrl.deleteDataItem(ItemID);

            // 3. Remove item from view
            UICtrl.deleteViewItem(ItemID);

            // 4. Save changes to local storage
            dataCtrl.saveToLocalStorage();
        }
    }

    // Return object items that are needed for sharing between objects or accessing in browser console window
    return {
        init() {
            // tslint:disable-next-line: no-console
            console.log("Application has started.");
            setupEventListeners();
            render();
        },

        testing() {
            const DOMvalues = UICtrl.getInput();
            // tslint:disable-next-line: no-console
            console.log(DOMvalues);
        },
    };

})(dataController, UIController);

controller.init();

// Global variable - feature detection for local storage
function storageAvailable(type: any) {
    let storage: any;
    try {
        storage = window[type];
        const x = "__storage_test__";
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    } catch (e) {
        return e instanceof DOMException && (
                // everything except Firefox
                e.code === 22 ||
                // Firefox
                e.code === 1014 ||
                // test name field too, because code might not be present
                // everything except Firefox
                e.name === "QuotaExceededError" ||
                // Firefox
                e.name === "NS_ERROR_DOM_QUOTA_REACHED") &&
            // acknowledge QuotaExceededError only if there's something already stored
            (storage && storage.length !== 0);
    }
}
