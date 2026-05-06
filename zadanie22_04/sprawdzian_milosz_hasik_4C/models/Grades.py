__copyright__ = "Zespół Szkół Komunikacji"
__author__ = "Miłosz Hasik 4C"
from typing import List

from models.Student import Student
from models.Subject import Subject


class Grades:
    def __init__(self,student:Student,subject:Subject):
        self.grades:List[int] = []
        self.student = student
        self.subject = subject
    @property
    def add_grade(self,grade:int):
        if 1 <= grade <= 6:
            self.grades.append(grade)
        else:
            ValueError("Grade must be between 1 and 6")
    @property
    def get_grades(self):
        return self.grades
    @property
    def get_average(self):
        return sum(self.grades)/len(self.grades)