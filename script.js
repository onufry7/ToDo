let todoList = null;
let todoForm = null;
let todoSearch = null;


// Box z zadaniem
function addTask(text, date) 
{
    //element todo
    const todo = document.createElement('div');
    todo.classList.add('todo-element');

    //belka gorna
    const todoBar = document.createElement('div');
    todoBar.classList.add('todo-element-bar');

    //data w belce
    const todoDate = document.createElement('div');
    todoDate.classList.add('todo-element-date');
    todoDate.innerText = date;

    //przycisk usuwania
    const todoDelete = document.createElement('button');
    todoDelete.classList.add('element-delete');
    todoDelete.innerHTML = '&#215;';

    //wrzucamy elementy do belki
    todoBar.appendChild(todoDate);
    todoBar.appendChild(todoDelete);

    //element z tekstem
    const todoText = document.createElement('div');
    todoText.classList.add('todo-element-text');
    todoText.innerText = text;

    //laczymy calosc
    todo.appendChild(todoBar);
    todo.appendChild(todoText);

    //i wrzucamy do listy
    todoList.append(todo);
};




// Box z errorem
function error(content)
{
    //element error
    const boxErr = document.createElement('div');
    boxErr.classList.add('error-box');

    //element z tekstem
    const errText = document.createElement('div');
    errText.classList.add('error-box-text');
    errText.innerText = content;

    //laczymy calosc
    boxErr.appendChild(errText);

    //i dodajemy do strony
    todoForm.after(boxErr);
};




//Przygotowanie daty i godziny
function preparDate()
{
    const date = new Date();
    const year = date.getFullYear();
    const day = (date.getDate() < 10) ? '0'+date.getDate() : date.getDate();
    const month = ((date.getMonth()+1) < 10) ? '0'+(date.getMonth()+1) : (date.getMonth()+1);
    const hours = (date.getHours() < 10) ? '0'+date.getHours() : date.getHours();
    const minutes = (date.getMinutes() < 10) ? '0'+date.getMinutes() : date.getMinutes();
    const dateText = day + '-' + month + '-' + year + ' godz.: ' + hours + ':' + minutes;
    return dateText;
};





//Pobranie danych z pliku
function getData()
{
    const getData = $.getJSON("db.json");
	
	$.when(getData).then( 
		(result) => result.forEach(el => addTask(el["description"], el["date"]) ), 
		() => error("Błąd wczytania pliku z danymi !")
	);
};



// Dodanie nowego zadania
function addData(description)
{
    const date = preparDate();
            
    const addData = $.post('file.ajax.php',
        {
            action: 'add',
            date: date,
            description: description
        });


    $.when(addData).then(
        (data, status) => {
            if(data != '') addTask(description, date);
            else error("Błąd dodawania wpisu !")
        }, () => error("Błąd wczytania pliku ajax !")
    );
};



// Usunięcie wpisu
function delData(date, description, el)
{
    const deleteData = $.post('file.ajax.php',
        {
            action: 'delete',
            date: date,
            description: description
        });

    $.when(deleteData).then(
        (data, status) => {
            console.log(data);
            if(data == 'true') el.remove();
            else  error("Błąd usuwania wpisu !");
        }, () => error("Błąd wczytania pliku ajax !")
    );
}





document.addEventListener('DOMContentLoaded', function() 
{
    // Pobranie el. strony
    todoList = document.querySelector('#todoList');
    todoForm = document.querySelector('#todoForm');
    todoSearch = document.querySelector('#todoSearch');

	getData(); //Wczytanie danych z bazy

    // Event dodania wpisu
    todoForm.addEventListener('submit', function(e) 
	{
        e.preventDefault();
        const textarea = this.querySelector('textarea');
        if (textarea.value !== '') 
		{
            addData(textarea.value);
            textarea.value = '';
        }
        else alert('Wpisz coś w treści zadania.'); // TODO stylizacja alerta
    });
	


	// Event usunięcia wpisu
	todoList.addEventListener('click', function(e) 
	{
        if (e.target.closest('.element-delete') !== null)
        {
            //Pobieram wartości klikniętego zadania
            const date = e.target.previousElementSibling.innerText;
            const description = e.target.parentElement.nextElementSibling.innerText;
            const element = e.target.closest('.todo-element')
            
            delData(date, description, element);
        };
    });
	
	


    // Szukajka
	todoSearch.addEventListener('input', function() 
	{
		const val = this.value;
		const elements = todoList.querySelectorAll('.todo-element');

        // Szukamy po elementach i ukrywamy nie pasujące
		[].forEach.call(elements, function(el) 
		{
			const text = el.querySelector('.todo-element-text').innerText;

			if (text.indexOf(val) !== -1)
				el.style.setProperty('display', '');
			else 
				el.style.setProperty('display', 'none');
        });
	});


	
// TODO: Niszczenie komunikatów errorów
});