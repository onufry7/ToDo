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
function confirm(content, type)
{
    //element error
    const confirm = document.createElement('div');
    confirm.classList.add('confirm-box');
    confirm.classList.add(type);

    //element z tekstem
    const infoText = document.createElement('p');
    infoText.classList.add('confirm-content');
    infoText.innerText = content;

    // Element do zamykania
    const button = document.createElement('div');
    button.classList.add('confirm-button');
    button.innerText = "OK";

    //laczymy calosc
    confirm.appendChild(infoText);
    confirm.appendChild(button);

    //i dodajemy do strony
    todoForm.after(confirm);
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
    const seconds = (date.getSeconds() < 10) ? '0'+date.getSeconds() : date.getSeconds();
    const dateText = day + '-' + month + '-' + year + ' godz.: ' + hours + ':' + minutes + ':' + seconds;
    return dateText;
};





//Pobranie danych z pliku
function getData()
{
    const getData = $.getJSON("db.json");
	
	$.when(getData).then( 
		(result) => result.forEach(el => addTask(el["description"], el["date"]) ), 
		() => confirm("Błąd wczytania pliku z danymi !","err")
	);
};



// Dodanie nowego zadania
function addData(description)
{
    const date = preparDate();
            
    const addData = $.post('ajaxs.php',
        {
            action: 'add',
            date: date,
            description: description
        });


    $.when(addData).then(
        (data, status) => {
            if(data != '') 
                {
                    addTask(description, date);
                    confirm('Dodana zadanie do listy.','ok');
                }
            else confirm("Błąd dodawania wpisu !","err")
        }, () => confirm("Błąd wczytania pliku ajax !","err")
    );
};



// Usunięcie wpisu
function delData(date, description, el)
{
    const deleteData = $.post('ajax.php',
        {
            action: 'delete',
            date: date,
            description: description
        });

    $.when(deleteData).then(
        (data, status) => {
            console.log(data);
            if(data == 'true')
            {
                el.remove();
                date = null;
                description = null;
                el = null;
            } 
            else  confirm("Błąd usuwania wpisu !","err");
        }, () => confirm("Błąd wczytania pliku ajax !","err")
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
        else confirm('Wpisz coś w treści zadania.','info');
    });
	


	// Event usunięcia wpisu
	todoList.addEventListener('click', function(e) 
	{
        if (e.target.closest('.element-delete') !== null)
        {
            //Pobieram wartości klikniętego zadania
            const element = e.target.closest('.todo-element')
            const date = e.target.previousElementSibling.innerText;
            const description = e.target.parentElement.nextElementSibling.innerText;
            delData(date, description, element);
        };
    });


    addEventListener('click', function(e)
    {
        const element = e.target.closest('.confirm-button');
        element.parentElement.remove();
        element = null;
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

});