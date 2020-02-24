// DATA CONTROLLER - Model
// tslint:disable-next-line: only-arrow-functions
var dataController = (function () {
    var myLibrary = [];
    // Book object constructor
    function Book(title, author, pages, readStatus, id) {
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.readStatus = readStatus;
        this.id = id;
    }
    // Return object items that are needed for sharing between objects or accessing in browser console window
    return {
        addDataItem: function (title, author, pages, readStatus) {
            var id;
            if (myLibrary.length > 0) {
                id = myLibrary[myLibrary.length - 1].id + 1;
            }
            else {
                id = 0;
            }
            var newbook = new Book(title, author, pages, readStatus, id);
            myLibrary.push(newbook);
        },
        getID: function () {
            return myLibrary[myLibrary.length - 1].id;
        },
        deleteDataItem: function (id) {
            var ids;
            var index;
            // tslint:disable-next-line: only-arrow-functions
            ids = myLibrary.map(function (current) {
                return current.id;
            });
            // tslint:disable-next-line: radix
            index = ids.indexOf(parseInt(id));
            if (index !== -1) {
                myLibrary.splice(index, 1);
            }
        },
        changeReadStatus: function (evt) {
            var ItemID;
            ItemID = evt.target.parentNode.parentNode.id;
            var ids;
            var index;
            // tslint:disable-next-line: only-arrow-functions
            ids = myLibrary.map(function (current) {
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
        saveToLocalStorage: function () {
            if (storageAvailable("localStorage")) {
                var localStorageArr_1 = [];
                if (myLibrary.length >= 1) {
                    myLibrary.forEach(function (book) {
                        localStorageArr_1.push(book);
                        localStorage.setItem("myLibrary", JSON.stringify(localStorageArr_1));
                    });
                }
                else {
                    // tslint:disable-next-line: no-shadowed-variable
                    var localStorageArr_2 = [];
                    localStorage.setItem("myLibrary", JSON.stringify(localStorageArr_2));
                }
            }
        },
        testing: function () {
            // tslint:disable-next-line: no-console
            console.log(myLibrary);
        }
    };
})();
// UI CONTROLLER - View
// tslint:disable-next-line: only-arrow-functions
var UIController = (function () {
    var DOMstrings = {
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
        trashBtn: "#trashBtn"
    };
    // Return object items that are needed for sharing between objects or accessing in browser console window
    return {
        getInput: function () {
            return {
                author: document.querySelector(DOMstrings.authorTextElement).value,
                pages: document.querySelector(DOMstrings.pagesTextElement).value,
                readStatus: document.querySelector(DOMstrings.readStatusTextElement).value,
                title: document.querySelector(DOMstrings.titleTextElement).value
            };
        },
        addViewItem: function (title, author, pages, readStatus, id) {
            var checked;
            readStatus === "read" ? checked = "checked" : checked = "";
            document.querySelector(DOMstrings.tableBody).insertAdjacentHTML("afterbegin", "\n            <tr id=\"" + id + "\">\n                <td data-Title\">" + title + "</td>\n                <td data-Author>" + author + "</td>\n                <td data-Pages>" + pages + "</td>\n                <td>\n                <input type=\"checkbox\" class=\"ui checkbox\" id=\"checkbox\" " + checked + "></input>\n                </td>\n                <td>\n                    <div class=\"ui icon inverted red button\" id=\"trashBtn\">\n                        <i class=\"trash icon\"></i>\n                    </div>\n                </td>\n            </tr>\n                ");
        },
        deleteViewItem: function (id) {
            var el = document.getElementById(id);
            el.parentNode.removeChild(el);
        },
        toggleDisplay: function () {
            var form = document.querySelector(DOMstrings.form);
            var table = document.querySelector(DOMstrings.table);
            form.className.split(" ")[2] === "hide" ? form.className = "ui form show" : form.className = "ui form hide";
            form.className.split(" ")[2] === "hide" ? table.className = "ui celled table" : table.className = "ui celled table hide";
        },
        getDOMstrings: function () {
            return DOMstrings;
        },
        testing: function () {
            // tslint:disable-next-line: no-console
            return console.log(document.querySelector(DOMstrings.readStatusTextElement).value);
        }
    };
})();
// GLOBAL APP CONTROLLER - Controller
// tslint:disable-next-line: only-arrow-functions
var controller = (function (dataCtrl, UICtrl) {
    // 1. Access DOM Strings
    var DOM = UICtrl.getDOMstrings();
    // 2. Setup toggle and form submit global event listeners
    function setupEventListeners() {
        document.querySelector(DOM.addBtn).addEventListener("click", function () {
            UICtrl.toggleDisplay();
        });
        document.querySelector(DOM.formSubmit).addEventListener("click", function (e) {
            ctrlAddItem(e);
        });
    }
    function render() {
        // 1. Check for local storage - feature detection
        if (storageAvailable("localStorage")) {
            // 2. Check if local storage object already exists
            if (localStorage.getItem("myLibrary")) {
                // 3. Parse JSON values from local storage object
                var libraryData = JSON.parse(localStorage.getItem("myLibrary"));
                // 4. Get DOM strings
                // tslint:disable-next-line: no-shadowed-variable
                var DOM_1 = UICtrl.getDOMstrings();
                // 5. For each book in local storage object, add to local array variable
                libraryData.forEach(function (book) {
                    dataCtrl.addDataItem(book.title, book.author, book.pages, book.readStatus);
                });
                // 6. For each book in local storage object, render view item in table
                libraryData.forEach(function (book) {
                    UICtrl.addViewItem(book.title, book.author, book.pages, book.readStatus, book.id);
                });
                // 7. For each rendered local storage object, add delete function event listeners
                document.querySelectorAll(DOM_1.trashBtn).forEach(function (book) {
                    book.addEventListener("click", function (e) {
                        ctrlDeleteItem(e);
                    });
                });
                // 8. For each rendered local storage object, add changeReadStatus function event listeners
                document.querySelectorAll(DOM_1.checkbox).forEach(function (book) {
                    book.addEventListener("change", function (e) {
                        dataCtrl.changeReadStatus(e);
                    });
                });
            }
        }
    }
    function ctrlAddItem(evt) {
        // 1. Access DOM Strings
        // tslint:disable-next-line: no-shadowed-variable
        var DOM = UICtrl.getDOMstrings();
        // 2.. Access DOM Strings values for form inputs
        var input = UICtrl.getInput();
        // 3. Validate Form Input and Transform Data
        if (input.title === "" || input.author === "" || input.pages === "") {
            return;
        }
        else {
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
            document.querySelector(DOM.trashBtn).addEventListener("click", function (e) {
                ctrlDeleteItem(e);
            });
            // 9. Add Event Listener to Item Checkbox Button
            document.querySelector(DOM.checkbox).addEventListener("change", function (e) {
                dataCtrl.changeReadStatus(e);
            });
        }
    }
    function ctrlDeleteItem(evt) {
        var ItemID;
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
        init: function () {
            // tslint:disable-next-line: no-console
            console.log("Application has started.");
            setupEventListeners();
            render();
        },
        testing: function () {
            var DOMvalues = UICtrl.getInput();
            // tslint:disable-next-line: no-console
            console.log(DOMvalues);
        }
    };
})(dataController, UIController);
controller.init();
// Global variable - feature detection for local storage
function storageAvailable(type) {
    var storage;
    try {
        storage = window[type];
        var x = "__storage_test__";
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch (e) {
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
