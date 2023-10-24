document.addEventListener('DOMContentLoaded', function() {
    loadTasks();
});

document.getElementById('add').addEventListener('click', function(event) {
    event.preventDefault();

    const taskInput = document.getElementById('task');
    const deadlineInput = document.getElementById('deadline');
    const deadlineTimeInput = document.getElementById('deadline-time');

    const taskText = taskInput.value.trim();
    const deadlineDate = new Date(deadlineInput.value + 'T' + deadlineTimeInput.value);

    if (taskText !== '' && !isNaN(deadlineDate)) {
        addTask(taskText, deadlineDate);
        taskInput.value = '';
        deadlineInput.value = '';
        deadlineTimeInput.value = '';
    }
});

function addTask(taskText, deadlineDate) {
    const tasksTable = document.getElementById('tasks-table');
    const newRow = tasksTable.insertRow(0);
    const taskCell = newRow.insertCell(0);
    const deadlineCell = newRow.insertCell(1);
    const deadlineTimeCell = newRow.insertCell(2);
    const timeLeftCell = newRow.insertCell(3);
    const actionCell = newRow.insertCell(4);

    taskCell.textContent = taskText;
    deadlineCell.textContent = deadlineDate.toDateString();
    deadlineTimeCell.textContent = deadlineDate.toLocaleTimeString();

    const currentTime = new Date();
    const timeLeft = Math.ceil((deadlineDate - currentTime) / (1000 * 60 * 60 * 24));

    if (timeLeft < 0) {
        timeLeftCell.textContent = 'Melewati Deadline';
    } else {
        timeLeftCell.textContent = timeLeft + ' hari';
    }

    const completeButton = document.createElement('button');
    completeButton.className = 'btn btn-success btn-sm';
    completeButton.textContent = 'Selesai';
    completeButton.addEventListener('click', function() {
        newRow.classList.toggle('completed');
        completeButton.textContent = 'Selesai'; // Mengubah teks tombol kembali ke 'Selesai'
    });

    const deleteButton = document.createElement('button');
    deleteButton.className = 'btn btn-danger btn-sm';
    deleteButton.textContent = 'Hapus';
    deleteButton.addEventListener('click', function() {
        tasksTable.deleteRow(newRow.rowIndex);
        saveTasks();
    });

    actionCell.appendChild(completeButton);
    actionCell.appendChild(deleteButton);

    saveTasks();
}

function saveTasks() {
    const tasksTable = document.getElementById('tasks-table');
    const tasks = [];

    for (let i = 0; i < tasksTable.rows.length; i++) {
        const row = tasksTable.rows[i];
        const task = {
            taskText: row.cells[0].textContent,
            deadlineDate: row.cells[1].textContent,
        };
        tasks.push(task);
    }

    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    const tasksTable = document.getElementById('tasks-table');
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    tasks.forEach(function(task) {
        const deadlineDate = new Date(task.deadlineDate);
        addTask(task.taskText, deadlineDate);
    });
}
