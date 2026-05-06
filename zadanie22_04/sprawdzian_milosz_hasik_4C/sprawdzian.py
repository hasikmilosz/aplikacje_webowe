__copyright__ = "Zespół Szkół Komunikacji"
__author__ = "Miłosz Hasik 4C"

import datetime
from typing import List

from models.Grades import Grades
from models.Student import Student
from models.Subject import Subject
from models.Teacher import Teacher
from year_grade import year_grade
import json

teacher_list: List[Teacher] = []
subject_list: List[Subject] = []
student_list: List[Student] = []
grade_records: List[Grades] = []

with open("teachers.txt", "r") as file_teachers:
    for row in file_teachers.readlines():
        t_id, first_name, last_name = row.strip().split(" ")
        t_id = int(t_id)
        teacher_list.append(Teacher(t_id, first_name, last_name))

with open("subjects.txt", "r") as file_subjects:
    for row in file_subjects.readlines():
        subj_id, subj_name, teacher_id = row.strip().split(" ")
        subj_id = int(subj_id)
        teacher_id = int(teacher_id)
        found_teacher = next((item for item in teacher_list if item._id == teacher_id), None)
        if found_teacher:
            subject_list.append(Subject(subj_id, subj_name, found_teacher))

with open("students.txt", "r") as file_students:
    for row in file_students.readlines():
        stud_id, first_name, last_name, birth = row.strip().split(" ")
        stud_id = int(stud_id)
        birth = datetime.datetime.strptime(birth, '%Y-%m-%d').date()
        student_list.append(Student(stud_id, first_name, last_name, birth))

with open("grades.txt", "r") as file_grades:
    for row in file_grades.readlines():
        stud_id, subj_id, grade_line = row.strip().split(" ")
        stud_id = int(stud_id)
        subj_id = int(subj_id)
        grade_values = grade_line.strip().split(",")

        grade_numbers: List[int] = []
        for g in grade_values:
            grade_numbers.append(int(g))

        found_student = next((item for item in student_list if item._id == stud_id), None)
        found_subject = next((item for item in subject_list if item._id == subj_id), None)

        if found_student and found_subject:
            grade_obj = Grades(found_student, found_subject)
            grade_obj.grades = grade_numbers
            grade_records.append(grade_obj)

student_results = []

for student_obj in student_list:
    print(student_obj)
    student_label = str(student_obj)
    student_entry = {student_label: {}}

    for subject_obj in subject_list:
        print("\t", subject_obj.name)

        for record in (rec for rec in grade_records if rec.student == student_obj and rec.subject == subject_obj):
            grades_text = ", ".join(map(str, record.get_grades))
            average_val = round(record.get_average, 2)
            final_grade = year_grade(average_val)

            print("\t\tOceny:", grades_text)
            print("\t\tŚrednia:", average_val)
            print("\t\tOcena:", final_grade)

            student_entry[student_label][subject_obj.name] = {
                "Oceny": grades_text,
                "Srednia": average_val,
                "Ocena roczna": final_grade
            }

    student_results.append(student_entry)
    print("\n")

with open('students.json', 'w', encoding='utf-8') as output_students:
    json.dump(student_results, output_students, indent=4, ensure_ascii=False)

print("=" * 50)
print()

subject_results = []

for subject_obj in subject_list:
    subject_label = str(subject_obj.name)
    subject_entry = {subject_label: {}}

    print(subject_obj.name + ":")

    for teacher_obj in (t for t in teacher_list if t == subject_obj.teacher):
        print("\tNauczyciel:", teacher_obj)

        collected_grades = []
        for record in (rec for rec in grade_records if rec.subject == subject_obj):
            collected_grades.extend(record.get_grades)

        grades_text = ", ".join(map(str, collected_grades))
        print("\tOceny:", grades_text)

        subject_entry[subject_label] = {
            "Nauczyciel": str(teacher_obj),
            "Oceny": collected_grades
        }

    subject_results.append(subject_entry)

with open('subjects.json', 'w', encoding='utf-8') as output_subjects:
    json.dump(subject_results, output_subjects, indent=4, ensure_ascii=False)