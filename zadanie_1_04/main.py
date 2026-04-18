class Student:
    def __init__(self, id, name, lastname, age, courses):
        self.id = id
        self.name = name
        self.lastname = lastname
        self.age = age
        self.courses = courses

class Course:
    def __init__(self, student_id, course_name):
        self.course_name = course_name
        self.student_id = student_id


students = []
courses = []

with open("courses.txt", "r") as c:
    for line in c:
        s_id, course_name = line.strip().split(",")
        courses.append(Course(s_id, course_name))

with open("students.txt", "r") as s:
    for student in s:
        _id, _name, _lastname, _age = student.strip().split(",")
        student_courses = [c for c in courses if c.student_id == _id]
        students.append(Student(int(_id), _name, _lastname, _age, student_courses))

for student in students:
    course_names = ", ".join(c.course_name for c in student.courses)
    print(f"{student.name} {student.lastname} ({student.age} lat): {course_names}")

    filename = f"{student.name.lower()}_{student.lastname.lower()}.txt"
    with open(filename, "w") as f:
        f.write("Kursy:\n")
        for c in student.courses:
            f.write(f" - {c.course_name}\n")
