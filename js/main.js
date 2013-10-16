// creamos un basico de los platos
var platos={
	entradas:[
		"papa a la huancaina","causa rellena","ocopa","sopa de moron"
	],
	fondo:[
		"arroz con pollo","frejoles con seco","picante de carne","olluquito con carne"
	],
	refresco:[
		"anis","manzanilla","hierba luisa","agua de manzana","chica morada"
	],
	postres:[
		"arroz con leche","mazamorra morada","champus","arroz zambito"
	]
};
// validamos si existe o no el objeto todos en indexdb
var html5rocks={};
html5rocks.indexedDB={};
html5rocks.indexedDB.db=null;
html5rocks.indexedDB.open=function(){
	var request=indexedDB.open("todos","descripcion de la db");
	request.onsuccess=function(e){
		var v="1.0";
		html5rocks.indexedDB.db=e.target.result;
		var db=html5rocks.indexedDB.db;
		// We can only create Object stores in a setVersion transaction;
		if(v != db.version){
			var setVrequest = db.setVersion(v);
			// onsuccess is the only place we can create Object Stores
			setVrequest.onfailure = html5rocks.indexedDB.onerror;
			setVrequest.onsuccess=function(e){
				var store=db.createObjectStore("todo",{keyPath:"timeStamp"});
				html5rocks.indexedDB.getAllTodoItems();
			}
		}
		html5rocks.indexedDB.getAllTodoItems()
	}
	request.onfailure=html5rocks.indexedDB.onerror;
}
// almacenamos data
html5rocks.indexedDB.addTodo=function(todoText){
	var db = html5rocks.indexedDB.db;
	var trans = db.transaction(["todo"],IDBTransaction.READ_WRITE,0);
	var store =trans.objectStore("todo");
	var request= store.put({
		"text":todoText,
		"timeStamp":new Date().getTime()
	})
	request.onsuccess=function(e){
		 // Re-render all the todo's
		 html5rocks.indexedDB.getAllTodoItems();
	}
	request.onerror=function(e){
		console.log(e.value);
	}
}
// consultar datos desde la db
html5rocks.indexedDB.getAllTodoItems = function() {
  var todos = document.getElementById("todoItems");
  todos.innerHTML = "";

  var db = html5rocks.indexedDB.db;
  var trans = db.transaction(["todo"], IDBTransaction.READ_WRITE, 0);
  var store = trans.objectStore("todo");

  // Get everything in the store;
  var keyRange = IDBKeyRange.lowerBound(0);
  var cursorRequest = store.openCursor(keyRange);

  cursorRequest.onsuccess = function(e) {
    var result = e.target.result;
    if(!!result == false)
      return;

    renderTodo(result.value);
    result.continue();
  };

  cursorRequest.onerror = html5rocks.indexedDB.onerror;
};
// transmitir datos desde un almacen de objectStore
function renderTodo(row) {
  var todos = document.getElementById("todoItems");
  var li = document.createElement("li");
  var a = document.createElement("a");
  var t = document.createTextNode();
  t.data = row.text;

  a.addEventListener("click", function(e) {
    html5rocks.indexedDB.deleteTodo(row.text);
  });

  a.textContent = " [Delete]";
  li.appendChild(t);
  li.appendChild(a);
  todos.appendChild(li)
}
// eliminar datos de una tabla
html5rocks.indexedDB.deleteTodo = function(id) {
  var db = html5rocks.indexedDB.db;
  var trans = db.transaction(["todo"], IDBTransaction.READ_WRITE, 0);
  var store = trans.objectStore("todo");

  var request = store.delete(id);

  request.onsuccess = function(e) {
    html5rocks.indexedDB.getAllTodoItems();  // Refresh the screen
  };

  request.onerror = function(e) {
    console.log(e);
  };
};
// conectar todo
function init() {
  html5rocks.indexedDB.open(); // open displays the data previously saved
}

window.addEventListener("DOMContentLoaded", init, false);

function addTodo() {
  var todo = document.getElementById('todo');

  html5rocks.indexedDB.addTodo(todo.value);
  todo.value = '';
}