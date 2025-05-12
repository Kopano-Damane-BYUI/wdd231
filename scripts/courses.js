// Modify course completion status here
const courses = [
    {
        subject: 'CSE',
        number: 110,
        title: 'Introduction to Programming',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'This course will introduce students to programming. It will introduce the building blocks of programming languages (variables, decisions, calculations, loops, array, and input/output) and use them to solve problems.',
        technology: ['Python'],
        completed: true
    },
    {
        subject: 'WDD',
        number: 130,
        title: 'Web Fundamentals',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'This course introduces students to the World Wide Web and to careers in web site design and development...',
        technology: ['HTML', 'CSS'],
        completed: true
    },
    {
        subject: 'CSE',
        number: 111,
        title: 'Programming with Functions',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'CSE 111 students become more organized, efficient, and powerful computer programmers...',
        technology: ['Python'],
        completed: true
    },
    {
        subject: 'CSE',
        number: 210,
        title: 'Programming with Classes',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'This course will introduce the notion of classes and objects...',
        technology: ['C#'],
        completed: false
    },
    {
        subject: 'WDD',
        number: 131,
        title: 'Dynamic Web Fundamentals',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'This course builds on prior experience in Web Fundamentals and programming...',
        technology: ['HTML', 'CSS', 'JavaScript'],
        completed: false
    },
    {
        subject: 'WDD',
        number: 231,
        title: 'Frontend Web Development I',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'This course builds on prior experience with Dynamic Web Fundamentals and programming...',
        technology: ['HTML', 'CSS', 'JavaScript'],
        completed: false
    }
];

// DOM references
const courseContainer = document.querySelector('.courses');
const filterButtons = document.querySelectorAll('.filter-buttons button');

// Function to render courses dynamically
function renderCourses(courseList) {
    courseContainer.innerHTML = ''; // Clear existing

    let totalCredits = courseList.reduce((sum, course) => sum + course.credits, 0);

    const creditsSpan = document.createElement('p');
    creditsSpan.textContent = `Total Credits: ${totalCredits}`;
    creditsSpan.style.marginTop = '15px';
    creditsSpan.style.fontWeight = 'bold';
    creditsSpan.style.textAlign = 'center';
    creditsSpan.style.gridColumn = '1 / -1'; // Span entire grid width
    courseContainer.prepend(creditsSpan); // Insert at top of grid

    courseList.forEach(course => {
        const courseSpan = document.createElement('span');
        courseSpan.textContent = `${course.subject} ${course.number} - ${course.title}`;

        courseSpan.style.display = 'block';
        courseSpan.style.margin = '10px 0';
        courseSpan.style.padding = '10px';
        courseSpan.style.borderRadius = '5px';
        courseSpan.style.backgroundColor = course.completed ? '#c8e6c9' : '#ffcdd2'; // Green for completed, red for incomplete
        courseSpan.style.border = course.completed ? '1px solid #2e7d32' : '1px solid #c62828';

        courseContainer.appendChild(courseSpan);
    });
}

// Filter handler
function handleFilter(subject) {
    if (subject === 'All') {
        renderCourses(courses);
    } else {
        const filtered = courses.filter(course => course.subject === subject);
        renderCourses(filtered);
    }
}

// Attach event listeners
filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        handleFilter(button.textContent.trim());
    });
});

// Initial load
renderCourses(courses);
