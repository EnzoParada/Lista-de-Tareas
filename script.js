const dateNumber = document.getElementById('dateNumber');
const dateText = document.getElementById('dateText');
const dateMonth = document.getElementById('dateMonth');
const dateYear = document.getElementById('dateYear');
const tasksContainer = document.getElementById('tasksContainer');

// Establecer fecha actual
const setDate = () => {
    const date = new Date();
    dateNumber.textContent = date.toLocaleString('es', { day: 'numeric' });
    dateText.textContent = date.toLocaleString('es', { weekday: 'long' });
    dateMonth.textContent = date.toLocaleString('es', { month: 'short' });
    dateYear.textContent = date.toLocaleString('es', { year: 'numeric' });
};

// Agregar nueva tarea
const addNewTask = event => {
    event.preventDefault();
    const { value } = event.target.taskText;
    if (!value) return;
    
    const task = document.createElement('div');
    task.classList.add('task', 'roundBorder');
    
    const taskText = document.createElement('span');
    taskText.textContent = value;
    
    const deleteBtn = document.createElement('button');
    deleteBtn.innerHTML = '×';
    deleteBtn.classList.add('delete-btn');
    deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        task.remove();
        saveTasks();
    });
    
    task.appendChild(taskText);
    task.appendChild(deleteBtn);
    task.addEventListener('click', changeTaskState);
    
    tasksContainer.prepend(task);
    event.target.reset();
    saveTasks();
};

// Cambiar estado de tarea (completada/no completada)
const changeTaskState = event => {
    if (!event.target.classList.contains('delete-btn')) {
        event.currentTarget.classList.toggle('done');
        saveTasks();
    }
};

// Guardar tareas en localStorage
const saveTasks = () => {
    const tasks = [];
    document.querySelectorAll('.task').forEach(taskElement => {
        tasks.push({
            text: taskElement.querySelector('span').textContent,
            done: taskElement.classList.contains('done')
        });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
};

// Cargar tareas desde localStorage
const loadTasks = () => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
        const tasks = JSON.parse(savedTasks);
        tasksContainer.innerHTML='';
        tasks.reverse().forEach(task => {
            const taskElement = document.createElement('div');
            taskElement.classList.add('task', 'roundBorder');
            
            const taskText = document.createElement('span');
            taskText.textContent = task.text;
            
            const deleteBtn = document.createElement('button');
            deleteBtn.innerHTML = '×';
            deleteBtn.classList.add('delete-btn');
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                taskElement.remove();
                saveTasks();
            });
            
            taskElement.appendChild(taskText);
            taskElement.appendChild(deleteBtn);
            
            if (task.done) {
                taskElement.classList.add('done');
            }
            
            taskElement.addEventListener('click', changeTaskState);
            tasksContainer.appendChild(taskElement);
        });
    }
};

// Eliminar todas las tareas
const deleteAllTasks = () => {
    if (tasksContainer.children.length === 0) {
        alert('No hay tareas para eliminar');
        return;
    }
    
    if (confirm('¿Estás seguro de que quieres eliminar todas las tareas?')) {
        tasksContainer.innerHTML = '';
        localStorage.removeItem('tasks');
    }
};

// Ordenar tareas (no completadas primero)
const order = () => {
    const done = [];
    const toDo = [];
    tasksContainer.childNodes.forEach(el => {
        el.classList.contains('done') ? done.push(el) : toDo.push(el);
    });
    return [...toDo, ...done];
};

// Renderizar tareas ordenadas
const renderOrderedTask = () => {
    order().forEach(el => tasksContainer.appendChild(el));
    saveTasks();
};

// Inicializar aplicación
document.addEventListener('DOMContentLoaded', () => {
    setDate();
    loadTasks();
    
    const taskForm = document.querySelector('form');
    if (taskForm) {
        taskForm.addEventListener('submit', addNewTask);
    }
    // Asignar evento al botón "Eliminar todas"
    const deleteAllButton = document.querySelector('.deleteAllButton');
    if (deleteAllButton) {
        deleteAllButton.addEventListener('click', deleteAllTasks);
    }
});