// Array to store tasks with deadlines and their trigger count
let tasksWithDateAndTime = [];

// Function to add a task
function addTask() {
    const taskInput = document.getElementById('taskInput');
    const taskDateInput = document.getElementById('taskDate');
    const taskTimeInput = document.getElementById('taskTime');
    const taskText = taskInput.value.trim();
    const taskDate = taskDateInput.value;
    const taskTime = taskTimeInput.value;

    if (taskText && taskDate && taskTime) {
        const taskList = document.getElementById('taskList');
        const listItem = document.createElement('li');
        listItem.style.maxWidth = 'auto'; // Adjust box size according to task name

        // Create task details
        const taskSpan = document.createElement('span');
        taskSpan.textContent = `${taskText} - (${taskDate}) - ${taskTime}`;

        // Create delete button
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.classList.add('delete-btn');
        deleteButton.style.marginLeft = '10px'; // Add space between buttons
        deleteButton.onclick = () => removeTask(taskList, listItem, taskText);

        // Create complete button
        const completeButton = document.createElement('button');
        completeButton.textContent = 'Complete';
        completeButton.classList.add('complete-btn');
        completeButton.style.marginLeft = '10px'; // Add space between buttons
        completeButton.onclick = () => moveToCompleted(taskList, listItem, taskText);

        // Append text, delete button, and complete button
        listItem.appendChild(taskSpan);
        listItem.appendChild(completeButton);
        listItem.appendChild(deleteButton);

        // Add to task list
        taskList.appendChild(listItem);

        // Add task to array
        tasksWithDateAndTime.push({ text: taskText, date: taskDate, time: taskTime, triggerCount: 0 });

        alert(`Task "${taskText}" added for ${taskDate} at ${taskTime}.`);

        // Clear inputs
        taskInput.value = '';
        taskDateInput.value = '';
        taskTimeInput.value = '';
    }
}

// Function to remove a task
function removeTask(taskList, listItem, taskText) {
    taskList.removeChild(listItem);
    tasksWithDateAndTime = tasksWithDateAndTime.filter(task => task.text !== taskText);
}

// Function to move task to completed list
function moveToCompleted(taskList, listItem, taskText) {
    const completedList = document.getElementById('completedList');
    taskList.removeChild(listItem);

    const completedItem = document.createElement('li');
    completedItem.style.maxWidth = 'auto'; // Adjust box size according to task name

    const completedSpan = document.createElement('span');
    completedSpan.textContent = taskText;

    // Create delete button for completed task
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.classList.add('delete-btn');
    deleteButton.style.marginLeft = '10px'; // Add space between buttons
    deleteButton.onclick = () => completedList.removeChild(completedItem);

    // Append elements
    completedItem.appendChild(completedSpan);
    completedItem.appendChild(deleteButton);

    completedList.appendChild(completedItem);
}

// Function to update the clock
function updateClock() {
    const clockElement = document.getElementById("clock");
    const now = new Date();

    let hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const amPm = hours < 12 ? "AM" : "PM";

    // Format time
    hours = hours % 12 || 12;
    const formattedTime = `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)} ${amPm}`;
    clockElement.textContent = formattedTime;

    // Check tasks
    const currentDate = now.toISOString().split('T')[0];
    const currentTime = `${padZero(now.getHours())}:${padZero(minutes)}`;
    checkTaskDateAndTime(currentDate, currentTime);
}

// Function to pad numbers with leading zero
function padZero(num) {
    return num < 10 ? `0${num}` : num;
}

// Function to check task deadlines
function checkTaskDateAndTime(currentDate, currentTime) {
    tasksWithDateAndTime.forEach(task => {
        if (task.date === currentDate && task.time === currentTime) {
            if (task.triggerCount < 2) { // Limit alerts and sounds to 4 times
                ringBell();
                alert(`Reminder: ${task.text}`);
                task.triggerCount++;
            } else {
                console.log(`Task "${task.text}" reached alert limit.`);
            }
        }
    });
}

// Function to play notification sound
function ringBell() {
    const bellSound = document.getElementById('bellSound');
    bellSound.play().catch(error => console.error('Audio play failed:', error));
}

// Initialize clock update
setInterval(updateClock, 1000);
