// Основні конструкції

sig User {
    tasks: set Task,      // Кожен користувач має набір задач
    lists: set List       // Кожен користувач може мати набір списків
}

sig Task {
    title: String,        // Назва задачі
    assignedTo: User,     // Задача призначена користувачу
    list: lone List        // Задача належить лише одному списку
}

sig List {
    title: String,        // Назва списку
    tasks: set Task       // Список має набір задач
}

// Записи обмежень

fact {
    // Кожен користувач має хоча б одну задачу
    all u: User | #u.tasks >= 1

    // Кожна задача може входити лише до одного списку
    all t: Task | one t.list

    // Список може містити кілька задач
    all l: List | #l.tasks >= 0

    // Користувач може створювати кілька списків
    all u: User | #u.lists >= 0
}

// Предикат для перевірки
pred checkConstraints {
    some u: User, l: List, t: Task |
        u.lists = l and
        l.tasks = t and
        t.assignedTo = u and
        t.list = l
}

// Виконати перевірку
run checkConstraints for 5 but 5 User, 5 Task, 5 List
